class ApplicationController < ActionController::Base

       # trick response.status 422
       protect_from_forgery with: :null_session 
end
