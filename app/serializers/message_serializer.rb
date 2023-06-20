class MessageSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  
  attributes :id, :content, :flat_id, :transaction_request_id, :created_at, :updated_at

  attribute :author do |message|
    { author: UserSerializer.new(message.author) }
  end
end
