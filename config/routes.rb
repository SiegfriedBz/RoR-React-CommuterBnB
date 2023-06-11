Rails.application.routes.draw do
  devise_for :users,
  path: '',
  path_names: { 
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations' 
  }

  root to: 'components#index'
  # get 'components/index'
  get '/*path', to: 'components#index', via: :all, constraints: lambda { |req| req.path.exclude?('api/v1') && !req.path.include?('signup') }


  get 'home/check'
end
