class ReviewSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attribute :review_id, &:id 

  attributes :content, :rating, :flat_id, :created_at

  attribute :reviewer do |review|
    UserSerializer.new(review.reviewer).serializable_hash[:data][:attributes]
  end

  attribute :transaction_request do |review|
    TransactionRequestSerializer.new(review.transaction_request).serializable_hash[:data][:attributes]
  end
end
