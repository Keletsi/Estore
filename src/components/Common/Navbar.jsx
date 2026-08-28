import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineLogout, HiCog, HiClipboardList, HiOutlineMenu, HiX } from "react-icons/hi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Searchbar from "./Searchbar";
import CartDrawer from "../Layout/CartDrawer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";
import tallBoyLogo from "../../assets/TallBoy logo.png";

const NAV_LINKS = [
  { label: "SHOP", to: "/shop" },
  { label: "T-SHIRTS", to: "/shop?category=tshirts" },
  { label: "COLLABS", to: "/shop?category=collaboration" },
  { label: "BASEBALL JACKETS", to: "/shop?category=baseball-jackets" },
  { label: "HOCKEY TOPS", to: "/shop?category=hockey-tops" },
  { label: "JEANS", to: "/shop?category=jeans" },
  { label: "MATRIC JEANS", to: "/shop?category=matric-jeans" },
];

const CartButton = ({ onClick, className = "" }) => {
  const { cartCount } = useCart();
  return (
    <button onClick={onClick} className={`relative hover:text-gray-900 ${className}`} aria-label="Open cart">
      <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {cartCount}
        </span>
      )}
    </button>
  );
};

const Navbar = () => {
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authLoading, setAuthLoading]   = useState(false);
  const [authError, setAuthError]       = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleCartDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleUserMenu   = () => setUserMenuOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeUserMenu    = () => setUserMenuOpen(false);
  const closeMobileMenu  = () => setMobileMenuOpen(false);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      closeUserMenu();
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeUserMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="container mx-auto flex flex-col gap-2 py-3 px-3 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-2 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center shrink-0 min-w-0">
            <img
              src={tallBoyLogo}
              alt="TallBoy Clothing"
              className="h-8 w-auto md:h-12"
            />
          </Link>

          <div className="relative ml-auto flex items-center gap-2 md:hidden">
            <button
              onClick={toggleUserMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Account"
            >
              <HiOutlineUser className="h-5 w-5 text-gray-700" />
            </button>

            <CartButton onClick={toggleCartDrawer} />

            <button
              onClick={toggleMobileMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <HiX className="h-5 w-5 text-gray-700" /> : <HiOutlineMenu className="h-5 w-5 text-gray-700" />}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="p-4">
                  {currentUser ? (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                      <p className="text-xs text-gray-500">Signed in</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">Sign in to your account</p>
                  )}

                  {authError && (
                    <p className="text-xs text-red-600 mb-2">{authError}</p>
                  )}

                  {currentUser ? (
                    <div className="space-y-2">
                      <Link
                        to="/track"
                        onClick={closeUserMenu}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <HiClipboardList className="h-4 w-4" />
                        Track Order
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={closeUserMenu}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <HiCog className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <HiOutlineLogout className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={closeUserMenu}
                        className="block w-full px-3 py-2 text-sm text-center bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Sign In
                      </Link>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {authLoading ? "Signing in..." : "Continue with Google"}
                      </button>
                      <Link
                        to="/login"
                        onClick={closeUserMenu}
                        className="block w-full px-3 py-2 text-sm text-center text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Create an account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-2">
            <div className="flex flex-col items-stretch gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium uppercase tracking-wide text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium uppercase tracking-wide transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center justify-end gap-4">
          <div className="relative flex items-center gap-4">
            <button
              onClick={toggleUserMenu}
              className="hover:text-gray-900"
              aria-label="Account"
            >
              <HiOutlineUser className="h-6 w-6 text-gray-700" />
            </button>

            <CartButton onClick={toggleCartDrawer} />

            <div className="overflow-hidden">
              <Searchbar />
            </div>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="p-4">
                  {currentUser ? (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                      <p className="text-xs text-gray-500">Signed in</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">Sign in to your account</p>
                  )}

                  {authError && (
                    <p className="text-xs text-red-600 mb-2">{authError}</p>
                  )}

                  {currentUser ? (
                    <div className="space-y-2">
                      <Link
                        to="/track"
                        onClick={closeUserMenu}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <HiClipboardList className="h-4 w-4" />
                        Track Order
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={closeUserMenu}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <HiCog className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <HiOutlineLogout className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={closeUserMenu}
                        className="block w-full px-3 py-2 text-sm text-center bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Sign In
                      </Link>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {authLoading ? "Signing in..." : "Continue with Google"}
                      </button>
                      <Link
                        to="/login"
                        onClick={closeUserMenu}
                        className="block w-full px-3 py-2 text-sm text-center text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Create an account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} ToggleCartDrawer={toggleCartDrawer} />

      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeUserMenu} />
      )}
    </>
  );
};

export default Navbar;
