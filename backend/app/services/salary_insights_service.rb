class SalaryInsightsService
  def self.country_stats(country)
    employees = Employee.where(country: country)

    {
      country: country,
      total_employees: employees.count,
      min_salary: employees.minimum(:salary),
      max_salary: employees.maximum(:salary),
      avg_salary: employees.average(:salary)&.to_f,
      median_salary: median(employees)
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
  end

  private

  def self.median(scope)
    salaries = scope.order(:salary).pluck(:salary)
    return nil if salaries.empty?

    mid = salaries.length / 2

    if salaries.length.odd?
      salaries[mid]
    else
      (salaries[mid - 1] + salaries[mid]) / 2.0
    end
  end
end