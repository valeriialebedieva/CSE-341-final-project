const TestRunner = require('./testRunner');
const MockDb = require('./mockDb');

// Create main test runner
const runner = new TestRunner();

// Import all test modules
const userTests = require('./userController.test');
const groceriesTests = require('./groceriesController.test');
const clothesTests = require('./clothesController.test');
const electronicsTests = require('./electronicsController.test');

console.log('🚀 Starting all unit tests...\n');

// Run all tests
async function runAllTests() {
    try {
        // Run user tests
        console.log('📋 Running User Controller Tests...');
        await userTests;
        
        // Run groceries tests
        console.log('\n📋 Running Groceries Controller Tests...');
        await groceriesTests;
        
        // Run clothes tests
        console.log('\n📋 Running Clothes Controller Tests...');
        await clothesTests;
        
        // Run electronics tests
        console.log('\n📋 Running Electronics Controller Tests...');
        await electronicsTests;
        
        console.log('\n🎉 All test suites completed!');
        
    } catch (error) {
        console.error('❌ Error running tests:', error.message);
        process.exit(1);
    }
}

// Run all tests
runAllTests(); 