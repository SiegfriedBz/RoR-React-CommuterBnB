# frozen_string_literal: true

class Api::V1::FlatsController < ApplicationController
    before_action :authenticate_user!, only: %i[create update destroy]
    before_action :selected_flat, only: %i[show update destroy]
    # rescue_from ActiveRecord::RecordNotFound, with: :not_found

    def index
        flats = Flat.all.order(updated_at: :desc)

        serialized_flats = flats.map do |flat|
            serialized_flat(flat)
        end
        
        render json: { flats: serialized_flats }, status: :ok
    end

    def show
        return render json: { message: 'Property not found.'}, status: :not_found if @flat.nil?

        render json: { flat: serialized_flat(@flat) }, status: :ok
    end

    def search
        flats = Flat.filter(params).order(updated_at: :desc)

        serialized_flats = flats.map do |flat|
            serialized_flat(flat)
        end
        
        render json: { flats: serialized_flats }, status: :ok
    end

    def create
        flat = Flat.new(flat_params.except(:images))
        flat.user = current_user

        attach_images(flat) if params[:flat][:images].present?

        if flat.save
            render json: {
                flat: serialized_flat(flat),
                message: 'Property created sucessfully'
            },
                status: :created
        else
            render json: { message: 'Property creation went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end

    def update
        return render json: { message: 'Property not found.'}, status: :not_found if @flat.nil?

        return render json: { message: 'Only owner can update its property.' },
            status: :unauthorized unless current_user_is_owner(@flat)

        attach_images(@flat) if params[:flat][:images].present?
    
        if @flat.update(flat_params.except(:images))
            render json: {
                flat: serialized_flat(@flat),
                message: "Property ##{params[:id]} updated sucessfully"
                },
                status: :ok
        else
            render json: { message: 'Updating property went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end

    def destroy
        return render json: { message: 'Property not found.'}, status: :not_found if @flat.nil?

        return render json: { message: 'Only owner can delete its property.'},
            status: :unauthorized unless current_user_is_owner(@flat)

        if @flat.destroy
            render json: { message: "Property ##{params[:id]} was deleted sucessfully" },
                status: :ok
        else
            render json: { message: 'Deleting property went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end
      
    private

    def selected_flat
        @flat = Flat.find_by(id: params[:id])
    end

    def serialized_flat(flat)
        FlatSerializer.new(flat).serializable_hash[:data][:attributes]
    end

    def serialized_owner(owner)
        UserSerializer.new(owner).serializable_hash[:data][:attributes]
    end

    def current_user_is_owner(flat)
        flat.user == current_user
    end

    def attach_images(flat)
        params[:flat][:images].each do |image|
            flat.images.attach(image)
        end
    end

    # def filter_params
    #     params.permit(:city, :country, :start_date, :end_date, :category).fetch(:flat, {})
    # end

    def flat_params
        params.fetch(:flat, {}).permit(:flat, :start_date, :end_date, :title, :description, :street, :city, :country, :price_per_night_in_cents, :available, :category, images: [])
    end
end
