class Message < ApplicationRecord
    after_create_commit { broadcast_message }
    
    belongs_to :author, class_name: 'User'
    belongs_to :recipient, class_name: 'User'
    belongs_to :flat
    belongs_to :transaction_request, optional: true

    scope :author_or_recipient_for_user, -> (user_id) { where("author_id = :user_id OR recipient_id = :user_id", user_id: user_id) }

    private

    def broadcast_message
        author = User.find(self.author_id)
        serialized_author = UserSerializer.new(author).serializable_hash[:data][:attributes]
        
        recipient = User.find(self.recipient_id)
        serialized_recipient = UserSerializer.new(recipient).serializable_hash[:data][:attributes]
        
        serialized_message = MessageSerializer.new(self).serializable_hash[:data][:attributes].merge(
            author: serialized_author,
            recipient: serialized_recipient
        )

        flat_id = self.flat_id
        flat_key = "flat-#{flat_id}"

        author_id = self.author_id
        recipient_id = self.recipient_id
        min_key = [author_id, recipient_id].min
        max_key = [author_id, recipient_id].max

        channel_key = "#{flat_key}-users-#{min_key}-#{max_key}"

        ActionCable.server.broadcast("MessagesChannel-#{channel_key}", {
            message: serialized_message
        })
    end
end
