class Api::V1::ReviewsController < ApplicationController
    before_action :authenticate_user!

    # 1 user 1 completed transaction_request 1 review 1 flat
    def create
        
        # check if the flat exists
        # return render json: { message: 'Property not found.'}, status: :not_found if Flat.find_by(id: review_params[:flat_id]).nil?

        # check if the transaction request exists
        # # return render json: { message: 'Transaction request not found.'}, status: :not_found if TransactionRequest.find_by(id: review_params[:transaction_request_id]).nil?

        # check if the transaction request is completed
        # return render json: { message: 'Transaction request is not completed.'}, status: :unprocessable_entity if TransactionRequest.find_by(id: review_params[:transaction_request_id]).status != 'completed'

        # check that the current user is not owner of the flat
        # return render json: { message: 'You cannot review your own property.'}, status: :unprocessable_entity if Flat.find_by(id: review_params[:flat_id]).user_id == current_user.id

        # check if the user has already reviewed this flat
        # return render json: { message: 'You have already reviewed this property.'}, status: :unprocessable_entity  if Review.find_by(reviewer_id: current_user.id, transaction_request_id: review_params[:transaction_request_id], flat_id: review_params[:flat_id]).present?


        review = Review.new(review_params)
        
        review.reviewer = current_user
        # review.transaction_request_id = review_params[:transaction_request_id]

        if review.save
            
            render json: {
                review: serialized_review(review),
                message: 'Review created sucessfully'
            },
                status: :created
        else
            
            render json: { message: 'Review creation went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end

    private

    def serialized_review(review)
        # ReviewSerializer.new(review).serializable_hash[:data][:attributes]
    end

    def review_params
        params.require(:review).permit(:content, :rating, :flat_id, :transaction_request_id)
    end

end
