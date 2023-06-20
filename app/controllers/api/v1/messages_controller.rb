class Api::V1::MessagesController < ApplicationController
    before_action :authenticate_user!

    def index
        messages = Message.where(author_id: current_user.id).or(Message.where(recipient_id: current_user.id))

        serialized_messages = messages.map do |message|
            recipient = User.find(message.recipient_id)
            serialized_recipient = UserSerializer.new(recipient).serializable_hash[:data][:attributes]
            
            MessageSerializer.new(message).serializable_hash[:data][:attributes].merge(
                recipient: serialized_recipient
            )
        end

        render json: { messages: serialized_messages }, status: :ok
    end

    # conversation starts fromn a user with a flat or not
    # flat_id : flat belonging to 
        # the recipient if message sent from 
        # OR the author IF message sent from
    def create

        message = Message.new(message_params)
        message.author_id = current_user.id

        if message.save

            render json: {
                message: 'Message sent sucessfully'
              }, status: :created
        else
            render json: { message: 'Sending message went wrong, please try again.'},
            status: :unprocessable_entity
        end
    end

    private

    def message_params
        params.require(:message).permit(:content, :recipient_id, :flat_id, :transaction_request_id)
    end
end
