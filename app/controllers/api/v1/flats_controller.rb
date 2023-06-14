# frozen_string_literal: true

class Api::V1::FlatsController < ApplicationController
    before_action :authenticate_user!, only: [:create, :update, :destroy]
    # rescue_from ActiveRecord::RecordNotFound, with: :not_found

    # get all flats
    def index
        flats = Flat.all

        serialized_flats = flats.map do |flat|
            FlatSerializer.new(flat).serializable_hash[:data][:attributes]
          end

        render json: {
            flats: serialized_flats
          }, status: :ok
    end

    # TODO : get flat and associated reviews
    def show
        flat = Flat.find(params[:id])
        serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes]

        render json: {
            flat: serialized_flat
          }, status: :ok

        # flat_reviews = Review.joins(transaction: [:flat_a, :flat_b])
        #           .where('transactions.flat_a_id = ? OR transactions.flat_b_id = ?', flat.id, flat.id)

        # render json: flat_with_cl_image_url(flat).merge(
        #     reviews: flat_reviews
        # )
    end

    def create
        flat = Flat.new(flat_params.except(:images))
        flat.user = current_user

        if params[:flat][:images].present?
            params[:flat][:images].each do |image|
                flat.images.attach(image)
            end
        end
      
        if flat.save
            serialized_flat = FlatSerializer.new(flat).serializable_hash[:data][:attributes]
            
            render json: {
                flat: serialized_flat,
                message: 'Flat created sucessfully'
              }, status: :created
        else
            render json: { message: 'Flat creation went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end
      
    private

    def flat_params
        params.require(:flat).permit(:title, :description, :address, :price_per_night_in_cents, :available, :category, images: [])
    end
end
