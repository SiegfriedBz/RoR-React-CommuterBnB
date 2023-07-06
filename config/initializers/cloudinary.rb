Cloudinary.config do |config|
    config.cloud_name = Rails.application.credentials.fetch(:cloud_name)
    config.api_key = Rails.application.credentials.fetch(:cloud_api_key)
    config.api_secret = Rails.application.credentials.fetch(:cloud_api_secret)
    config.secure = true
    config.cdn_subdomain = true
   end
   