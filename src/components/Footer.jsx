import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function Footer() {
  const { isAuthenticated, user } = useAuth();
  return (
    <footer className="border-t border-white/20 bg-slate-900">
      <div>
        <div className="container px-4 py-16 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 text-xl font-bold text-primary">PhysioMe</h3>
              <p className="mb-6 text-sm text-white/80">
                Connecting patients with expert physiotherapists for better
                health outcomes.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full transition-colors bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/30"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook size={18} />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full transition-colors bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/30"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter size={18} />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full transition-colors bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/30"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={18} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full transition-colors bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/30"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={18} />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-primary">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/about"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    About Us
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/services"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    Our Services
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/therapists"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    Find a Therapist
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/contact"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    Contact Us
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/faq"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    FAQ
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-primary">
                For Patients
              </h4>
              <ul className="space-y-3">
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/register?role=patient"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    Register as Patient
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/login"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    Patient Login
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {isAuthenticated && user?.role === "patient" ? (
                    <Link
                      to="/patient/dashboard"
                      className="text-sm transition-colors text-white/80 hover:text-primary"
                    >
                      Book Appointment
                    </Link>
                  ) : isAuthenticated && user?.role === "therapist" ? (
                    <Link
                      to="/therapist/dashboard"
                      className="text-sm transition-colors text-white/80 hover:text-primary"
                    >
                      View Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/register?role=patient"
                      className="text-sm transition-colors text-white/80 hover:text-primary"
                    >
                      Book Appointment
                    </Link>
                  )}
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/patient/dashboard"
                    className="text-sm transition-colors text-white/80 hover:text-primary"
                  >
                    Patient Dashboard
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-primary">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <motion.li
                  className="flex gap-3 items-center text-sm text-white/80 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-2 rounded-full transition-colors bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary group-hover:bg-primary/30">
                    <Phone size={14} />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </motion.li>
                <motion.li
                  className="flex gap-3 items-center text-sm text-white/80 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-2 rounded-full transition-colors bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary group-hover:bg-primary/30">
                    <Mail size={14} />
                  </div>
                  <span>contact@physiome.com</span>
                </motion.li>
                <motion.li
                  className="flex gap-3 items-start text-sm text-white/80 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 p-2 rounded-full text-primary group-hover:bg-primary/30 transition-colors flex-shrink-0 mt-0.5">
                    <MapPin size={14} />
                  </div>
                  <span>
                    123 Healing Street, Medical District, City, Country
                  </span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="pt-8 mt-8 border-t border-white/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
          <motion.p
            className="text-sm text-white/80"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            &copy; {new Date().getFullYear()} PhysioMe. All rights reserved.
          </motion.p>
          <div className="flex gap-4 text-sm text-white/80">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                to="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                to="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                to="/cookies"
                className="transition-colors hover:text-primary"
              >
                Cookie Policy
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
