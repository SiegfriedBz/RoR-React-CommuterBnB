class CreateReviews < ActiveRecord::Migration[7.0]
  def change
    create_table :reviews do |t|
      t.text :content
      t.integer :rating, null: false, default: 5
      t.references :reviewer, null: false, foreign_key: { to_table: :users }
      t.references :payment, null: false, foreign_key: true
      t.timestamps
    end
  end
end
