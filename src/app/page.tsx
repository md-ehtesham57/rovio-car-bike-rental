"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = testimonialRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const atStart = container.scrollLeft <= 0;
        const atEnd = container.scrollLeft >= maxScrollLeft - 1;

        if (atStart && e.deltaY < 0) {
          return;
        }

        if (atEnd && e.deltaY > 0) {
          return;
        }

        e.preventDefault();
        container.scrollLeft += e.deltaY * 4;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <main>
      <header className="fixed overflow-hidden z-10">
        <div className="sticky h-[60px] top-0 w-screen bg-white/10 backdrop-blur-md flex justify-between items-center px-[70px]">
          <img src="/Rovio.svg" alt="brand-logo" width="100" height="100" />
          <ul className="flex gap-[50px] list-none">
            <li className="flex gap-[50px]">
              <Link href="/" className="no-underline text-inherit"> Home </Link>
              <Link href="/vehicles" className="no-underline text-inherit"> Vehicles </Link>
              <Link href="/about" className="no-underline text-inherit"> About </Link>
              <Link href="/contact" className="no-underline text-inherit"> Contact us </Link>
            </li>
          </ul>
        </div>
      </header>

      <section className="relative w-full overflow-hidden flex flex-col">
        <div>
          <img src="/hero-image.png" alt="Car" className="w-full h-full object-cover block" />
        </div>
        <div className="absolute z-[2] top-40 left-40 max-w-[50%]">
          <h2 className="text-[2.5rem] mb-4">Find Your Ride, Own the Road</h2>
          <p className="text-[1.2rem] mb-6">Rent top-notch cars & bikes near you. Fast, affordable & hassle-free.</p>
          <button className="px-6 py-3 text-base bg-[#E0115F] text-white border-none rounded-lg cursor-pointer">Browse Vehicles</button>
        </div>
      </section>
      <div className="overflow-hidden bg-black h-24 flex items-center">
        <div className="flex animate-scroll">
          <div className="flex gap-20 shrink-0">
            <img src="/honda.svg" alt="honda" className="h-12 brightness-0 invert" />
            <img src="/hyundai.svg" alt="hyundai" className="h-12 brightness-0 invert" />
            <img src="/mahindra.svg" alt="mahindra" className="h-12 brightness-0 invert" />
            <img src="/suzuki.svg" alt="suzuki" className="h-12 brightness-0 invert" />
            <img src="/volvo.svg" alt="volvo" className="h-12 brightness-0 invert" />
            <img src="/yamahamotorcorporation.svg" alt="yamaha" className="h-12 brightness-0 invert" />
            <img src="/bmw.svg" alt="bmw" className="h-12 brightness-0 invert" />
            <img src="/bentley.svg" alt="bentley" className="h-12 brightness-0 invert" />
            <img src="/ford.svg" alt="ford" className="h-12 brightness-0 invert" />
            <img src="/ferrari.svg" alt="ferrari" className="h-12 brightness-0 invert" />
            <img src="/mazda.svg" alt="mazda" className="h-12 brightness-0 invert" />
            <img src="/tata.svg" alt="tata" className="h-12 brightness-0 invert" />
            <img src="/tesla.svg" alt="tesla" className="h-12 brightness-0 invert" />
            <img src="/vespa.svg" alt="vespa" className="h-12 brightness-0 invert" />
            <img src="/mg.svg" alt="mg" className="h-12 brightness-0 invert" />
            {/* DUPLICATE SET (important for a seamless loop) */}
            <img src="/honda.svg" alt="honda" className="h-12 brightness-0 invert" />
            <img src="/hyundai.svg" alt="hyundai" className="h-12 brightness-0 invert" />
            <img src="/mahindra.svg" alt="mahindra" className="h-12 brightness-0 invert" />
            <img src="/suzuki.svg" alt="suzuki" className="h-12 brightness-0 invert" />
            <img src="/volvo.svg" alt="volvo" className="h-12 brightness-0 invert" />
            <img src="/yamahamotorcorporation.svg" alt="yamaha" className="h-12 brightness-0 invert" />
            <img src="/bmw.svg" alt="bmw" className="h-12 brightness-0 invert" />
            <img src="/bentley.svg" alt="bentley" className="h-12 brightness-0 invert" />
            <img src="/ford.svg" alt="ford" className="h-12 brightness-0 invert" />
            <img src="/ferrari.svg" alt="ferrari" className="h-12 brightness-0 invert" />
            <img src="/mazda.svg" alt="mazda" className="h-12 brightness-0 invert" />
            <img src="/tata.svg" alt="tata" className="h-12 brightness-0 invert" />
            <img src="/tesla.svg" alt="tesla" className="h-12 brightness-0 invert" />
            <img src="/vespa.svg" alt="vespa" className="h-12 brightness-0 invert" />
            <img src="/mg.svg" alt="mg" className="h-12 brightness-0 invert" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-20 border-2 border-black">
        <p className="text-3xl">Browse Available Vehicles</p>
      </div>
      <section className="flex justify-around flex-wrap p-8 gap-8">
        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/mazda.jpg" alt="mazda-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Mazda</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
            <div className="flex justify-start gap-4">
              <button className="cursor-pointer p-2 rounded-2xl text-white bg-[#E0115F] hover:bg-[#50C878]">Learn more.</button>
              <button className="cursor-pointer p-2 rounded-2xl text-white bg-[#E0115F] hover:bg-[#50C878]">Book Now</button>
            </div>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/bmw.jpg" alt="bmw-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">BMW</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/ferrari.jpg" alt="ferrari-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Ferrari</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/mercedes-benz.jpg" alt="mercedes-benz-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Mercedes Benz</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/mg.jpg" alt="mg-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">MG</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/honda-city.jpg" alt="honda-city-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Honda city</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/scorpio.jpg" alt="scorpio-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Scorpio</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/bolero.jpg" alt="bolero-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Bolero</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/bullet.jpg" alt="bullet-bike" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Royel Enfield Bullet</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/activa.jpg" alt="activa-scooty" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Activa</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/splender.jpg" alt="splender-bike" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Splender</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>

        <div className="h-[30rem] w-80 border-2 border-black flex items-center flex-col p-4 rounded-2xl">
          <img src="/car-images/thar.jpg" alt="thar-car" className="rounded-2xl w-full h-1/2" />
          <div className="w-full h-1/2 flex flex-col justify-between border-2 border-black rounded-2xl p-2">
            <h1 className="text-2xl font-semibold">Thar</h1>
            <p>Premium car for spacial functions.</p>
            <p>5000/Day</p>
          </div>
        </div>
      </section>

      <section className="w-full flex border-2 border-black flex-col">
        <div className="flex h-20 flex-col justify-center items-center w-full border-2 border-black">
          <h1 className="text-3xl font-normal">Testimonials</h1>
          <p>What our customers say about us</p>
        </div>
        <div className="testimonial-card-div flex gap-8 p-8 border-2 border-dotted border-green-500 overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-proximity scroll-smooth [scrollbar-width:none]" ref={testimonialRef}>
          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
            </div>
          </div>

          <div className="h-[30rem] w-80 border-2 border-black rounded-2xl shrink-0 snap-start hover:scale-105 hover:bg-gradient-to-br hover:from-gray-200 hover:to-white hover:shadow-lg transition-all duration-200">
            <div className="w-full h-[35%] flex justify-center p-4">
              <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="h-full w-1/2 border-2 border-black rounded-full" />
            </div>
            <div className="flex-1 w-full p-8 overflow-y-auto [scrollbar-width:none]">
              <p className="text-center leading-relaxed break-words whitespace-normal">Excellent service, The booking process was smooth, and the car was in great condition.</p>
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
