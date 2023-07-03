class Api::V1::TransactionRequestsController < ApplicationController
    before_action :authenticate_user!

    # GET /api/v1/transaction_requests all transaction_requests for current user
    def index
        transaction_requests = TransactionRequest
            .initiator_or_responder_for_user(current_user.id)
            .order(updated_at: :desc)

        serialized_transaction_requests = transaction_requests.map do |transaction_request|
            serialized_transaction_request(transaction_request)
        end

        render json: { transaction_requests: serialized_transaction_requests },
            status: :ok
    end

    def create
        responder_flat = Flat.find_by(id: params[:flat_id])

        return render json: { message: 'You can not book your own flat.'},
            status: :unauthorized if current_user_owns(responder_flat)

        transaction_request = TransactionRequest.new(transaction_request_params)
        transaction_request.initiator_id = current_user.id

        if transaction_request.save
            render json: { message: 'Booking request created sucessfully' },
              status: :created
        else
            render json: { message: 'Booking request creation went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end

    # update agreement or status
    def update
        transaction_request = TransactionRequest.find_by(id: params[:id])

        return render json: { message: 'Booking request not found.'},
            status: :not_found if transaction_request.nil?

            return render json: { message: 'You are not authorized to update this booking request.'},
            status: :unauthorized unless current_user_is_involved(transaction_request)

        if transaction_request.update(transaction_request_params)
            render json: { message: "Booking request ##{params[:id]} updated sucessfully" },
                status: :ok
        else
            render json: { message: 'Booking request update went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end

    # TODO: ONLY ADMIN CAN DESTROY TRANSACTION REQUESTS IF STATUS PENDING || REJECTED (NO DELETION IF ASSOCIATED PAYMENT)
    # def destroy
    #     transaction_request = TransactionRequest.find_by(id: params[:id])

    #     return render json: { message: 'Booking request not found.'},
    #         status: :not_found if transaction_request.nil?
    #     return render json: { message: 'You are not authorized to delete this booking request.'},
    #         status: :unauthorized unless current_user_is_involved(transaction_request)

    #     if transaction_request.destroy
    #         render json: {
    #             message: "Booking request ##{params[:id]} deleted sucessfully"
    #             }, status: :ok
    #     else
    #         render json: { message: 'Booking request deletion went wrong, please try again.'},
    #         status: :unprocessable_entity
    #     end
    # end

    private

    def serialized_transaction_request(transaction_request)
        TransactionRequestSerializer.new(transaction_request).serializable_hash[:data][:attributes]
    end

    def current_user_owns(flat)
        current_user.id === flat.user_id
    end

    def current_user_is_involved(transaction_request)
        transaction_request.initiator_id == current_user.id || transaction_request.responder_id == current_user.id
    end

    def transaction_request_params
        params.require(:transaction_request).permit(:status, :starting_date, :ending_date, :exchange_price_per_night_in_cents, :responder_agreed, :initiator_agreed, :responder_id, :responder_flat_id, :initiator_flat_id, :flat_id)
    end
end
