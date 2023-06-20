class ChangeUserToBeNullFalseInFlats < ActiveRecord::Migration[7.0]
  def change
    change_column_null :flats, :user_id, false
    remove_index :flats, :user_id
    add_index :flats, :user_id, unique: true
  end
end
