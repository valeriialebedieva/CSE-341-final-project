// Mock database for testing
class MockDb {
    constructor() {
        // Mock ObjectId class
        this.ObjectId = class MockObjectId {
            constructor(id) {
                this.id = id;
                this.toString = () => id;
            }
            static isValid(id) {
                return /^[0-9a-fA-F]{24}$/.test(id);
            }
        };

        this.collections = {
            user: [
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439011'),
                    firstname: 'John',
                    lastname: 'Doe',
                    username: 'johndoe',
                    password: 'password123'
                },
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439012'),
                    firstname: 'Jane',
                    lastname: 'Smith',
                    username: 'janesmith',
                    password: 'securepass'
                }
            ],
            groceries: [
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439021'),
                    name: 'Milk',
                    quantity: 2,
                    price: 3.50
                },
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439022'),
                    name: 'Bread',
                    quantity: 1,
                    price: 2.00
                }
            ],
            clothes: [
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439031'),
                    name: 'T-Shirt',
                    size: 'M',
                    price: 15.99
                },
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439032'),
                    name: 'Jeans',
                    size: 'L',
                    price: 45.50
                }
            ],
            electronics: [
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439041'),
                    name: 'Smartphone',
                    brand: 'Samsung',
                    price: 699.99
                },
                {
                    _id: new this.ObjectId('507f1f77bcf86cd799439042'),
                    name: 'Laptop',
                    brand: 'Dell',
                    price: 1200.00
                }
            ]
        };
    }

    // Mock database methods
    getDb() {
        return {
            db: () => ({
                collection: (collectionName) => {
                    return {
                        find: (query = {}) => {
                            return {
                                toArray: () => {
                                    if (query._id) {
                                        // Find by ID - compare string representations
                                        return this.collections[collectionName].filter(item => 
                                            item._id.toString() === query._id.toString()
                                        );
                                    }
                                    // Return all items
                                    return this.collections[collectionName];
                                }
                            };
                        }
                    };
                }
            })
        };
    }

    // Mock connection status
    isConnected() {
        return true;
    }
}

module.exports = MockDb; 