Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "/health", to: "health#index"
  get "up" => "rails/health#show", as: :rails_health_check

  resources :employees

  get "/insights/country/:country", to: "insights#country"
  get "/insights/job_title", to: "insights#job_title"
  get "/insights/top_roles", to: "insights#top_roles"
end
