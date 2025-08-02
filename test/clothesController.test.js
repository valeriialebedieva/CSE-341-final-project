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

// Test clothes controller functions
runner.test('getMultiClothes should return all clothes', async () => {
    const clothesController = require('../controllers/clothes');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await clothesController.getMultiClothes(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertTrue(Array.isArray(res.jsonData), 'Response should be an array');
    runner.assertEqual(res.jsonData.length, 2, 'Should return 2 clothes items');
    
    // Check first clothes item
    const firstClothes = res.jsonData[0];
    runner.assertEqual(firstClothes.name, 'T-Shirt', 'First clothes name should be T-Shirt');
    runner.assertEqual(firstClothes.size, 'M', 'First clothes size should be M');
    runner.assertEqual(firstClothes.price, 15.99, 'First clothes price should be 15.99');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneClothes should return a specific clothes item by ID', async () => {
    const clothesController = require('../controllers/clothes');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439031' });
    const res = createMockResponse();
    
    await clothesController.getOneClothes(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertEqual(res.jsonData.name, 'T-Shirt', 'Clothes name should be T-Shirt');
    runner.assertEqual(res.jsonData.size, 'M', 'Clothes size should be M');
    runner.assertEqual(res.jsonData.price, 15.99, 'Clothes price should be 15.99');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneClothes should return 404 for non-existent clothes item', async () => {
    const clothesController = require('../controllers/clothes');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439099' }); // Non-existent ID
    const res = createMockResponse();
    
    await clothesController.getOneClothes(req, res);
    
    runner.assertEqual(res.statusCode, 404, 'Status code should be 404');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Clothes item not found', 'Error message should be correct');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneClothes should return 400 for invalid ID format', async () => {
    const clothesController = require('../controllers/clothes');
    
    const req = createMockRequest({ id: 'invalid-id' });
    const res = createMockResponse();
    
    await clothesController.getOneClothes(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Invalid clothes ID format', 'Error message should be correct');
});

runner.test('getOneClothes should return 400 for missing ID', async () => {
    const clothesController = require('../controllers/clothes');
    
    const req = createMockRequest({}); // No ID
    const res = createMockResponse();
    
    await clothesController.getOneClothes(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Clothes ID is required', 'Error message should be correct');
});

// Run the tests
runner.run(); 