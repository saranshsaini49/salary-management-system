require 'rails_helper'

RSpec.describe "Employees", type: :request do
  describe "GET /employees" do
    before { create_list(:employee, 25) }

    it "returns paginated employees with metadata" do
      get "/employees"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["data"].length).to eq(20)
      expect(json["meta"]["total_count"]).to eq(25)
      expect(json["meta"]["total_pages"]).to eq(2)
      expect(json["meta"]["current_page"]).to eq(1)
    end

    it "respects page and per_page params" do
      get "/employees", params: { page: 2, per_page: 10 }
      json = JSON.parse(response.body)

      expect(json["data"].length).to eq(10)
      expect(json["meta"]["current_page"]).to eq(2)
    end

    it "caps per_page at 100" do
      get "/employees", params: { per_page: 500 }
      json = JSON.parse(response.body)

      expect(json["meta"]["per_page"]).to eq(100)
    end

    it "filters by country" do
      create(:employee, country: "Germany")
      get "/employees", params: { country: "Germany" }
      json = JSON.parse(response.body)

      expect(json["data"]).to all(include("country" => "Germany"))
    end

    it "filters by job_title" do
      create(:employee, job_title: "Designer")
      get "/employees", params: { job_title: "Designer" }
      json = JSON.parse(response.body)

      expect(json["data"]).to all(include("job_title" => "Designer"))
    end

    it "searches by full_name" do
      create(:employee, first_name: "Unique", last_name: "Person")
      get "/employees", params: { search: "Unique" }
      json = JSON.parse(response.body)

      expect(json["data"].length).to eq(1)
      expect(json["data"].first["full_name"]).to eq("Unique Person")
    end
  end

  describe "GET /employees/:id" do
    it "returns the employee" do
      employee = create(:employee)
      get "/employees/#{employee.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(employee.id)
    end

    it "returns 404 for non-existent employee" do
      get "/employees/999999"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /employees" do
    let(:valid_params) do
      {
        employee: {
          first_name: "John", last_name: "Doe",
          job_title: "Engineer", country: "USA",
          salary: 120_000, department: "Engineering"
        }
      }
    end

    it "creates an employee" do
      expect {
        post "/employees", params: valid_params
      }.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["full_name"]).to eq("John Doe")
    end

    it "returns 422 with invalid data" do
      post "/employees", params: { employee: { first_name: "John" } }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to be_present
    end

    it "rejects negative salary" do
      post "/employees", params: { employee: valid_params[:employee].merge(salary: -100) }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PUT /employees/:id" do
    let(:employee) { create(:employee) }

    it "updates the employee" do
      put "/employees/#{employee.id}", params: { employee: { salary: 150_000 } }

      expect(response).to have_http_status(:ok)
      expect(employee.reload.salary).to eq(150_000)
    end

    it "returns 422 with invalid data" do
      put "/employees/#{employee.id}", params: { employee: { salary: -1 } }

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "returns 404 for non-existent employee" do
      put "/employees/999999", params: { employee: { salary: 100 } }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /employees/:id" do
    it "deletes the employee" do
      employee = create(:employee)

      expect {
        delete "/employees/#{employee.id}"
      }.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 for non-existent employee" do
      delete "/employees/999999"
      expect(response).to have_http_status(:not_found)
    end
  end
end
