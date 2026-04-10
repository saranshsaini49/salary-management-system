class InsightsController < ApplicationController
  # GET /insights/country/:country
  def country
    country = params[:country]

    result = SalaryInsightsService.country_stats(country)

    if result[:total_employees] == 0
      render json: { error: "No employees found for country: #{country}" }, status: :not_found
    else
      render json: result
    end
  end

  # GET /insights/job_title
  def job_title
    country = params[:country]
    job_title = params[:job_title]

    if country.blank? || job_title.blank?
      return render json: { error: "Both 'country' and 'job_title' params are required" }, status: :bad_request
    end

    result = SalaryInsightsService.job_title_stats(country, job_title)

    if result[:total_employees] == 0
      render json: { error: "No employees found for #{job_title} in #{country}" }, status: :not_found
    else
      render json: result
    end
  end

  # GET /insights/top_roles
  def top_roles
    result = SalaryInsightsService.top_paying_roles

    render json: result
  end
end