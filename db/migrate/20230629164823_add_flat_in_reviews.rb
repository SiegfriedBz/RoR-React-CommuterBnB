class AddFlatInReviews < ActiveRecord::Migration[7.0]
  def change
    add_reference :reviews, :flat, null: false, foreign_key: true
  end
end
