import React, { useState } from "react";
import "./Home.css";

/* =====================================
   ICON COMPONENT
===================================== */
const Icon = ({ name, size = 18, className = "" }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };

  switch (name) {
    case "check":
      return (
        <svg {...props}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );

    case "spa":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10a8 8 0 10-16 0c0 6 8 10 8 10z" />
        </svg>
      );

    case "gym":
      return (
        <svg {...props}>
          <path d="M6 6h2v12H6zm10 0h2v12h-2z" />
          <rect x="9" y="4" width="6" height="16" rx="2" />
        </svg>
      );

    case "pool":
      return (
        <svg {...props}>
          <path d="M2 18s1.5-2 5-2 5 2 8 2 5-2 7-2" />
          <path d="M2 14s1.5-2 5-2 5 2 8 2 5-2 7-2" />
        </svg>
      );

    case "dining":
      return (
        <svg {...props}>
          <path d="M4 3h2v18H4zM18 3h2v18h-2z" />
          <path d="M10 3h4v6a2 2 0 01-4 0V3z" />
        </svg>
      );

    case "location":
      return (
        <svg {...props}>
          <path d="M12 21s8-5.5 8-10.5A8 8 0 1 0 4 10.5C4 15.5 12 21 12 21z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      );

    case "tag":
      return (
        <svg {...props}>
          <path d="M20.59 13.41L13.41 20.59a2 2 0 0 1-2.83 0L3 13.01V7a2 2 0 0 1 2-2h6.01l5.58 5.58a2 2 0 0 1 0 2.83z" />
          <circle cx="7.5" cy="7.5" r="1" />
        </svg>
      );

    case "bed":
      return (
        <svg {...props}>
          <path d="M3 7v7a1 1 0 0 0 1 1h1v3h2v-3h8v3h2v-3h1a1 1 0 0 0 1-1V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3z" />
          <path d="M3 10h18" />
        </svg>
      );

    default:
      return null;
  }
};

/* =====================================
   HOME PAGE
===================================== */
function Home() {
  const amenities = {
    spa: {
      title: "Spa & Wellness",
      icon: "spa",
      items: ["Sauna", "Jacuzzi", "Massage Therapy", "Relaxation Lounge"],
    },
    gym: {
      title: "Modern Gym",
      icon: "gym",
      items: ["Free Weights", "Cardio Machines", "Yoga Room", "Personal Trainer"],
    },
    pool: {
      title: "Infinity Pool",
      icon: "pool",
      items: ["Heated Pool", "Pool Bar", "Kids Pool", "Sunbeds & Towels"],
    },
    dining: {
      title: "Fine Dining",
      icon: "dining",
      items: ["Buffet Breakfast", "Rooftop Dining", "24/7 Room Service", "Café & Lounge"],
    },
  };

  const [activeAmenity, setActiveAmenity] = useState("spa");

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="display-3 fw-bold">Welcome to Our Hotel</h1>
          <p className="lead mt-3">
            Experience comfort and luxury with our premium rooms and exceptional service.
          </p>

          <a href="/rooms" className="btn btn-primary btn-lg mt-4">
            View Rooms
          </a>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-section">
        <div className="section-header">
          <h2>Why Choose Us?</h2>
          <p>Experience luxury and comfort like never before</p>
        </div>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon"><Icon name="location" size={32} /></div>
            <h3>Prime Locations</h3>
            <p>Curated rooms in the best city destinations.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon"><Icon name="calendar" size={32} /></div>
            <h3>Easy Booking</h3>
            <p>Simple 3-step process to reserve instantly.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon"><Icon name="tag" size={32} /></div>
            <h3>Best Prices</h3>
            <p>Competitive rates, no hidden fees.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon"><Icon name="bed" size={32} /></div>
            <h3>Quality Rooms</h3>
            <p>Premium rooms with excellent service.</p>
          </div>
        </div>
      </div>

      {/* AMENITIES SECTION */}
      <div className="amenities-section">
        <div className="section-header">
          <h2>World-Class Amenities</h2>
          <p>Everything you need for an unforgettable stay</p>
        </div>

        <div className="amenities-tabs">
          {Object.keys(amenities).map((key) => (
            <button
              key={key}
              className={`amenity-tab ${activeAmenity === key ? "active" : ""}`}
              onClick={() => setActiveAmenity(key)}
            >
              <Icon name={amenities[key].icon} size={22} />
              <span>{amenities[key].title}</span>
            </button>
          ))}
        </div>

        <div className="amenities-content">
          <div className="amenities-grid">
            {amenities[activeAmenity].items.map((item, index) => (
              <div key={index} className="amenity-item">
                <Icon name="check" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="stats-section">
        <div className="stat">
          <h4>50+</h4>
          <p>Rooms Available</p>
        </div>

        <div className="stat">
          <h4>10K+</h4>
          <p>Happy Customers</p>
        </div>

        <div className="stat">
          <h4>24/7</h4>
          <p>Customer Support</p>
        </div>

        <div className="stat">
          <h4>95%</h4>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
