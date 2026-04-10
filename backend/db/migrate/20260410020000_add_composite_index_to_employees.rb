class AddCompositeIndexToEmployees < ActiveRecord::Migration[7.1]
  def change
    add_index :employees, [:country, :job_title], name: "index_employees_on_country_and_job_title"
  end
end
