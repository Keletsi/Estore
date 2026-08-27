
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
import { Link } from 'react-router-dom';
import heroImg from "../../assets/TBW Fam 2.jpg.jpeg";

const Hero = () => {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="TallBoy Clothing Fam"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-4">
            BUILT FOR <br /> THE STREETS
          </h1>
          <p className="text-sm md:text-lg tracking-tight mb-6">
            Premium streetwear for the urban lifestyle.
          </p>
          <Link
            to="/shop"
            className="bg-white text-gray-800 px-8 py-3 rounded-sm text-lg font-medium hover:bg-gray-200 transition inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;


