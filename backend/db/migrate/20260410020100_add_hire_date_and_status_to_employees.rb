class AddHireDateAndStatusToEmployees < ActiveRecord::Migration[7.1]
  def change
    add_column :employees, :hire_date, :date
    add_column :employees, :employment_status, :string, default: "active", null: false

    add_index :employees, :employment_status
    add_index :employees, :hire_date
  end
end
