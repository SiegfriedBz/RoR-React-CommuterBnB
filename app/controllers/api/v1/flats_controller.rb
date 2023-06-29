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

    # get flat with owner details
    # TODO: add flat reviews
    def show
        render json: { flat: serialized_flat(@flat).merge(owner: serialized_owner(@flat.user))},
            status: :ok

        # flat_reviews = Review.joins(transaction: [:flat_a, :flat_b])
        #           .where('transactions.flat_a_id = ? OR transactions.flat_b_id = ?', flat.id, flat.id)

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

        attach_images(flat) if params[:@flat][:images].present?
    
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

        if flat.destroy
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

    def flat_params
        params.require(:flat).permit(:title, :description, :street, :city, :country, :price_per_night_in_cents, :available, :category, images: [])
    end
end
