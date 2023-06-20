class AddFlatsToMessages < ActiveRecord::Migration[7.0]
  def change
    add_reference :messages, :flat, foreign_key: true, null: false
  end
end
