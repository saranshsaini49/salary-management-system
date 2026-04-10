FactoryBot.define do
  factory :employee do
    sequence(:first_name) { |n| "First#{n}" }
    sequence(:last_name) { |n| "Last#{n}" }
    job_title { "Software Engineer" }
    department { "Engineering" }
    country { "USA" }
    salary { 100_000 }
    currency { "USD" }
    hire_date { Date.new(2023, 1, 15) }
    employment_status { "active" }
  end
end
