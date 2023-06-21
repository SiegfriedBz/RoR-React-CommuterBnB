class Api::V1::TransactionRequestsController < ApplicationController
    before_action :authenticate_user!

    def index
        transaction_requests = TransactionRequest.initiator_or_responder_for_user(current_user.id)
        transaction_requests = transaction_requests.order(updated_at: :desc)
        
        serialized_transaction_requests = TransactionRequestSerializer.new(transaction_requests).serializable_hash[:data].map{|data| data[:attributes]}

        render json: {
            transaction_requests: serialized_transaction_requests,
            message: 'Transaction requests loaded sucessfully'
            }, status: :ok
    end

    def create
        responder_flat = Flat.find_by(id: params[:flat_id])

        return render json: { message: 'You can not book your own flat.'}, status: :unauthorized if current_user_owns(responder_flat)

        transaction_request = TransactionRequest.new(transaction_request_params)
        transaction_request.initiator_id = current_user.id

        if transaction_request.save
            render json: {
                message: 'Transaction request created sucessfully'
              }, status: :created
        else
            render json: { message: 'Transaction request creation went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end

    # TODO: add check if transaction exists and if user is authorized to update it
    def update
        transaction_request = TransactionRequest.find_by(id: params[:id])

        if transaction_request.update(transaction_request_params)
            render json: {
                message: "Booking request ##{params[:id]} updated sucessfully"
                }, status: :ok
        else
            render json: { message: 'Booking request update went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end

    private

    def current_user_owns(flat)
        flat.user_id == current_user.id
    end

    def transaction_request_params
        params.require(:transaction_request).permit(:starting_date, :ending_date, :exchange_price_per_night_in_cents, :responder_agreed, :initiator_agreed, :responder_id, :responder_flat_id, :initiator_flat_id, :flat_id)
    end
end
