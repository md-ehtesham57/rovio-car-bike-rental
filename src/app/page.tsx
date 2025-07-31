export default function Home() {
  return (
    <main>
      <header>
        <div className="container">
          <h1>RideNow Rentals</h1>
          <nav>
            <a href="#">Home</a>
            <a href="#">Vehicles</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <h2>Find Your Ride, Own the Road</h2>
        <p>Rent top-notch cars & bikes near you. Fast, affordable & hassle-free.</p>
        <button>Browse Vehicles</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Flexible Rentals</h3>
          <p>Choose hourly, daily, or weekly plans that suit your trip.</p>
        </div>
        <div className="feature-card">
          <h3>Top Brands</h3>
          <p>Ride your dream car or bike with premium options available.</p>
        </div>
        <div className="feature-card">
          <h3>Easy Booking</h3>
          <p>Instant booking and smooth pickup/drop experience.</p>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} RideNow Rentals. All rights reserved.</p>
      </footer>
    </main>
  );
}

