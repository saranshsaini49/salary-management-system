class Employee < ApplicationRecord
  validates :first_name, :last_name, :full_name, :job_title, :country, :salary, presence: true

  before_validation :set_full_name

  private

  def set_full_name
    self.full_name = "#{first_name} #{last_name}" if first_name && last_name
  end
end