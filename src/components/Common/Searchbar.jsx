/*import React, { useState } from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2';

const Searchbar = () => {

const [searchTerm, setSearchTerm] = useState("");
const [isOpen, setisOpen] = useState(false);
const handleSearchToggle = () => {

    setisOpen(!isOpen);
};
  return (
    <div className={`flex item-center justify-center w-full transition-all duration-300 ${isOpen?"absolute top-0 left-0 w-full bg-white h-24 z-50" : w-auto}`}>
      {isOpen ? (<form className="relative  flex items-center justify-center w-full">
       <div className="relative w1/2">
       <input type="text" placeholder="search" value={searchTerm} className="bg-gray-100 px-2 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"/>  
       </div>
      </form>):(
      <button onClick={handleSearchToggle}>
        <HiMagnifyingGlass className="h-6 w-6"/>
      </button>

      )}
    </div>
  )
}

export default Searchbar*/
/*import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSearch = (e) => {
  e.preventDefault();
  console.log("Search Term:", searchTerm)
  setIsOpen(false);

  }

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full bg-white h-24 z-50"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-4 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-500 text-gray-700 shadow-sm"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
            <HiMagnifyingGlass className="h-6 w-6"/>
            </button>
          </div>
          <button type="button" onClick={handleSearchToggle} className="absolute right-4 top-1/2 tranform -translate-y-1/2 text-gray-600 hover:text-gray-800">
            <HiMiniXMark className="h-6 w-6"/>
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle} className="hover:text-gray-700">
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Searchbar; */
/*import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => setIsOpen((prev) => !prev);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Term:", searchTerm);
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full bg-white h-24 z-50"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
        
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-4 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-500 text-gray-700 shadow-sm"
            />

           
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-5 w-5" />
            </button>
          </div>

         
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={handleSearchToggle}
          className="hover:text-gray-700"
        >
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Searchbar; */
import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => setIsOpen((prev) => !prev);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Term:", searchTerm);
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? "fixed top-0 left-0 w-full bg-white h-20 z-50 px-4 sm:px-8"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
        
          <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-500 text-gray-700 shadow-sm"
            />

           
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-5 w-5" />
            </button>
          </div>

        
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-7 w-7" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={handleSearchToggle}
          className="hover:text-gray-700"
        >
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Searchbar; 

