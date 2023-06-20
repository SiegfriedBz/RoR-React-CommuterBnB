class Message < ApplicationRecord
    belongs_to :author, class_name: 'User'
    belongs_to :recipient, class_name: 'User'
    belongs_to :flat
    belongs_to :transaction_request, optional: true

    # scope :user_involved, ->(user_id) {
    #     join(:transaction_request).where(author_id: user_id)
    #                               .or.where(transaction_request: {responder_id: user_id})
    #                               .or.where(transaction_request: {initiator_id: user_id})
        
    #   }
      
    # def recipient(author_id, flat)
    #     return initiator if flat.responder_id === author_id
    #     flat.responder
    # end
end
