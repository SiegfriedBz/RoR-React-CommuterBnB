class FlatSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :title, :description, :address, :longitude, :latitude, :price_per_night_in_cents, :available, :category

  attribute :flat_id, &:id

  attribute :owner_id, &:user_id

  attribute :images do |flat|
    flat.images.present? ? flat.images.map { |image| image.blob.url } : []
  end
end
