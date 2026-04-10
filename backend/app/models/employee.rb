class Employee < ApplicationRecord
  VALID_CURRENCIES = %w[USD EUR GBP INR CAD].freeze

  validates :first_name, :last_name, :full_name, :job_title, :country, :salary, presence: true
  validates :first_name, :last_name, length: { maximum: 100 }
  validates :job_title, length: { maximum: 150 }
  validates :country, length: { maximum: 100 }
  validates :department, length: { maximum: 100 }, allow_nil: true
  validates :salary, numericality: { greater_than: 0 }
  validates :currency, inclusion: { in: VALID_CURRENCIES }, allow_nil: true

  before_validation :set_full_name

  private

  def set_full_name
    self.full_name = "#{first_name} #{last_name}" if first_name && last_name
  end
end