puts "Clearing existing employees..."
Employee.delete_all

first_names = File.readlines(Rails.root.join("db/first_names.txt")).map(&:strip).reject(&:empty?)
last_names = File.readlines(Rails.root.join("db/last_names.txt")).map(&:strip).reject(&:empty?)

job_titles = [
  "Software Engineer", "Senior Software Engineer", "Staff Engineer",
  "Engineering Manager", "Product Manager", "Senior Product Manager",
  "Data Analyst", "Senior Data Analyst", "Data Scientist",
  "UX Designer", "Senior UX Designer", "UI Designer",
  "HR Specialist", "HR Manager", "Recruiter",
  "Finance Analyst", "Accountant", "DevOps Engineer",
  "QA Engineer", "Technical Writer"
]

countries = [
  "India", "USA", "UK", "Germany", "Canada",
  "Australia", "France", "Japan", "Brazil", "Netherlands"
]

departments = [
  "Engineering", "Product", "Data", "Design",
  "Human Resources", "Finance", "Operations", "QA"
]

statuses = ["active", "active", "active", "active", "on_leave", "terminated"]

salary_ranges = {
  "India"       => 500_000..4_000_000,
  "USA"         => 60_000..220_000,
  "UK"          => 35_000..150_000,
  "Germany"     => 40_000..140_000,
  "Canada"      => 50_000..180_000,
  "Australia"   => 55_000..190_000,
  "France"      => 35_000..130_000,
  "Japan"       => 4_000_000..15_000_000,
  "Brazil"      => 40_000..200_000,
  "Netherlands" => 38_000..135_000
}

currency_map = {
  "India" => "INR", "USA" => "USD", "UK" => "GBP",
  "Germany" => "EUR", "Canada" => "CAD", "Australia" => "USD",
  "France" => "EUR", "Japan" => "USD", "Brazil" => "USD",
  "Netherlands" => "EUR"
}

BATCH_SIZE = 2_000
total = 10_000
now = Time.current

puts "Generating #{total} employees..."

total.times.each_slice(BATCH_SIZE) do |batch|
  records = batch.map do
    country = countries.sample
    range = salary_ranges[country]
    hire_start = Date.new(2015, 1, 1)
    hire_end = Date.new(2026, 3, 1)

    fn = first_names.sample
    ln = last_names.sample

    {
      first_name: fn,
      last_name: ln,
      full_name: "#{fn} #{ln}",
      job_title: job_titles.sample,
      department: departments.sample,
      country: country,
      salary: rand(range),
      currency: currency_map[country],
      hire_date: rand(hire_start..hire_end),
      employment_status: statuses.sample,
      created_at: now,
      updated_at: now
    }
  end

  Employee.insert_all(records)
  puts "  Inserted #{batch.last + 1} / #{total}"
end

puts "Seeding complete. Total employees: #{Employee.count}"
