class PaymentSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attribute :payment_id, &:id 

  attributes :transaction_request_id, :amount_in_cents, :status, :created_at, :updated_at

  attribute :payer do |payment|
    UserSerializer.new(payment.payer).serializable_hash[:data][:attributes]
  end

  attribute :payee do |payment|
    UserSerializer.new(payment.payee).serializable_hash[:data][:attributes]
  end

  attribute :flats do |payment|
    transaction_request = payment.transaction_request

    responder_flat = Flat.find_by(id: transaction_request[:responder_flat_id])
    serialized_responder_flat = FlatSerializer.new(responder_flat).serializable_hash[:data][:attributes]

    initiator_flat = Flat.find_by(id: transaction_request[:initiator_flat_id])
    serialized_initiator_flat = FlatSerializer.new(initiator_flat).serializable_hash[:data][:attributes] if initiator_flat.present?

    {
      responder_flat: serialized_responder_flat,
      initiator_flat: serialized_initiator_flat
    }
  end
end
