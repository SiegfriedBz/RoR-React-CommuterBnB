# frozen_string_literal: true

class Api::V1::FlatsController < ApplicationController
    before_action :authenticate_user!, only: [:create, :update, :destroy]
    # rescue_from ActiveRecord::RecordNotFound, with: :not_found

    def index
        flats = Flat.all
        flats = flats.order(updated_at: :desc)

        serialized_flats = flats.map do |flat|
            FlatSerializer.new(flat).serializable_hash[:data][:attributes]
          end

        render json: {
            flats: serialized_flats
          }, status: :ok
    end

    # get flat with owner details
    # TODO: add flat reviews
    def show
        flat = Flat.find(params[:id])
        owner = flat.user
        
        serialized_owner = UserSerializer.new(owner).serializable_hash[:data][:attributes]
        serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes].merge(
            owner: serialized_owner
        )

        render json: {
            flat: serialized_flat
        }, status: :ok

        # flat_reviews = Review.joins(transaction: [:flat_a, :flat_b])
        #           .where('transactions.flat_a_id = ? OR transactions.flat_b_id = ?', flat.id, flat.id)

    end

    def create
        flat = Flat.new(flat_params.except(:images))
        flat.user = current_user
        debugger

        if params[:flat][:images].present?
            params[:flat][:images].each do |image|
                flat.images.attach(image)
            end
        end
      
        if flat.save
            debugger
            serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes]
            render json: {
                flat: serialized_flat,
                message: 'Property created sucessfully'
              }, status: :created
        else
            debugger
            render json: { message: 'Property creation went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end

    def update
        flat = Flat.find_by(id: params[:id])

        return render json: { message: 'Property not found.'}, status: :not_found if flat.nil?
        return render json: { message: 'You must be the owner of this property to update it.'}, status: :unauthorized unless current_user_is_owner(flat)

        if params[:flat][:images].present?
            params[:flat][:images].each do |image|
                flat.images.attach(image)
            end
        end

        if flat.update(flat_params.except(:images))
            serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes]
            
            render json: {
                flat: serialized_flat,
                message: "Property ##{params[:id]} updated sucessfully"
                }, status: :ok
        else
            render json: { message: 'Property update went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end

    def destroy
        flat = Flat.find_by(id: params[:id])

        return render json: { message: 'Property not found.'}, status: :not_found if flat.nil?
        return render json: { message: 'You must be the owner of this property to delete it.'}, status: :unauthorized unless current_user_is_owner(flat)

        if flat.destroy
            render json: { message: "Property ##{params[:id]} was deleted sucessfully" }, status: :ok
        else
            render json: { message: 'Property deletion went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end
      
    private

    def current_user_is_owner(flat)
        flat.user == current_user
    end

    def flat_params
        params.require(:flat).permit(:title, :description, :street, :city, :country, :price_per_night_in_cents, :available, :category, images: [])
    end
end
