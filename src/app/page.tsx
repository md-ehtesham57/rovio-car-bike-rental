"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = testimonialRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-animate]");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.transform = "translateX(0)";
              card.style.opacity = "1";
            }, i * 120);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <header className="fixed z-10 w-full">
        <div className="sticky h-[60px] top-0 w-screen bg-white/10 backdrop-blur-md flex justify-between items-center px-4 md:px-[70px]">
          <img src="/Rovio.svg" alt="brand-logo" width="100" height="100" className="w-16 md:w-[100px]" />
          <ul className="flex gap-4 md:gap-[50px] list-none">
            <li className="flex gap-4 md:gap-[50px]">
              <Link href="/" className="no-underline text-inherit text-sm md:text-base"> Home </Link>
              <Link href="/vehicles" className="no-underline text-inherit text-sm md:text-base"> Vehicles </Link>
              <Link href="/about" className="no-underline text-inherit text-sm md:text-base"> About </Link>
              <Link href="/contact" className="no-underline text-inherit text-sm md:text-base"> Contact us </Link>
            </li>
          </ul>
        </div>
      </header>

      <section className="relative w-full overflow-hidden flex flex-col">
        <div>
          <img src="/hero-image.png" alt="Car" className="w-full h-full object-cover block" />
        </div>
        <div className="absolute z-[2] top-4 left-4 right-4 md:top-40 md:left-40 md:right-auto max-w-[90%] md:max-w-[50%]">
          <h2 className="text-xl sm:text-2xl md:text-[2.5rem] mb-4">Find Your Ride, Own the Road</h2>
          <p className="text-sm sm:text-base md:text-[1.2rem] mb-6">Rent top-notch cars & bikes near you. Fast, affordable & hassle-free.</p>
          <button className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-[#E0115F] text-white border-none rounded-lg cursor-pointer">Browse Vehicles</button>
        </div>
      </section>
      <div className="overflow-hidden bg-black h-16 md:h-24 flex items-center">
        <div className="flex animate-scroll">
          <div className="flex gap-10 md:gap-20 shrink-0">
            <img src="/honda.svg" alt="honda" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/hyundai.svg" alt="hyundai" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/mahindra.svg" alt="mahindra" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/suzuki.svg" alt="suzuki" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/volvo.svg" alt="volvo" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/yamahamotorcorporation.svg" alt="yamaha" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/bmw.svg" alt="bmw" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/bentley.svg" alt="bentley" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/ford.svg" alt="ford" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/ferrari.svg" alt="ferrari" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/mazda.svg" alt="mazda" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/tata.svg" alt="tata" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/tesla.svg" alt="tesla" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/vespa.svg" alt="vespa" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/mg.svg" alt="mg" className="h-8 md:h-12 brightness-0 invert" />
            {/* DUPLICATE SET (important for a seamless loop) */}
            <img src="/honda.svg" alt="honda" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/hyundai.svg" alt="hyundai" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/mahindra.svg" alt="mahindra" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/suzuki.svg" alt="suzuki" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/volvo.svg" alt="volvo" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/yamahamotorcorporation.svg" alt="yamaha" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/bmw.svg" alt="bmw" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/bentley.svg" alt="bentley" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/ford.svg" alt="ford" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/ferrari.svg" alt="ferrari" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/mazda.svg" alt="mazda" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/tata.svg" alt="tata" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/tesla.svg" alt="tesla" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/vespa.svg" alt="vespa" className="h-8 md:h-12 brightness-0 invert" />
            <img src="/mg.svg" alt="mg" className="h-8 md:h-12 brightness-0 invert" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full py-6 md:py-8">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 relative after:block after:w-16 after:h-1 after:bg-rose-600 after:mx-auto after:mt-3 after:rounded-full">Browse Available Vehicles</h2>
      </div>
      <section className="flex justify-center flex-wrap p-4 md:p-8 gap-6 md:gap-8 bg-gray-50">
        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/mazda.jpg" alt="mazda-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Mazda</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/bmw.jpg" alt="bmw-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">BMW</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/ferrari.jpg" alt="ferrari-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Ferrari</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/mercedes-benz.jpg" alt="mercedes-benz-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Mercedes Benz</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/mg.jpg" alt="mg-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">MG</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/honda-city.jpg" alt="honda-city-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Honda city</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/scorpio.jpg" alt="scorpio-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Scorpio</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/bolero.jpg" alt="bolero-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Bolero</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/bullet.jpg" alt="bullet-bike" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Royel Enfield Bullet</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/activa.jpg" alt="activa-scooty" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Activa</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/splender.jpg" alt="splender-bike" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Splender</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
          <div className="relative h-48 md:h-56 overflow-hidden">
            <img src="/car-images/thar.jpg" alt="thar-car" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Thar</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed flex-1">Premium car for spacial functions.</p>
            <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg md:text-xl font-bold text-rose-600">₹5,000</span>
              <span className="text-xs md:text-sm text-gray-400">/day</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-rose-600 border-2 border-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">Learn more</button>
              <button className="flex-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="text-center mb-10 md:mb-14 px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          <div className="w-16 h-1 bg-rose-600 mx-auto mt-3 rounded-full" />
          <p className="text-gray-500 mt-4 text-sm md:text-base">Real reviews from real customers</p>
        </div>
        <div ref={testimonialRef} className="max-w-xl mx-auto px-4 flex flex-col items-center gap-6 md:gap-7">
          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>

          <div data-animate className="w-full bg-white rounded-2xl shadow-md p-6 md:p-7 transition-all duration-700 ease-out" style={{ transform: "translateX(-100%)", opacity: 0 }}>
            <div className="flex gap-0.5 mb-4">
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
              <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic pl-4 border-l-4 border-rose-200">
              &ldquo;Excellent service! The booking process was smooth, and the car was in great condition.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-rose-200 ring-offset-2 shrink-0">
                <img src="/car-images/ferrari.jpg" alt="Customer testimonial" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Happy Customer</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-green-500 text-xs">✓</span>
                  <span className="text-gray-400 text-xs">Verified Renter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-4 md:py-6 text-center text-sm md:text-base">
        <p>© {new Date().getFullYear()} RideNow Rentals. All rights reserved.</p>
      </footer>
    </main>
  );
}
