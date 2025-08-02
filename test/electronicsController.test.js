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

// Test electronics controller functions
runner.test('getMultiElectronics should return all electronics', async () => {
    const electronicsController = require('../controllers/electronics');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await electronicsController.getMultiElectronics(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertTrue(Array.isArray(res.jsonData), 'Response should be an array');
    runner.assertEqual(res.jsonData.length, 2, 'Should return 2 electronics items');
    
    // Check first electronics item
    const firstElectronics = res.jsonData[0];
    runner.assertEqual(firstElectronics.name, 'Smartphone', 'First electronics name should be Smartphone');
    runner.assertEqual(firstElectronics.brand, 'Samsung', 'First electronics brand should be Samsung');
    runner.assertEqual(firstElectronics.price, 699.99, 'First electronics price should be 699.99');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneElectronics should return a specific electronics item by ID', async () => {
    const electronicsController = require('../controllers/electronics');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439041' });
    const res = createMockResponse();
    
    await electronicsController.getOneElectronics(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertEqual(res.jsonData.name, 'Smartphone', 'Electronics name should be Smartphone');
    runner.assertEqual(res.jsonData.brand, 'Samsung', 'Electronics brand should be Samsung');
    runner.assertEqual(res.jsonData.price, 699.99, 'Electronics price should be 699.99');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneElectronics should return 404 for non-existent electronics item', async () => {
    const electronicsController = require('../controllers/electronics');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439099' }); // Non-existent ID
    const res = createMockResponse();
    
    await electronicsController.getOneElectronics(req, res);
    
    runner.assertEqual(res.statusCode, 404, 'Status code should be 404');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Electronics item not found', 'Error message should be correct');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneElectronics should return 400 for invalid ID format', async () => {
    const electronicsController = require('../controllers/electronics');
    
    const req = createMockRequest({ id: 'invalid-id' });
    const res = createMockResponse();
    
    await electronicsController.getOneElectronics(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Invalid electronics ID format', 'Error message should be correct');
});

runner.test('getOneElectronics should return 400 for missing ID', async () => {
    const electronicsController = require('../controllers/electronics');
    
    const req = createMockRequest({}); // No ID
    const res = createMockResponse();
    
    await electronicsController.getOneElectronics(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Electronics ID is required', 'Error message should be correct');
});

// Run the tests
runner.run(); 