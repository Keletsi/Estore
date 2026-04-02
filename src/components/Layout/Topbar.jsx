/*import {TbBrandMeta} from "react-icons/tb";
import {IoLogoInstagram} from "react-icons/io"
import {RiTwitterXLine} from "react-icons/ri"
const Topbar=()=> {
  return (
    //<div className="bg-keth-red text-white">
       <div className="bg-keth-red text-white w-full">
        <div className="container mx-auto">
            <div className="hidden md:flex items-center space-x-4">
                <a href="#" className="hover:text-gray-300">
                    <TbBrandMeta className="h-5 w-5"/>
                </a>
                <a href="#" className="hover:text-gray-300">
                    <IoLogoInstagram className="h-5 w-5"/>
                </a>
                <a href="#" className="hover:text-gray-300">
                    <RiTwitterXLine className="h-5 w-5"/>
                </a>
                <div className="text-sm text-center flex-grow">
                    <span>We ship worldwide fast and reliable shipping </span>
                </div>
            </div>
        </div>
    </div>
  ); 
};
export default Topbar; */
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
     <div className="bg-[#ea2e0e] text-white">
      <div className="container mx-auto px-4">
        {/* Only show on md and up */}
        <div className="hidden md:flex items-center justify-between h-12">
          {/* Left icons */}
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-300">
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-gray-300">
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-gray-300">
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>

          {/* Center text */}
          <div className="text-sm text-center flex-grow">
            <span>We ship worldwide – fast and reliable shipping</span>
          </div>
        </div>

        {/* Optional: mobile message */}
        <div className="flex md:hidden items-center h-12 justify-center text-sm px-2">
          <span>We ship worldwide – fast and reliable shipping</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

