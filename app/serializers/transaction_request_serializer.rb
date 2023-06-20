class TransactionRequestSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :starting_date, :ending_date, :exchange_price_per_night_in_cents, :responder_agreed, :initiator_agreed, :responder_id, :initiator_id, :responder_flat_id, :initiator_flat_id, :created_at, :updated_at

  attribute :transaction_request_id, &:id
end
