require 'rails_helper'

RSpec.describe "Components", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/components/index"
      expect(response).to have_http_status(:success)
    end
  end

end
