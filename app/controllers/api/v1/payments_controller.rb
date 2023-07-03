class Api::V1::PaymentsController < ApplicationController
    before_action :authenticate_user!

    # all payments for current user (as payer or payee)
    def index
        payments = Payment.payer_or_payee_for_user(current_user.id).order(updated_at: :desc)
        
        serialized_payments = payments.map do |payment|
            serialized_payment(payment)
        end

        render json: { payments: serialized_payments }, status: :ok
    end

    def create
        transaction_request = TransactionRequest.find(params[:transaction_request_id])

        return render json: { message: 'Both users agreement is required.' },
            status: :unauthorized unless transaction_request.users_agreed?

        return render json: { message: 'This booking is not available anymore.' },
            status: :unauthorized unless transaction_request.is_bookable_for_dates?

        payment = Payment.new(payment_params)

        # TODO AFTER PAYMENT PROCESSOR SET UP:
        # 1. set payment status to initiated UNTIL PAYMENT PROCESSOR RETURNS PAYMENT STATUS
        # 2. set payment status to completed && set transaction_request status to completed
        payment.status = :completed
        
        if payment.save
            transaction_request.status = :completed
            transaction_request.save
            
            render json: { message: 'Payment created sucessfully' },
                status: :created
      else
          render json: { message: 'Payment went wrong, please try again.' },
            status: :unprocessable_entity
      end
    end

    private

    def serialized_payment(payment)
        PaymentSerializer.new(payment).serializable_hash[:data][:attributes]
    end

    def payment_params
        params.require(:payment).permit(:transaction_request_id, :payer_id, :payee_id, :amount_in_cents)
    end
end
