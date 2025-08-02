# Unit Tests

This directory contains simple unit tests for all GET and GET ALL routes in the application. The tests use only Node.js built-in modules without any external dependencies.

## Test Structure

### Files:
- `testRunner.js` - Simple test runner with assertion functions
- `mockDb.js` - Mock database for testing without real database connections
- `userController.test.js` - Tests for user controller GET routes
- `groceriesController.test.js` - Tests for groceries controller GET routes
- `clothesController.test.js` - Tests for clothes controller GET routes
- `electronicsController.test.js` - Tests for electronics controller GET routes
- `runAllTests.js` - Main test runner that executes all test suites
- `runUserTests.js` - Individual test runner for user controller

## Running Tests

### Run all tests:
```bash
npm run test:simple
```

### Run individual test suites:
```bash
# User tests only
node test/runUserTests.js

# All tests
node test/runAllTests.js
```

## Test Coverage

The tests cover the following scenarios for each controller:

### GET ALL Routes:
- ✅ Returns all items with correct status code (200)
- ✅ Returns data in correct format (array)
- ✅ Returns correct number of items
- ✅ Returns correct data structure

### GET ONE Routes:
- ✅ Returns specific item by ID with correct status code (200)
- ✅ Returns correct item data
- ✅ Returns 404 for non-existent items
- ✅ Returns 400 for invalid ID format
- ✅ Returns 400 for missing ID parameter

## Test Data

The mock database contains sample data for testing:

### Users:
- John Doe (johndoe)
- Jane Smith (janesmith)

### Groceries:
- Milk (quantity: 2, price: 3.50)
- Bread (quantity: 1, price: 2.00)

### Clothes:
- T-Shirt (size: M, price: 15.99)
- Jeans (size: L, price: 45.50)

### Electronics:
- Smartphone (brand: Samsung, price: 699.99)
- Laptop (brand: Dell, price: 1200.00)

## Assertion Functions

The test runner provides these assertion functions:

- `assertEqual(actual, expected, message)` - Checks if values are equal
- `assertTrue(condition, message)` - Checks if condition is true
- `assertFalse(condition, message)` - Checks if condition is false
- `assertNotNull(value, message)` - Checks if value is not null/undefined
- `assertNull(value, message)` - Checks if value is null/undefined

## Mock Objects

### Mock Request:
```javascript
{
    params: {}, // URL parameters
    body: {}    // Request body
}
```

### Mock Response:
```javascript
{
    statusCode: 200,
    jsonData: null,
    status: function(code) { /* ... */ },
    json: function(data) { /* ... */ }
}
```

## Example Test Output

```
🧪 Starting unit tests...

✅ PASS: getMultiUsers should return all users
✅ PASS: getOneUser should return a specific user by ID
✅ PASS: getOneUser should return 404 for non-existent user
✅ PASS: getOneUser should return 400 for invalid ID format
✅ PASS: getOneUser should return 400 for missing ID

📊 Test Results:
   Passed: 5
   Failed: 0
   Total: 5

🎉 All tests passed!
``` 