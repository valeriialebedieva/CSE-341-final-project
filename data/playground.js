use('final-project');

// Insert a few documents into the usermanagement collection.
db.getCollection('user').insertMany([
  {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    password: 'password123'
  },
  {
    firstname: 'Jane',
    lastname: 'Smith',
    username: 'janesmith',
    password: 'securepass'
  },
  {
    firstname: 'Emily',
    lastname: 'Brown',
    username: 'emilyb',
    password: 'mypassword'
  }
]);

// Insert a few documents into the groceries collection.
db.getCollection('groceries').insertMany([
  {
    name: 'Milk',
    quantity: 2,
    price: 3.50
  },
  {
    name: 'Bread',
    quantity: 1,
    price: 2.00
  },
  {
    name: 'Eggs',
    quantity: 12,
    price: 4.25
  }
]);

// Find all users in the usermanagement collection.
const users = db.getCollection('user').find().toArray();
console.log('Users inserted:', users);

// Find all groceries in the groceries collection.
const groceries = db.getCollection('groceries').find().toArray();
console.log('Groceries inserted:', groceries);