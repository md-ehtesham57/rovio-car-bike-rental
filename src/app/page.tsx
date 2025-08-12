"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = testimonialRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const atStart = container.scrollLeft <= 0;
        const atEnd = container.scrollLeft >= maxScrollLeft - 1; // -1 for floating point precision

        // If at the left edge and scrolling up (↓), allow vertical scroll
        if (atStart && e.deltaY < 0) {
          return; // Let the page scroll up naturally
        }

        // If at the right edge and scrolling down (↑), allow vertical scroll
        if (atEnd && e.deltaY > 0) {
          return; // Let the page scroll down naturally
        }

        // Otherwise, prevent default and scroll horizontally
        e.preventDefault();
        container.scrollLeft += e.deltaY * 4;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

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
      <div className="card-title">
        <p>Browse Available Vehicles</p>
      </div>
      <section className="vehicle-details">
        <div className="card-style">
          <img src="/car-images/mazda.jpg" alt="mazda-car" />
          <div className="card-details">
            <h1>Mazda</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
            <div className="card-cta">
              <button>Learn more.</button>
              <button>Book Now</button>
            </div>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/bmw.jpg" alt="bmw-car" />
          <div className="card-details">
            <h1>BMW</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/ferrari.jpg" alt="ferrari-car" />
          <div className="card-details">
            <h1>Ferrari</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/mercedes-benz.jpg" alt="mercedes-benz-car" />
          <div className="card-details">
            <h1>Mercedes Benz</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/mg.jpg" alt="mg-car" />
          <div className="card-details">
            <h1>MG</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/honda-city.jpg" alt="honda-city-car" />
          <div className="card-details">
            <h1>Honda city</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/scorpio.jpg" alt="scorpio-car" />
          <div className="card-details">
            <h1>Scorpio</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/bolero.jpg" alt="bolero-car" />
          <div className="card-details">
            <h1>Bolero</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/bullet.jpg" alt="bullet-bike" />
          <div className="card-details">
            <h1>Royel Enfield Bullet</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/activa.jpg" alt="activa-scooty" />
          <div className="card-details">
            <h1>Activa</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/splender.jpg" alt="splender-bike" />
          <div className="card-details">
            <h1>Splender</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="card-style">
          <img src="/car-images/thar.jpg" alt="thar-car" />
          <div className="card-details">
            <h1>Thar</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonial-heading">
          <h1>Testimonials</h1>
          <p>What our customers say about us</p>
        </div>
        <div className="testimonial-card-div" ref={testimonialRef} >
          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-card-image">
              <img src="/car-images/ferrari.jpg" alt="pp" />
            </div>
            <div className="testimonial-details">
              <p>Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} RideNow Rentals. All rights reserved.</p>
      </footer>
    </main>
  );
}

