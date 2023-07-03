# frozen_string_literal: true

class Api::V1::Users::RegistrationsController < Devise::RegistrationsController

  # trick response.status 422
  protect_from_forgery with: :null_session 

  respond_to :json
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  def update
    user_email = current_user.email if user_params[:email].blank?

      current_user.image.attach(user_params[:image]) if user_params[:image].present?

    if current_user.update(user_params.except(:image))
      render json: { message: 'You updated your profile successfully' }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

  private 

  def respond_with(resource, _opts = {})
    if resource.persisted? 
      render json: {
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes],
        message: 'You signed up sucessfully'
      }, status: :created
    else
      render json: {
        message: "User couldn't be created. #{resource.errors.full_messages.to_sentence}" 
      }, status: :unprocessable_entity
    end
  end

  def user_params
    params.require(:user).permit(:email, :description, :password, :password_confirmation, :image)
  end
end
