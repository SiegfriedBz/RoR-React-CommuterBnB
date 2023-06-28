class Api::V1::FavoritesController < ApplicationController
    before_action :authenticate_user!

    # send back all the flats with a boolean isUserFavorite
    def index
        flats = Flat.all
   
        serialized_flats = flats.map do |flat|
          is_user_favorite = flat.favorites.find_by(user_id: current_user.id).present?
          serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes].merge(
              isUserFavorite: is_user_favorite
          )
        end
      
        render json: { flats: serialized_flats }, status: :ok
      end
      

    def create
        flat = Flat.find_by(id: params[:flat_id])
        favorite = current_user.favorites.new(flat: flat)

        if favorite.save
            serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes].merge(
              isUserFavorite: true
          )
            render json: {
                favoriteFlat: serialized_flat,
                message: 'Favorite added sucessfully'
              }, status: :created
        else
            render json: { message: 'Favorite creation went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end
  
    def destroy
        flat = Flat.find_by(id: params[:flat_id])
        return render json: { message: 'Property not found.'}, status: :not_found if flat.nil?

        favorite = current_user.favorites.find_by(flat_id: flat.id)
        return render json: { message: 'Favorite not found.'}, status: :not_found if favorite.nil?

        if favorite.destroy
          render json: { message: 'Property removed from favorites!' }, status: :ok
        else
          render json: { error: 'Failed to remove flat from favorites' }, status: :unprocessable_entity
        end
    end

    private

    def favorite_params
      params.require(:favorite).permit(:flat_id)
    end
  end
