require 'rails_helper'

RSpec.describe SalaryInsightsService do
  before do
    create(:employee, country: "USA", job_title: "Engineer", salary: 80_000)
    create(:employee, country: "USA", job_title: "Engineer", salary: 120_000)
    create(:employee, country: "USA", job_title: "Designer", salary: 95_000)
    create(:employee, country: "India", job_title: "Engineer", salary: 40_000)
  end

  describe ".country_stats" do
    it "returns correct stats for a country" do
      result = described_class.country_stats("USA")

      expect(result[:country]).to eq("USA")
      expect(result[:total_employees]).to eq(3)
      expect(result[:min_salary].to_f).to eq(80_000.0)
      expect(result[:max_salary].to_f).to eq(120_000.0)
      expect(result[:avg_salary]).to be_within(0.01).of(98_333.33)
      expect(result[:median_salary]).to be_present
      expect(result[:salary_distribution]).to be_an(Array)
    end

    it "returns zeros/nils for unknown country" do
      result = described_class.country_stats("Mars")

      expect(result[:total_employees]).to eq(0)
      expect(result[:min_salary]).to be_nil
    end
  end

  describe ".job_title_stats" do
    it "returns correct stats for a role in a country" do
      result = described_class.job_title_stats("USA", "Engineer")

      expect(result[:total_employees]).to eq(2)
      expect(result[:avg_salary]).to be_within(0.01).of(100_000.0)
    end

    it "returns zero count for non-existent combination" do
      result = described_class.job_title_stats("India", "Designer")

      expect(result[:total_employees]).to eq(0)
      expect(result[:avg_salary]).to be_nil
    end
  end

  describe ".top_paying_roles" do
    it "returns roles ordered by avg salary descending" do
      result = described_class.top_paying_roles

      titles = result.map(&:job_title)
      expect(titles).to include("Engineer", "Designer")
      expect(result.first.avg_salary.to_f).to be >= result.last.avg_salary.to_f
    end

    it "respects the limit parameter" do
      result = described_class.top_paying_roles(1)
      expect(result.length).to eq(1)
    end
  end
end
