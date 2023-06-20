# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# db/seeds.rb
puts '===================='
puts 'Start seeding...'

# Create Flats
def attach_images(flat, filenames)
    filenames.each do |filename|
      image_path = Rails.root.join('db', 'images', filename)
  
      flat.images.attach(
        io: File.open(image_path),
        filename: filename,
        content_type: 'application/jpg',
        identify: false
      )
    end
end

# flat1 user1
flat1 = Flat.new(
  title: 'Cosy Flat in Valletta',
  description: 'Awesome flat in Valletta',
  address: 'Valletta, Malta',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_a01.jpg', 'greece_a02.jpg', 'greece_a03.jpg', 'greece_a04.jpg', 'greece_a05.jpg']
attach_images(flat1, filenames)

# flat2 user1
flat2 = Flat.new(
  title: 'Cosy Room in Heraklion',
  description: 'Awesome room in Heraklion',
  address: 'Heraklion, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_b01.jpg', 'greece_b02.jpg', 'greece_b03.jpg', 'greece_b04.jpg', 'greece_b05.jpg']
attach_images(flat2, filenames)

# flat3 user1
flat3 = Flat.new(
  title: 'Cosy Flat in Mylos',
  description: 'Awesome flat in Mylos',
  address: 'Mylos, Greece',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_a01.jpg', 'greece_a02.jpg', 'greece_a03.jpg', 'greece_a04.jpg', 'greece_a05.jpg']
attach_images(flat3, filenames)

# flat4 user1
flat4 = Flat.new(
  title: 'Cosy Room in Mykonos',
  description: 'Awesome room in Mykonos',
  address: 'Mykonos, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_b01.jpg', 'greece_b02.jpg', 'greece_b03.jpg', 'greece_b04.jpg', 'greece_b05.jpg']
attach_images(flat4, filenames)

# flat5 user2
flat5 = Flat.new(
  title: 'Cosy Flat in Paros',
  description: 'Awesome flat in Paros',
  address: 'Paros, Greece',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_c01.jpg', 'greece_c02.jpg', 'greece_c03.jpg', 'greece_c04.jpg', 'greece_c05.jpg']
attach_images(flat5, filenames)

# flat6 user2
flat6 = Flat.new(
  title: 'Cosy Room in Samos',
  description: 'Awesome room in Samos',
  address: 'Samos, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_d01.jpg', 'greece_d02.jpg', 'greece_d03.jpg', 'greece_d04.jpg', 'greece_d05.jpg']
attach_images(flat6, filenames)

# flat7 user2
flat7 = Flat.new(
  title: 'Cosy Flat in Rhodes',
  description: 'Awesome flat in Rhodes',
  address: 'Rhodes, Greece',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_c01.jpg', 'greece_c02.jpg', 'greece_c03.jpg', 'greece_c04.jpg', 'greece_c05.jpg']
attach_images(flat7, filenames)

# flat8 user3
flat8 = Flat.new(
  title: 'Cosy Room in Zakynthos',
  description: 'Awesome room in Zakynthos',
  address: 'Zakynthos, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_d01.jpg', 'greece_d02.jpg', 'greece_d03.jpg', 'greece_d04.jpg', 'greece_d05.jpg']
attach_images(flat8, filenames)

# Create Users
puts 'Creating Users with flats...'
user01 = User.create(email: 'user01@example.com', password: 'password', role: :user, flats: [flat1, flat2, flat3, flat4])
user02 = User.create(email: 'user02@example.com', password: 'password', role: :user, flats: [flat5, flat6, flat7])
user03 = User.create(email: 'user03@example.com', password: 'password', role: :user, flats: [flat8])
user04 = User.create(email: 'user03@example.com', password: 'password', role: :user)
admin = User.create(email: 'admin@example.com', password: 'password', role: :admin)

# Print Flat Attributes
def print_flat_attributes(flat)
  puts "  Flat #{flat.id}:"
  puts "   Owner id: #{flat.user_id}"
  puts "   Title: #{flat.title}"
  puts "   Description: #{flat.description}"
  puts "   Address: #{flat.address}"
  puts "   Latitude: #{flat.latitude}"
  puts "   Longitude: #{flat.longitude}"
  puts "   Price per Night in cents: #{flat.price_per_night_in_cents}"
  puts "   Category: #{flat.category}"
  puts '---'
end

# Print User Attributes
def print_user_attributes(user)
  puts "User id #{user.id}:"
  puts " Email: #{user.email}"
  puts " Role: #{user.role}"

  if user.flats.present?
    puts " Flats:"
    user.flats.each do |flat|
      print_flat_attributes(flat)
    end
  end
  puts '---'
  puts '---'
end

users = [user01, user02, user03]
users.each do |user|
    print_user_attributes(user)
end

puts "Admin: User id#{admin.id}:"
puts "  Email: #{admin.email}"
puts "  Role: #{admin.role}"
puts '---'

puts 'Seed data created successfully!'
puts '===================='
