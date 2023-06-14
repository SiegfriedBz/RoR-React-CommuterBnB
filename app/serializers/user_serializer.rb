class UserSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :id, :email, :role, :created_at
end
