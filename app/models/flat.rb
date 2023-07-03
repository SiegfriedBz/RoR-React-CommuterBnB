class Flat < ApplicationRecord
    belongs_to :user
    # has_many :transaction_requests
    has_many_attached :images
    has_many :favorites
    has_many :favorited_by, through: :favorites, source: :user
    has_many :reviews

    geocoded_by :address_to_geocode
    after_validation :geocode

    enum category: { entire_place: 0, private_room: 1 }

    def self.filter(params)
        flats = Flat.all

        debugger

        flats = flats.where("city ILIKE ?", "%#{params[:city]}%") if params[:city].present?
        debugger

        flats = flats.where("country ILIKE ?", "%#{params[:country]}%") if params[:country].present?
        debugger

        flats = flats.where("category = ?", params[:category]) if params[:category].present?
        debugger


        flats = flats.where.not(id: booked_flats_ids(params[:start_date], params[:end_date])) if params[:start_date].present? && params[:end_date].present?

        debugger

        flats
    end

    def self.booked_flats_ids(start_date, end_date)
        booked_flats_ids = []

        if start_date.present? && end_date.present?
            booked_flats_ids = TransactionRequest
                .where(status: TransactionRequest.statuses[:completed])
                .where('starting_date <= :end_date AND ending_date >= :start_date', start_date: start_date, end_date: end_date)
                .pluck(:initiator_flat_id, :responder_flat_id)
                .flatten
                .uniq
        end

        debugger

        booked_flats_ids
    end


    def flat_reviews
        Review.where(flat_id: self.id) || []
    end

    def bookable_for?(starting_date, ending_date)
        # check if starting_date and ending_date are relevant
        return false if starting_date > ending_date
        return false if starting_date < Date.today || ending_date < Date.today

        # check if flat is available for the given date range
        if future_booked_dates.present?
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

        if completed_transaction_requests_for_flat.present?
            completed_transaction_requests_for_flat.each do |transaction_request|
                start_in_future = transaction_request.starting_date > Date.today

                future_booked_dates.push({ 
                    starting_date: transaction_request.starting_date,
                    ending_date: transaction_request.ending_date
                }) if start_in_future
            end
        end

        future_booked_dates
    end

    private

    # completed (paid) transaction_requests involving this flat
    def completed_transaction_requests_for_flat
        TransactionRequest
            .where(status: TransactionRequest.statuses[:completed])
            .where('initiator_flat_id = :flat_id OR responder_flat_id = :flat_id', flat_id: id)
    end

    def address_to_geocode
        [street, city, country].compact.join(', ')
    end
end
