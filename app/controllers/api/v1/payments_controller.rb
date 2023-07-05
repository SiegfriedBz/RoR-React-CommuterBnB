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
            status: :unprocessable_entity unless transaction_request.users_agreed?

        return render json: { message: 'This booking is not available anymore.' },
            status: :unprocessable_entity unless transaction_request.flats_bookable_for_dates?

        payment = Payment.new(payment_params)

        # TODO AFTER PAYMENT PROCESSOR SET UP:
        # 1. set payment status to initiated UNTIL PAYMENT PROCESSOR RETURNS PAYMENT STATUS
        # 2. if payment ok => set payment status to completed && set transaction_request status to completed
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

    # def bookable_for?(starting_date, ending_date)
    #     return false if starting_date > ending_date
    #     return false if starting_date < Date.today || ending_date < Date.today

    #     future_booked_dates = TransactionRequest
    #     .where(status: TransactionRequest.statuses[:completed])
    #     .where('starting_date > :today', today: Date.today)
    #     .where('initiator_flat_id = :flat_id OR responder_flat_id = :flat_id', flat_id: self.id)
    #     .map { |transaction_request| { starting_date: transaction_request.starting_date, ending_date: transaction_request.ending_date } }
        
    #     # check if flat has any future booked dates
    #     return true if future_booked_dates.none?

    #     # check if requested dates overlaps any future booked dates for this flat
    #     future_booked_dates.each do |booked_dates|
    #         return false if (booked_dates[:starting_date]..booked_dates[:ending_date]).cover?(starting_date) ||
    #             (booked_dates[:starting_date]..booked_dates[:ending_date]).cover?(ending_date)
    #     end

    #     true
    # end

    def serialized_payment(payment)
        PaymentSerializer.new(payment).serializable_hash[:data][:attributes]
    end

    def payment_params
        params.require(:payment).permit(:transaction_request_id, :payer_id, :payee_id, :amount_in_cents)
    end
end
