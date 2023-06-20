class ChangeUserToBeNullFalseInFlats < ActiveRecord::Migration[7.0]
  def change
    change_column_null :flats, :user_id, false
  end
end
