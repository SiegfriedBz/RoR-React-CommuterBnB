class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :role, :created_at
end
