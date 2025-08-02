const fs = require('fs');
const path = require('path');

// Simple test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    // Add a test
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    // Assertion functions
    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ${message} Expected ${expected}, but got ${actual}`);
        }
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`Assertion failed: ${message} Expected true, but got false`);
        }
    }

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(`Assertion failed: ${message} Expected false, but got true`);
        }
    }

    assertNotNull(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(`Assertion failed: ${message} Expected non-null value`);
        }
    }

    assertNull(value, message = '') {
        if (value !== null && value !== undefined) {
            throw new Error(`Assertion failed: ${message} Expected null or undefined`);
        }
    }

    // Run all tests
    async run() {
        console.log('🧪 Starting unit tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                console.log(`✅ PASS: ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ FAIL: ${test.name}`);
                console.log(`   Error: ${error.message}\n`);
                this.failed++;
            }
        }

        console.log('\n📊 Test Results:');
        console.log(`   Passed: ${this.passed}`);
        console.log(`   Failed: ${this.failed}`);
        console.log(`   Total: ${this.tests.length}`);

        if (this.failed === 0) {
            console.log('\n🎉 All tests passed!');
            process.exit(0);
        } else {
            console.log('\n💥 Some tests failed!');
            process.exit(1);
        }
    }
}

// Export the test runner
module.exports = TestRunner; 