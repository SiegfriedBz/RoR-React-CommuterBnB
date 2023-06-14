Rails.application.routes.draw do
  devise_for :users,
  path: '',
  path_names: { 
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/users/sessions',
    registrations: 'api/v1/users/registrations' 
  }

  root to: 'components#index'

  get 'home/check'

  namespace :api do
    namespace :v1 do
      resources :flats
    end
  end

  get '/*path', to: 'components#index', via: :all
end
