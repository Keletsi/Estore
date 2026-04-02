
/*import heroImg from "../../assets/rabbit-hero.webp"

const Hero = () => {
  return (
    <section>
      <img src={heroImg} alt="Rabbit"/>
    </section>
  );
};

export default Hero;*/
/*import React from 'react';
import heroImg from "../../assets/rabbit-hero.webp";

const Hero = () => {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Rabbit"
        className="absolute inset-0 w-full h-full object-cover"
      />
       <div className="absolute  inset-0 bg-black flex item-center justify-center">
         <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
             VACATION <br/> Ready
          </h1>
          <p className="text-sm  tracking-tighter md:text-lg mb-6 ">Explore Our Vacation Ready Outfits with world wide shipping</p>
          <Link to="#"
                className="bg-white text-gray-950 px-6 p-2 rouded-sm text-lg">Shop Now
          </Link>
         </div>
      </div>
      
    </section>
  );
};

export default Hero;*/
import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import heroImg from "../../assets/rabbit-hero.webp";

const Hero = () => {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroImg}
        alt="Rabbit"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay and content */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-4">
            VACATION <br /> Ready
          </h1>
          <p className="text-sm md:text-lg tracking-tight mb-6">
            Explore our vacation-ready outfits with worldwide shipping.
          </p>
          <Link
            to="#"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;


