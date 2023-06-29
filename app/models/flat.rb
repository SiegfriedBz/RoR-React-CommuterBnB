class Flat < ApplicationRecord
    belongs_to :user
    # has_many :transaction_requests
    has_many_attached :images
    has_many :favorites
    has_many :favorited_by, through: :favorites, source: :user

    geocoded_by :address_to_geocode
    after_validation :geocode

    enum category: { entire_place: 0, private_room: 1 }

    def bookable_for?(starting_date, ending_date)
        # check if starting_date and ending_date are relevant
        return false if starting_date > ending_date
        return false if starting_date < Date.today || ending_date < Date.today

        # check if flat is available for the given date range
        if future_booked_dates.present?
            logger.debug "==== in bookable_for ===="
            logger.debug "==== in bookable_for ===="
            logger.debug "==== in bookable_for ===="
            logger.debug "flat: #{self}"
            logger.debug "starting_date: #{starting_date}"
            logger.debug "ending_date: #{ending_date}"
            logger.debug "future_booked_dates().present?: #{future_booked_dates.present?}"
            logger.debug "future_booked_dates(): #{future_booked_dates}"

            # flat is not available if any of the booked dates overlap with the given date range
            future_booked_dates().each do |booked_date|
                return false if booked_date[:starting_date] <= starting_date && starting_date <= booked_date[:ending_date]
                return false if booked_date[:starting_date] <= ending_date && ending_date <= booked_date[:ending_date]
            end
        end

        true
    end

    def future_booked_dates
        future_booked_dates = []
        logger.debug "==== in future_booked_dates ===="
        logger.debug "==== in future_booked_dates ===="
        logger.debug "==== in future_booked_dates ===="
        logger.debug "paid_transaction_requests_for_flat: #{paid_transaction_requests_for_flat}"

        if paid_transaction_requests_for_flat.present?
            paid_transaction_requests_for_flat.each do |transaction_request|
                start_in_future = transaction_request.starting_date > Date.today

                future_booked_dates.push({ 
                    starting_date: transaction_request.starting_date,
                    ending_date: transaction_request.ending_date
                }) if start_in_future
            end
        end

        logger.debug "future_booked_dates: #{future_booked_dates}"
        future_booked_dates
    end

    private

    # paid transaction_requests involving this flat
    def paid_transaction_requests_for_flat
        TransactionRequest
            .where(status: TransactionRequest.statuses[:completed])
            .where('initiator_flat_id = :flat_id OR responder_flat_id = :flat_id', flat_id: id)
    end

    def address_to_geocode
        [street, city, country].compact.join(', ')
    end
end
