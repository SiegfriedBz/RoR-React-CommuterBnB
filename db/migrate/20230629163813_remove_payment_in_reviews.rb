class RemovePaymentInReviews < ActiveRecord::Migration[7.0]
  def change
    remove_reference :reviews, :payment, null: false, foreign_key: true
  end
end
