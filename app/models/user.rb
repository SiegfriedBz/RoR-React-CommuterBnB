class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
          :validatable, :jwt_authenticatable, jwt_revocation_strategy: self

  def jwt_payload
    # super.merge(user_id: self.id, role: self.role)
    super.merge(user_id: self.id)
  end
end
