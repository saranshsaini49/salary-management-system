class EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /employees
  def index
    employees = Employee.all

    employees = employees.where("country ILIKE ?", params[:country]) if params[:country].present?
    employees = employees.where("job_title ILIKE ?", params[:job_title]) if params[:job_title].present?

    if params[:search].present?
      employees = employees.where("full_name ILIKE ?", "%#{params[:search]}%")
    end

    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = [[params[:per_page].to_i, 1].max, 100].min
    per_page = 20 if params[:per_page].blank?

    total_count = employees.count
    paginated = employees.order(:id).offset((page - 1) * per_page).limit(per_page)

    render json: {
      data: paginated,
      meta: {
        current_page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end

  # GET /employees/:id
  def show
    render json: @employee
  end

  # POST /employees
  def create
    employee = Employee.new(employee_params)

    if employee.save
      render json: employee, status: :created
    else
      render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /employees/:id
  def update
    if @employee.update(employee_params)
      render json: @employee
    else
      render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /employees/:id
  def destroy
    @employee.destroy
    head :no_content
  end

  private

  def set_employee
    @employee = Employee.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Employee not found" }, status: :not_found
  end

  def employee_params
    params.require(:employee).permit(
      :first_name,
      :last_name,
      :job_title,
      :department,
      :country,
      :salary,
      :currency
    )
  end
end