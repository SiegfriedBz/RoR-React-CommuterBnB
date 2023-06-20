class CreateTransactionRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :transaction_requests do |t|
      t.date :starting_date
      t.date :ending_date
      t.integer :exchange_price_per_night_in_cents
      t.boolean :responder_agreed, default: false
      t.boolean :initiator_agreed, default: false
      t.references :responder, null: false, foreign_key: { to_table: :users }
      t.references :initiator, null: false, foreign_key: { to_table: :users }
      t.references :responder_flat, null: false, foreign_key: { to_table: :flats }
      t.references :initiator_flat, foreign_key: { to_table: :flats }
      t.timestamps
    end
  end
end
