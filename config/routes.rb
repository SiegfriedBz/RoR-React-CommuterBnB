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

  get 'home/check'
  root to: 'components#index'
  # get 'components/index'
  get '/*path', to: 'components#index', via: :all, constraints: lambda { |req| req.path.exclude?('api/v1') }
end
