Rails.application.routes.draw do
  root 'components#index'
  # get 'components/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  get 'home/check'
end
