class TransactionRequest < ApplicationRecord
    belongs_to :responder, class_name: 'User'
    belongs_to :initiator, class_name: 'User'
    # belongs_to :responder_flat, class_name: 'Flat'
    # belongs_to :initiator_flat, class_name: 'Flat', optional: true

    scope :initiator_or_responder_for_user, -> (user_id) { where("responder_id = :user_id OR initiator_id = :user_id", user_id: user_id) }
    
    # scope :paid_and_future, -> () { where(status: TransactionRequest.statuses[:completed]).where('starting_date > :today', today: Date.today) }
    scope :paid_and_future, -> () { where(status: :completed).where('starting_date > :today', today: Date.today) }
    
    # validates :status, inclusion: { in: %i[pending completed rejected] }
  
    enum status: { pending: 0, completed: 1, rejected: 2 }

    # check in a transaction request if paybale === if flats are bookable for the given dates
    def flats_bookable_for_dates?
        starting_date = self.starting_date
        ending_date = self.ending_date

        initiator_flat = Flat.find_by(id: self.initiator_flat_id)
        responder_flat = Flat.find_by(id: self.responder_flat_id)
        
        responder_flat_is_bookable = responder_flat.bookable_for_dates?(starting_date, ending_date)

        if initiator_flat.present?
            initiator_flat_is_bookable = initiator_flat.bookable_for_dates?(starting_date, ending_date)
            return responder_flat_is_bookable && initiator_flat_is_bookable
        else
            responder_flat_is_bookable
        end
    end

    def users_agreed?
        self.initiator_agreed? && self.responder_agreed?  
    end
end
