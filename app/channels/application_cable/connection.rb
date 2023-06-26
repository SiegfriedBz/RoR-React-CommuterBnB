module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token]
      decoded_token = decode_token(token)

      if decoded_token
        current_user = User.find_by(id: decoded_token['user_id'])
        current_user
      else
        reject_unauthorized_connection
      end
    end

    def decode_token(token)

      jwt_secret = Rails.application.credentials.fetch(:secret_key_base)

      # TODO: FIX AND Change this to true in production
      # decoded_token = JWT.decode(token, jwt_secret, true, algorithm: 'HS256')

      decoded_token = JWT.decode(token, jwt_secret, false, algorithm: 'HS256')
      
      decoded_token.first
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
end
