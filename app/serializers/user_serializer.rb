class UserSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :description, :email, :created_at

  attribute :user_id, &:id

  attribute :image do |user|
    user.image.present? ? user.image.blob.url : ""
  end
end
