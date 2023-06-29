class Api::V1::MessagesController < ApplicationController
    before_action :authenticate_user!

    def index
        messages = Message.author_or_recipient_for_user(current_user.id)
        serialized_messages = messages.map do |message|
            author = User.find(message.author_id)
            recipient = User.find(message.recipient_id)
            serialized_message(message).merge(
                author: serialized_user(author),
                recipient: serialized_user(recipient)
            )
        end

        render json: { messages: serialized_messages }, status: :ok
    end

    def create
        message = Message.new(message_params)
        message.author_id = current_user.id

        if message.save
            render json: { message: 'Message sent sucessfully'}, status: :created
        else
            render json: { message: 'Sending message went wrong, please try again.'},
                status: :unprocessable_entity
        end
    end

    private

    def serialized_message(message)
        MessageSerializer.new(message).serializable_hash[:data][:attributes]
    end

    def serialized_user(user)
        UserSerializer.new(user).serializable_hash[:data][:attributes]
    end

    def message_params
        params.require(:message).permit(:content, :recipient_id, :flat_id, :transaction_request_id)
    end
end
