export default function Home() {
  return (
    <main>
      <header>
        <div className="container">
          <img src="/Rovio.svg" alt="brand-logo" width="100" height="100" />
          <ul>
            <li className="ctaButtons">
              <a href="#"> Home </a>
              <a href="#"> Vehicles </a>
              <a href="#"> About </a>
              <a href="#"> Contact us </a>
            </li>
          </ul>
        </div>
      </header>

      <section className="hero">
        <div className="heroImage">
          <img src="/hero-image.png" alt="Car" />
        </div>
        <div className="info">
          <h2>Find Your Ride, Own the Road</h2>
          <p>Rent top-notch cars & bikes near you. Fast, affordable & hassle-free.</p>
          <button>Browse Vehicles</button>
        </div>
      </section>
      <div className="brand-logos">
        <div className="logos-track">
          <div className="logo-set">
            <img src="/honda.svg" alt="honda" />
            <img src="/hyundai.svg" alt="hyundai" />
            <img src="/mahindra.svg" alt="mahindra" />
            <img src="/suzuki.svg" alt="suzuki" />
            <img src="/volvo.svg" alt="volvo" />
            <img src="/yamahamotorcorporation.svg" alt="yamaha" />
            <img src="/bmw.svg" alt="bmw" />
            <img src="/bentley.svg" alt="bentley" />
            <img src="/ford.svg" alt="ford" />
            <img src="/ferrari.svg" alt="ferrari" />
            <img src="/mazda.svg" alt="mazda" />
            <img src="/tata.svg" alt="tata" />
            <img src="/tesla.svg" alt="tesla" />
            <img src="/vespa.svg" alt="vespa" />
            <img src="/mg.svg" alt="mg" />
            {/* DUPLICATE SET (important for a seamless loop) */}
            <img src="/honda.svg" alt="honda" />
            <img src="/hyundai.svg" alt="hyundai" />
            <img src="/mahindra.svg" alt="mahindra" />
            <img src="/suzuki.svg" alt="suzuki" />
            <img src="/volvo.svg" alt="volvo" />
            <img src="/yamahamotorcorporation.svg" alt="yamaha" />
            <img src="/bmw.svg" alt="bmw" />
            <img src="/bentley.svg" alt="bentley" />
            <img src="/ford.svg" alt="ford" />
            <img src="/ferrari.svg" alt="ferrari" />
            <img src="/mazda.svg" alt="mazda" />
            <img src="/tata.svg" alt="tata" />
            <img src="/tesla.svg" alt="tesla" />
            <img src="/vespa.svg" alt="vespa" />
            <img src="/mg.svg" alt="mg" />
          </div>
        </div>
      </div>

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

