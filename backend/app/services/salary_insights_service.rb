class SalaryInsightsService
  def self.country_stats(country)
    employees = Employee.where(country: country)

    {
      country: country,
      total_employees: employees.count,
      min_salary: employees.minimum(:salary),
      max_salary: employees.maximum(:salary),
      avg_salary: employees.average(:salary)&.to_f,
      median_salary: median(employees),
      salary_distribution: salary_distribution(country)
    }
  end

  def self.job_title_stats(country, job_title)
    employees = Employee.where(country: country, job_title: job_title)

    {
      country: country,
      job_title: job_title,
      total_employees: employees.count,
      avg_salary: employees.average(:salary)&.to_f
    }
  end

  def self.top_paying_roles(limit = 5)
    Employee
      .select("job_title, AVG(salary) as avg_salary")
      .group(:job_title)
      .order("avg_salary DESC")
      .limit(limit)
  end

  def self.salary_distribution(country)
    Employee
      .where(country: country)
      .group("FLOOR(salary / 10000) * 10000")
      .count
      .map do |range, count|
        {
          range: "#{range}-#{range + 10000}",
          count: count
        }
      end
  end

  private

  def self.median(scope)
    scope.pick(Arel.sql("PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)"))
  end
end