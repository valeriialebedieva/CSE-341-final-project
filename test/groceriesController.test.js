const TestRunner = require('./testRunner');
const MockDb = require('./mockDb');

// Mock the mongodb module
const originalMongodb = require('../data/db');
const mockDb = new MockDb();

// Create test runner
const runner = new TestRunner();

// Mock request and response objects
function createMockRequest(params = {}, body = {}) {
    return {
        params,
        body
    };
}

function createMockResponse() {
    const res = {
        statusCode: 200,
        jsonData: null,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.jsonData = data;
            return this;
        }
    };
    return res;
}

// Test groceries controller functions
runner.test('getMultiGroceries should return all groceries', async () => {
    const groceriesController = require('../controllers/groceries');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await groceriesController.getMultiGroceries(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertTrue(Array.isArray(res.jsonData), 'Response should be an array');
    runner.assertEqual(res.jsonData.length, 2, 'Should return 2 groceries');
    
    // Check first grocery
    const firstGrocery = res.jsonData[0];
    runner.assertEqual(firstGrocery.name, 'Milk', 'First grocery name should be Milk');
    runner.assertEqual(firstGrocery.quantity, 2, 'First grocery quantity should be 2');
    runner.assertEqual(firstGrocery.price, 3.50, 'First grocery price should be 3.50');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneGrocery should return a specific grocery by ID', async () => {
    const groceriesController = require('../controllers/groceries');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439021' });
    const res = createMockResponse();
    
    await groceriesController.getOneGrocery(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertEqual(res.jsonData.name, 'Milk', 'Grocery name should be Milk');
    runner.assertEqual(res.jsonData.quantity, 2, 'Grocery quantity should be 2');
    runner.assertEqual(res.jsonData.price, 3.50, 'Grocery price should be 3.50');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneGrocery should return 404 for non-existent grocery', async () => {
    const groceriesController = require('../controllers/groceries');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439099' }); // Non-existent ID
    const res = createMockResponse();
    
    await groceriesController.getOneGrocery(req, res);
    
    runner.assertEqual(res.statusCode, 404, 'Status code should be 404');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Grocery not found', 'Error message should be correct');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneGrocery should return 400 for invalid ID format', async () => {
    const groceriesController = require('../controllers/groceries');
    
    const req = createMockRequest({ id: 'invalid-id' });
    const res = createMockResponse();
    
    await groceriesController.getOneGrocery(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Invalid grocery ID format', 'Error message should be correct');
});

runner.test('getOneGrocery should return 400 for missing ID', async () => {
    const groceriesController = require('../controllers/groceries');
    
    const req = createMockRequest({}); // No ID
    const res = createMockResponse();
    
    await groceriesController.getOneGrocery(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Grocery ID is required', 'Error message should be correct');
});

// Run the tests
runner.run(); 