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
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearchToggle = () => setIsOpen((prev) => !prev);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`flex items-center transition-all duration-300 ${
          isOpen
            ? "fixed top-0 left-0 right-0 bg-white z-50 px-3 py-4 shadow-lg"
            : "w-auto"
        }`}
      >
        {isOpen ? (
          <form
            onSubmit={handleSearch}
            className="relative flex items-center w-full max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 px-4 py-2.5 pl-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 text-gray-700"
              />
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={handleSearchToggle}
              className="ml-3 p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiMiniXMark className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={handleSearchToggle}
            className="p-2 hover:text-gray-700 transition-colors"
            aria-label="Open search"
          >
            <HiMagnifyingGlass className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  );
};

export default Searchbar;

