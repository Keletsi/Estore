import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const Topbar = () => {
  return (
    <div className="bg-gray-700 text-white">
      <div className="container mx-auto px-4">
        {/* Only show on md and up */}
        <div className="hidden md:flex items-center justify-between h-12">
          {/* Left social links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.facebook.com/TallBoyWear"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
              aria-label="Facebook"
            >
              <FaFacebookF className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/tallboywear/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@tallboywear"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
              aria-label="TikTok"
            >
              <FaTiktok className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/27835783618"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="h-5 w-5" />
            </a>
          </div>

          {/* Center text */}
          <div className="text-sm text-center flex-grow">
            <span>we ship nationwide</span>
          </div>
        </div>

        {/* Mobile message */}
        <div className="flex md:hidden items-center h-12 justify-center text-sm px-2">
          <span>we ship nationwide</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
