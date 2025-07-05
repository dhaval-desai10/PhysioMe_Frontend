import { useState, useEffect, useRef } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Button } from "./ui/button";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ui/theme-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Add scroll event listener to track when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    // Ensure user object exists
    const profilePicUrl =
      user.profilePictureUrl ||
      "https://via.placeholder.com/40?text=" +
        (user.name ? user.name.charAt(0).toUpperCase() : "U");

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
        {
          href: "/therapist/profile",
          label: "My Profile",
          isProfileLink: true,

          icon: (
            <img
              src={profilePicUrl}
              alt={user.name || "Profile"}
              className="w-8 h-8 transition-all border-2 rounded-full border-primary-light group-hover:border-primary"
            />
          ),
        },
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "shadow-sm backdrop-blur-md bg-background/80"
          : "border-b bg-background"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.span
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              PhysioMe
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-1 md:flex">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  className="px-3 py-2 text-sm font-medium transition-colors rounded-md text-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons or User Menu */}
          <div className="items-center hidden space-x-4 md:flex">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 rounded-full"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Avatar className="w-8 h-8 border ring-2 ring-primary/20">
                    <img
                      src={
                        user?.profilePictureUrl ||
                        `https://ui-avatars.com/api/?name=${
                          user?.name || "User"
                        }`
                      }
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                  <span className="max-w-[100px] truncate">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-50 w-56 mt-2"
                    >
                      <Card className="py-2 border shadow-lg border-border/50">
                        {authLinks.map((link, index) => (
                          <motion.div
                            key={index}
                            className="px-4 py-2"
                            whileHover={{
                              backgroundColor: "rgba(var(--primary), 0.1)",
                            }}
                          >
                            {link.onClick ? (
                              <button
                                onClick={() => {
                                  link.onClick();
                                  setIsOpen(false);
                                }}
                                className="w-full text-sm text-left transition-colors hover:text-primary"
                              >
                                {link.label}
                              </button>
                            ) : (
                              <Link
                                to={link.href}
                                className="block text-sm transition-colors hover:text-primary"
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
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
                    <X className="block w-6 h-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block w-6 h-6" aria-hidden="true" />
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
            className="border-t md:hidden bg-background"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={link.href}
                    className="block px-3 py-2 text-base font-medium transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <motion.div
                  className="pt-4 pb-3 border-t"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Avatar className="w-10 h-10 border ring-2 ring-primary/20">
                        <img
                          src={
                            user?.profilePictureUrl ||
                            `https://ui-avatars.com/api/?name=${
                              user?.name || "User"
                            }`
                          }
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium">
                        {user?.name || "User"}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="px-2 mt-3 space-y-1">
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
                            className="block w-full px-3 py-2 text-base font-medium text-left transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <Link
                            to={link.href}
                            className="block px-3 py-2 text-base font-medium transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent"
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
                  className="pt-4 pb-3 border-t"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="flex flex-col px-5 space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-center transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-base font-medium text-center transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
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
