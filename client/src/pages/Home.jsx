// src/pages/Home.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Connecting Citizens Through Intelligent Innovation</h1> [cite: 3, 31, 93]
        <p>LiveStockHub - The Digital Cattle Marketplace for verified and secure livestock trading.</p> [cite: 9, 15]
        <div className="hero-actions">
          <button className="btn-primary">Start Selling</button> [cite: 40]
          <button className="btn-secondary">Start Bidding</button> [cite: 41]
        </div>
      </section>

      {/* Advanced Search & Filter [cite: 48, 79] */}
      <section className="search-filter-bar">
        <input type="text" placeholder="Search breed, location, or age..." />
        <select>
          <option>All Categories</option>
          <option>Cattle</option>
          <option>Sheep/Goat</option>
        </select>
        <button className="btn-search">Search Marketplace</button>
      </section>

      {/* Featured Listings Preview [cite: 47, 71] */}
      <section className="featured-listings">
        <h2>Recent Livestock Listings</h2>
        <div className="listings-grid">
          {/* Map through livestock data from backend */}
          <div className="animal-card">
            <div className="badge-verified">Health Verified</div> [cite: 16, 23]
            <div className="animal-image-placeholder">Animal Photo</div> [cite: 47]
            <h3>Brahman Bull - 2 Years</h3>
            <p>Weight: 550kg | Location: Sangamner</p> [cite: 47, 57]
            <div className="bid-info">
              <span>Current Bid: ₹45,000</span> [cite: 50, 77]
            </div>
            <button className="btn-view">View Details</button>
          </div>
        </div>
      </section>

      {/* Trust & Workflow Section [cite: 17, 23, 25] */}
      <section className="workflow-info">
        <div className="info-item">
          <h3>Secure Authentication</h3>
          <p>Role-based access for Farmers, Buyers, and Admins.</p> [cite: 22, 45, 74]
        </div>
        <div className="info-item">
          <h3>Verified Records</h3>
          <p>Direct access to animal health and age certificates.</p> [cite: 17, 47]
        </div>
        <div className="info-item">
          <h3>Transparent Transactions</h3>
          <p>Real-time bidding and secure payment tracking.</p> [cite: 23, 51, 62]
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;