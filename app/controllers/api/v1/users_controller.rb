class Api::V1::UsersController < ApplicationController
    before_action :authenticate_user!, only: [:show]

    def show
        user = User.find(params[:id])

        return render json: { message: 'User not found.'}, status: :not_found if user.nil?

        return render json: { message: 'Unauthorized.'}, status: :unauthorized unless current_user.id == user.id

        render json: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]},
            status: :ok
    end
end
