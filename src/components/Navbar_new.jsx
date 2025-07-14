import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Enhanced scroll event listener with direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 10);

      // Detect scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Add outside click functionality to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  let authLinks = [];
  if (isAuthenticated && user) {
    if (user.role === "patient") {
      authLinks = [
        { href: "/patient/dashboard", label: "Dashboard" },
        { href: "/patient/appointments", label: "Appointments" },
        { href: "/patient/profile", label: "My Profile" },
        { onClick: handleLogout, label: "Logout" },
      ];
    } else if (user.role === "physiotherapist") {
      authLinks = [
        { href: "/therapist/dashboard", label: "Dashboard" },
        { href: "/therapist/patients", label: "Patients" },
        { href: "/therapist/profile", label: "My Profile" },
        { onClick: handleLogout, label: "Logout" },
      ];
    }
  } else {
    authLinks = [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ];
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y:
          scrollDirection === "down" && scrolled && lastScrollY > 200
            ? -100
            : 0,
        opacity:
          scrollDirection === "down" && scrolled && lastScrollY > 200 ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "shadow-xl backdrop-blur-xl bg-slate-900/95 border-b border-slate-700/50"
          : "bg-slate-900/90 backdrop-blur-sm border-b border-slate-800/50"
      }`}
    >
      <div className="container px-4 mx-auto lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo with enhanced styling */}
          <Link to="/" className="flex items-center group">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                PhysioMe
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation with improved styling */}
          <div className="items-center hidden space-x-2 md:flex">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <Link
                  to={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/50 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{ width: "80%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Section with enhanced design */}
          <motion.div
            className="items-center hidden space-x-3 md:flex"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          >
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Avatar className="w-8 h-8 border-2 border-blue-400/50">
                    <img
                      src={
                        user?.profilePictureUrl ||
                        `https://ui-avatars.com/api/?name=${
                          user?.name || "User"
                        }&background=3b82f6&color=fff`
                      }
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      {user?.role || "User"}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </Button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-50 w-56 mt-2"
                    >
                      <Card className="py-2 bg-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-xl">
                        {authLinks.map((link, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-1"
                          >
                            {link.onClick ? (
                              <button
                                onClick={() => {
                                  link.onClick();
                                  setIsOpen(false);
                                }}
                                className="w-full px-3 py-2 text-sm text-left transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/50 flex items-center space-x-2"
                              >
                                <span>{link.label}</span>
                              </button>
                            ) : (
                              <Link
                                to={link.href}
                                className="block px-3 py-2 text-sm transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/50"
                                onClick={() => setIsOpen(false)}
                              >
                                {link.label}
                              </Link>
                            )}
                          </motion.div>
                        ))}
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 border border-slate-700/50"
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block w-5 h-5" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block w-5 h-5" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="border-t border-slate-700/50 md:hidden bg-slate-900/95 backdrop-blur-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={link.href}
                    className="block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/50"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <motion.div
                  className="pt-4 mt-4 border-t border-slate-700/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="flex items-center px-4 py-3 bg-slate-800/30 rounded-lg mb-3">
                    <Avatar className="w-10 h-10 border-2 border-blue-400/50">
                      <img
                        src={
                          user?.profilePictureUrl ||
                          `https://ui-avatars.com/api/?name=${
                            user?.name || "User"
                          }&background=3b82f6&color=fff`
                        }
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user?.name || "User"}
                      </div>
                      <div className="text-sm text-slate-400 capitalize">
                        {user?.role || "User"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {authLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                      >
                        {link.onClick ? (
                          <button
                            onClick={() => {
                              link.onClick();
                              setIsOpen(false);
                            }}
                            className="block w-full px-4 py-3 text-base font-medium text-left transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/50"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <Link
                            to={link.href}
                            className="block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/50"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="pt-4 mt-4 border-t border-slate-700/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="flex flex-col px-4 space-y-3">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-base font-medium text-center transition-all duration-200 rounded-lg border border-slate-700/50 text-slate-200 hover:text-white hover:bg-slate-800/50"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-base font-medium text-center transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
