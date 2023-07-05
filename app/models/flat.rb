class Flat < ApplicationRecord
    belongs_to :user
    has_many_attached :images
    has_many :favorites
    has_many :favorited_by, through: :favorites, source: :user
    has_many :reviews
  
    geocoded_by :address_to_geocode
    after_validation :geocode
  
    enum category: { entire_place: 0, private_room: 1 }

    # called from FlatController #search, on Flat.filter(params)
    def self.filter(params)
        @flats = Flat.all
     
        @starting_date = DateTime.parse(params[:starting_date]) if params[:starting_date]
        @ending_date = DateTime.parse(params[:ending_date]) if params[:ending_date]

        @flats = @flats.where(city: params[:city]) if params[:city].present?
        @flats = @flats.where(country: params[:country]) if params[:country].present?
        @flats = @flats.where(category: params[:category]) if params[:category].present?

        @flats = filter_by_future_booked_dates if @starting_date && @ending_date && @starting_date < @ending_date && @starting_date >= Date.today 
    
        @flats
    end
  
    def self.filter_by_future_booked_dates
        # flat ids that are booked in the future for the given dates
        future_booked_flats_ids = TransactionRequest.paid_and_future
            .where('starting_date <= :ending_date AND ending_date >= :starting_date', starting_date: @starting_date, ending_date: @ending_date)
            .pluck(:initiator_flat_id, :responder_flat_id)
            .flatten
            .uniq

        @flats.where.not(id: future_booked_flats_ids)
    end

    # called from TransactionRequest #flats_bookable_for_dates? (flat.bookable_for_dates?(starting_date, ending_date))
    def bookable_for_dates?(starting_date, ending_date)
        return false if starting_date > ending_date
        return false if starting_date < Date.today || ending_date < Date.today

        future_booked_dates_for_flat = self.future_booked_dates_for_flat

        return true if future_booked_dates_for_flat.none?

        # check if requested dates overlaps any future booked dates for this flat
        future_booked_dates_for_flat.each do |booked_dates|
            return false if (booked_dates[:starting_date]..booked_dates[:ending_date]).cover?(starting_date) ||
                (booked_dates[:starting_date]..booked_dates[:ending_date]).cover?(ending_date)
        end

        true
    end

    # called from Flat #bookable_for_dates? || from FlatSerializer
    def future_booked_dates_for_flat
        # paid transaction_requests happening in future
        TransactionRequest.paid_and_future
            .where('initiator_flat_id = :flat_id OR responder_flat_id = :flat_id', flat_id: self.id)
            .map { |transaction_request| { starting_date: transaction_request.starting_date, ending_date: transaction_request.ending_date } }
    end

    def address_to_geocode
      [street, city, country].compact.join(', ')
    end
  end
  