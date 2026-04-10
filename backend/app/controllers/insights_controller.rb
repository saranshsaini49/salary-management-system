class InsightsController < ApplicationController
  # GET /insights/country/:country
  def country
    country = params[:country]

    result = SalaryInsightsService.country_stats(country)

    render json: result
  end

  # GET /insights/job_title
  def job_title
    country = params[:country]
    job_title = params[:job_title]

    result = SalaryInsightsService.job_title_stats(country, job_title)

    render json: result
  end

  # GET /insights/top_roles
  def top_roles
    result = SalaryInsightsService.top_paying_roles

    render json: result
  end
end