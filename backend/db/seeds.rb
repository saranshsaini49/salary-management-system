# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
first_names = File.readlines(Rails.root.join("db/first_names.txt")).map(&:strip)
last_names = File.readlines(Rails.root.join("db/last_names.txt")).map(&:strip)

job_titles = ["Engineer", "Manager", "Designer", "Analyst", "HR"]
countries = ["India", "USA", "UK", "Germany", "Canada"]
departments = ["Engineering", "HR", "Design", "Finance"]

records = []

10_000.times do
  fn = first_names.sample
  ln = last_names.sample

  records << {
    first_name: fn,
    last_name: ln,
    full_name: "#{fn} #{ln}",
    job_title: job_titles.sample,
    department: departments.sample,
    country: countries.sample,
    salary: rand(30000..150000),
    currency: "USD",
    created_at: Time.now,
    updated_at: Time.now
  }
end

Employee.insert_all(records)