class TransactionRequest < ApplicationRecord
    # belongs_to :responder, class_name: 'User'
    # belongs_to :initiator, class_name: 'User'
    # belongs_to :responder_flat, class_name: 'Flat'
    # belongs_to :initiator_flat, class_name: 'Flat', optional: true

    scope :initiator_or_responder_for_user,  ->(user_id) { where("responder_id = :user_id OR initiator_id = :user_id", user_id: user_id) }

end
