class TransactionRequest < ApplicationRecord
    belongs_to :responder, class_name: 'User'
    belongs_to :initiator, class_name: 'User'
    # belongs_to :responder_flat, class_name: 'Flat'
    # belongs_to :initiator_flat, class_name: 'Flat', optional: true

    scope :initiator_or_responder_for_user, -> (user_id) { where("responder_id = :user_id OR initiator_id = :user_id", user_id: user_id) }

    scope :completed_for_flat, -> (flat) { where("responder_flat_id = :flat_id OR initiator_flat_id = :flat_id", flat_id: flat.id).where(status: :completed) }
    
    # validates :status, inclusion: { in: %i[pending completed rejected] }
  
    enum status: { pending: 0, completed: 1, rejected: 2 }
end
