require 'rails_helper'

RSpec.describe Employee, type: :model do
  subject { build(:employee) }

  describe "validations" do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:job_title) }
    it { should validate_presence_of(:country) }
    it { should validate_presence_of(:salary) }

    it { should validate_length_of(:first_name).is_at_most(100) }
    it { should validate_length_of(:last_name).is_at_most(100) }
    it { should validate_length_of(:job_title).is_at_most(150) }
    it { should validate_length_of(:country).is_at_most(100) }

    it { should validate_numericality_of(:salary).is_greater_than(0) }

    it { should validate_inclusion_of(:currency).in_array(Employee::VALID_CURRENCIES) }
    it { should validate_inclusion_of(:employment_status).in_array(Employee::VALID_STATUSES) }
  end

  describe "callbacks" do
    it "sets full_name from first_name and last_name before validation" do
      employee = build(:employee, first_name: "Jane", last_name: "Doe")
      employee.valid?
      expect(employee.full_name).to eq("Jane Doe")
    end

    it "does not overwrite full_name if first_name is nil" do
      employee = build(:employee, first_name: nil, last_name: "Doe", full_name: nil)
      employee.valid?
      expect(employee.full_name).to be_nil
    end
  end

  describe "edge cases" do
    it "rejects zero salary" do
      employee = build(:employee, salary: 0)
      expect(employee).not_to be_valid
      expect(employee.errors[:salary]).to include("must be greater than 0")
    end

    it "rejects negative salary" do
      employee = build(:employee, salary: -5000)
      expect(employee).not_to be_valid
    end

    it "rejects invalid employment_status" do
      employee = build(:employee, employment_status: "fired")
      expect(employee).not_to be_valid
    end

    it "rejects invalid currency" do
      employee = build(:employee, currency: "BTC")
      expect(employee).not_to be_valid
    end
  end
end
