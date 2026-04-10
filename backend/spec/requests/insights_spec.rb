require 'rails_helper'

RSpec.describe "Insights", type: :request do
  before do
    create(:employee, country: "USA", job_title: "Engineer", salary: 100_000)
    create(:employee, country: "USA", job_title: "Engineer", salary: 200_000)
    create(:employee, country: "USA", job_title: "Designer", salary: 90_000)
    create(:employee, country: "India", job_title: "Engineer", salary: 50_000)
  end

  describe "GET /insights/country/:country" do
    it "returns salary stats for a country" do
      get "/insights/country/USA"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["country"]).to eq("USA")
      expect(json["total_employees"]).to eq(3)
      expect(json["min_salary"].to_f).to eq(90_000.0)
      expect(json["max_salary"].to_f).to eq(200_000.0)
      expect(json["avg_salary"]).to be_within(0.01).of(130_000.0)
      expect(json["median_salary"]).to be_present
    end

    it "returns 404 for a country with no employees" do
      get "/insights/country/Antarctica"

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json["error"]).to include("Antarctica")
    end
  end

  describe "GET /insights/job_title" do
    it "returns avg salary for a job title in a country" do
      get "/insights/job_title", params: { country: "USA", job_title: "Engineer" }
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["avg_salary"]).to be_within(0.01).of(150_000.0)
      expect(json["total_employees"]).to eq(2)
    end

    it "returns 400 when country param is missing" do
      get "/insights/job_title", params: { job_title: "Engineer" }

      expect(response).to have_http_status(:bad_request)
    end

    it "returns 400 when job_title param is missing" do
      get "/insights/job_title", params: { country: "USA" }

      expect(response).to have_http_status(:bad_request)
    end

    it "returns 404 when no employees match" do
      get "/insights/job_title", params: { country: "USA", job_title: "Astronaut" }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /insights/top_roles" do
    it "returns top paying roles" do
      get "/insights/top_roles"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json.length).to be <= 5
      expect(json.first).to have_key("job_title")
      expect(json.first).to have_key("avg_salary")
    end
  end
end
