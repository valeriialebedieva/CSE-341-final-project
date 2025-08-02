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

// Test user controller functions
runner.test('getMultiUsers should return all users', async () => {
    // Mock the mongodb module
    const userController = require('../controllers/user');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest();
    const res = createMockResponse();
    
    await userController.getMultiUsers(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertTrue(Array.isArray(res.jsonData), 'Response should be an array');
    runner.assertEqual(res.jsonData.length, 2, 'Should return 2 users');
    
    // Check first user
    const firstUser = res.jsonData[0];
    runner.assertEqual(firstUser.firstname, 'John', 'First user firstname should be John');
    runner.assertEqual(firstUser.lastname, 'Doe', 'First user lastname should be Doe');
    runner.assertEqual(firstUser.username, 'johndoe', 'First user username should be johndoe');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneUser should return a specific user by ID', async () => {
    const userController = require('../controllers/user');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439011' });
    const res = createMockResponse();
    
    await userController.getOneUser(req, res);
    
    runner.assertEqual(res.statusCode, 200, 'Status code should be 200');
    runner.assertNotNull(res.jsonData, 'Response should contain data');
    runner.assertEqual(res.jsonData.firstname, 'John', 'User firstname should be John');
    runner.assertEqual(res.jsonData.lastname, 'Doe', 'User lastname should be Doe');
    runner.assertEqual(res.jsonData.username, 'johndoe', 'User username should be johndoe');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneUser should return 404 for non-existent user', async () => {
    const userController = require('../controllers/user');
    
    // Temporarily replace the mongodb module
    const originalGetDb = originalMongodb.getDb;
    originalMongodb.getDb = () => mockDb.getDb();
    
    const req = createMockRequest({ id: '507f1f77bcf86cd799439099' }); // Non-existent ID
    const res = createMockResponse();
    
    await userController.getOneUser(req, res);
    
    runner.assertEqual(res.statusCode, 404, 'Status code should be 404');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'User not found', 'Error message should be correct');
    
    // Restore original function
    originalMongodb.getDb = originalGetDb;
});

runner.test('getOneUser should return 400 for invalid ID format', async () => {
    const userController = require('../controllers/user');
    
    const req = createMockRequest({ id: 'invalid-id' });
    const res = createMockResponse();
    
    await userController.getOneUser(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'Invalid user ID format', 'Error message should be correct');
});

runner.test('getOneUser should return 400 for missing ID', async () => {
    const userController = require('../controllers/user');
    
    const req = createMockRequest({}); // No ID
    const res = createMockResponse();
    
    await userController.getOneUser(req, res);
    
    runner.assertEqual(res.statusCode, 400, 'Status code should be 400');
    runner.assertNotNull(res.jsonData, 'Response should contain error data');
    runner.assertEqual(res.jsonData.error, 'User ID is required', 'Error message should be correct');
});

// Run the tests
runner.run(); 