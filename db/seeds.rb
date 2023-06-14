# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# db/seeds.rb
puts '===================='
puts 'Start seeding...'

# Create Users
admin1 = User.create(email: 'admin1@example.com', password: 'password', role: :admin)
user1 = User.create(email: 'user1@example.com', password: 'password', role: :user)
user2 = User.create(email: 'user2@example.com', password: 'password', role: :user)

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
flat1 = Flat.create(
  user: user1,
  title: 'Cosy Flat in Valletta',
  description: 'Awesome flat in Valletta',
  address: 'Valletta, Malta',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_a01.jpg', 'greece_a02.jpg', 'greece_a03.jpg', 'greece_a04.jpg', 'greece_a05.jpg']
attach_images(flat1, filenames)

# flat2 user1
flat2 = Flat.create(
  user: user1,
  title: 'Cosy Room in Heraklion',
  description: 'Awesome room in Heraklion',
  address: 'Heraklion, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_b01.jpg', 'greece_b02.jpg', 'greece_b03.jpg', 'greece_b04.jpg', 'greece_b05.jpg']
attach_images(flat2, filenames)

# flat3 user1
flat3 = Flat.create(
  user: user1,
  title: 'Cosy Flat in Mylos',
  description: 'Awesome flat in Mylos',
  address: 'Mylos, Greece',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_a01.jpg', 'greece_a02.jpg', 'greece_a03.jpg', 'greece_a04.jpg', 'greece_a05.jpg']
attach_images(flat3, filenames)

# flat4 user1
flat4 = Flat.create(
  user: user1,
  title: 'Cosy Room in Mykonos',
  description: 'Awesome room in Mykonos',
  address: 'Mykonos, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_b01.jpg', 'greece_b02.jpg', 'greece_b03.jpg', 'greece_b04.jpg', 'greece_b05.jpg']
attach_images(flat4, filenames)

# flat5 user2
flat5 = Flat.create(
  user: user2,
  title: 'Cosy Flat in Paros',
  description: 'Awesome flat in Paros',
  address: 'Paros, Greece',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_c01.jpg', 'greece_c02.jpg', 'greece_c03.jpg', 'greece_c04.jpg', 'greece_c05.jpg']
attach_images(flat5, filenames)

# flat6 user2
flat6 = Flat.create(
  user: user2,
  title: 'Cosy Room in Samos',
  description: 'Awesome room in Samos',
  address: 'Samos, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_d01.jpg', 'greece_d02.jpg', 'greece_d03.jpg', 'greece_d04.jpg', 'greece_d05.jpg']
attach_images(flat6, filenames)

# flat7 user2
flat7 = Flat.create(
  user: user2,
  title: 'Cosy Flat in Rhodes',
  description: 'Awesome flat in Rhodes',
  address: 'Rhodes, Greece',
  price_per_night_in_cents: 10000,
  category: :entire_place
)

filenames = ['greece_c01.jpg', 'greece_c02.jpg', 'greece_c03.jpg', 'greece_c04.jpg', 'greece_c05.jpg']
attach_images(flat7, filenames)

# flat8 user2
flat8 = Flat.create(
  user: user2,
  title: 'Cosy Room in SamZakynthosos',
  description: 'Awesome room in Zakynthos',
  address: 'Zakynthos, Greece',
  price_per_night_in_cents: 20000,
  category: :private_room
)

filenames = ['greece_d01.jpg', 'greece_d02.jpg', 'greece_d03.jpg', 'greece_d04.jpg', 'greece_d05.jpg']
attach_images(flat8, filenames)

# Print User Attributes
def print_user_attributes(user)
    puts "User #{user.id}:"
    puts "  Email: #{user.email}"
    puts "  Role: #{user.role}"
    puts '---'
end

users = [admin1, user1, user2]
# users.each(&:print_user_attributes)
users.each do |user|
    print_user_attributes(user)
end

# Print Flat Attributes
def print_flat_attributes(flat)
    puts "Flat #{flat.id}:"
    puts "  Title: #{flat.title}"
    puts "  Description: #{flat.description}"
    puts "  Address: #{flat.address}"
    puts "  Latitude: #{flat.latitude}"
    puts "  Longitude: #{flat.longitude}"
    puts "  Price per Night in cents: #{flat.price_per_night_in_cents}"
    puts "  Category: #{flat.category}"
    puts '---'
end

flats = [flat1, flat2, flat3, flat4, flat5, flat6, flat7, flat8]
# flats.each(&:print_flat_attributes)
flats.each do |flat|
    print_flat_attributes(flat)
end

puts 'Seed data created successfully!'
puts '===================='