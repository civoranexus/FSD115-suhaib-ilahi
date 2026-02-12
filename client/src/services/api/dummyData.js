export const dummyUsers = {
    currentUser: {
        id: "user_123",
        _id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        role: "buyer",
        avatar: "https://i.pravatar.cc/150?u=john",
        createdAt: "2023-01-01T00:00:00.000Z",
        firstName: "John",
        lastName: "Doe",
        kycStatus: "verified"
    },
    adminUser: {
        id: "admin_123",
        _id: "admin_123",
        name: "Admin User",
        email: "admin@livestockhub.com",
        role: "admin",
        avatar: "https://i.pravatar.cc/150?u=admin",
        createdAt: "2023-01-01T00:00:00.000Z",
        firstName: "Admin",
        lastName: "User"
    },
    sellerUser: {
        id: "seller_123",
        _id: "seller_123",
        name: "Seller User",
        email: "seller@livestockhub.com",
        role: "seller",
        avatar: "https://i.pravatar.cc/150?u=seller",
        createdAt: "2023-01-01T00:00:00.000Z",
        firstName: "Seller",
        lastName: "User",
        kycStatus: "approved",
        city: "Farmville"
    }
};

export const dummyListings = [
    {
        id: "listing_1",
        _id: "listing_1",
        title: "Premium Holstein Cow",
        description: "High milk yield Holstein cow, fully vaccinated and healthy.",
        price: 1500,
        currentBid: 1650,
        startingPrice: 1500,
        category: "Cattle",
        breed: "Holstein",
        age: 3,
        weight: 600,
        location: "Farmville, TX",
        images: [{ url: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800" }],
        seller: {
            id: "seller_1",
            _id: "seller_1",
            name: "Farm Best",
            rating: 4.8
        },
        endsAt: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        status: "active"
    },
    {
        id: "listing_2",
        _id: "listing_2",
        title: "Angus Bull",
        description: "Strong Angus bull for breeding. Purebred lineage.",
        price: 3000,
        currentBid: 3200,
        startingPrice: 3000,
        category: "Cattle",
        breed: "Angus",
        age: 4,
        weight: 900,
        location: "Ranch City, CA",
        images: [{ url: "https://images.unsplash.com/photo-1596733430282-7438b76549c5?auto=format&fit=crop&q=80&w=800" }],
        seller: {
            id: "seller_2",
            _id: "seller_2",
            name: "Top Ranch",
            rating: 4.5
        },
        endsAt: new Date(Date.now() + 172800000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        status: "active"
    },
    {
        id: "listing_3",
        _id: "listing_3",
        title: "Healthy Sheep Flock",
        description: "Flock of 10 healthy sheep. Wool and meat production.",
        price: 2000,
        currentBid: 2000,
        startingPrice: 2000,
        category: "Sheep",
        breed: "Merino",
        age: 2,
        weight: 50,
        location: "Green Valley, OR",
        images: [{ url: "https://images.unsplash.com/photo-1484557985045-6f550bb4188f?auto=format&fit=crop&q=80&w=800" }],
        seller: {
            id: "seller_3",
            _id: "seller_3",
            name: "Valley Farms",
            rating: 4.9
        },
        endsAt: new Date(Date.now() + 3600000).toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        status: "active"
    }
];

export const dummyBids = [
    {
        id: "bid_1",
        _id: "bid_1",
        amount: 1650,
        bidder: {
            id: "user_123",
            _id: "user_123",
            name: "John Doe"
        },
        listingId: "listing_1",
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: "bid_2",
        _id: "bid_2",
        amount: 3200,
        bidder: {
            id: "user_456",
            _id: "user_456",
            name: "Jane Smith"
        },
        listingId: "listing_2",
        createdAt: new Date(Date.now() - 7200000).toISOString()
    }
];

export const dummyWatchlist = [
    {
        id: "watch_1",
        _id: "watch_1",
        listing: dummyListings[0],
        addedAt: new Date().toISOString()
    }
];

export const dummyTransactions = [
    {
        id: "trans_1",
        _id: "trans_1",
        amount: 150,
        type: "deposit",
        status: "completed",
        date: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: "trans_2",
        _id: "trans_2",
        amount: 1650,
        type: "payment",
        status: "pending",
        listingId: "listing_1",
        date: new Date().toISOString()
    }
];
