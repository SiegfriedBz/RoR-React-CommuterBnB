class Api::V1::MessagesController < ApplicationController
    before_action :authenticate_user!

    def index
        messages = Message.where(author_id: current_user.id).or(Message.where(recipient_id: current_user.id))

        serialized_messages = messages.map do |message|
            author = User.find(message.author_id)
            serialized_author = UserSerializer.new(author).serializable_hash[:data][:attributes]
            
            recipient = User.find(message.recipient_id)
            serialized_recipient = UserSerializer.new(recipient).serializable_hash[:data][:attributes]
            
            serialized_message = MessageSerializer.new(message).serializable_hash[:data][:attributes].merge(
                author: serialized_author,
                recipient: serialized_recipient
            )
        end

        render json: { messages: serialized_messages }, status: :ok
    end

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
