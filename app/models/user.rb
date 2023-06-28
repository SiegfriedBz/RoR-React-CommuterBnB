class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable,
          :validatable, :jwt_authenticatable, jwt_revocation_strategy: self

  has_one_attached :image
  has_many :flats, dependent: :destroy
  has_many :favorites
  has_many :favorite_flats, through: :favorites, source: :flat

  enum role: { user: 0, admin: 1 }

  def jwt_payload
    super.merge(user_id: self.id, email: self.email, role: self.role)
  end
end
