# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_04_10_020100) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "employees", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "full_name", null: false
    t.string "job_title", null: false
    t.string "department"
    t.string "country", null: false
    t.decimal "salary", precision: 12, scale: 2, null: false
    t.string "currency", default: "USD"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "hire_date"
    t.string "employment_status", default: "active", null: false
    t.index ["country", "job_title"], name: "index_employees_on_country_and_job_title"
    t.index ["country"], name: "index_employees_on_country"
    t.index ["employment_status"], name: "index_employees_on_employment_status"
    t.index ["full_name"], name: "index_employees_on_full_name"
    t.index ["hire_date"], name: "index_employees_on_hire_date"
    t.index ["job_title"], name: "index_employees_on_job_title"
  end

end
