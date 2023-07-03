Rails.application.routes.draw do
  # action cable server
  mount ActionCable.server => '/cable'

  # devise
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
      resources :messages, only: %i[index create]
      get 'flats/search', to: 'flats#search'
      resources :flats do
        resources :favorites, only: %i[create]
        delete :favorites, to: 'favorites#destroy'
        resources :transaction_requests, only: %i[create] do
          resources :reviews, only: %i[create]
        end
      end
      resources :transaction_requests, only: %i[index update destroy] do
        resources :payments, only: %i[create]
      end
      resources :favorites, only: %i[index]
      resources :payments, only: %i[index]
    end
  end

  get '/*path', to: 'components#index', via: :all
end
