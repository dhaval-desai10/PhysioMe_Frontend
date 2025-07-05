import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Users,
  Heart,
  Star,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useState, useEffect } from "react";
import api from "../lib/api";

const fallbackTherapists = [
  {
    _id: "1",
    firstName: "Dr. Emily",
    lastName: "Carter",
    specialization: "Sports Injury Specialist",
    profilePictureUrl: "/images/team-1.svg",
    bio: "Emily has over 10 years of experience helping athletes recover and return to peak performance.",
  },
  {
    _id: "2",
    firstName: "Dr. John",
    lastName: "Smith",
    specialization: "Orthopedic Physiotherapist",
    profilePictureUrl: "/images/team-2.svg",
    bio: "John specializes in orthopedic rehabilitation and chronic pain management for all ages.",
  },
  {
    _id: "3",
    firstName: "Dr. Sarah",
    lastName: "Lee",
    specialization: "Pediatric Physiotherapist",
    profilePictureUrl: "/images/team-3.svg",
    bio: "Sarah is passionate about helping children achieve their developmental milestones through fun, effective therapy.",
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await api.get("/therapists/approved");
        if (response.data.data && response.data.data.length > 0) {
          setTherapists(response.data.data);
        } else {
          setTherapists(fallbackTherapists);
        }
      } catch (error) {
        console.error("Error fetching therapists, using fallback:", error);
        setTherapists(fallbackTherapists);
      }
    };
    fetchTherapists();
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Recovery Patient",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content:
        "The physiotherapists at PhysioMe helped me recover from a serious knee injury. Their personalized approach and dedication made all the difference in my recovery journey.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Sports Rehabilitation",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content:
        "As an athlete, finding the right physiotherapy care is crucial. The team at PhysioMe understood my needs and helped me get back to my sport faster than I expected.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Chronic Pain Patient",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      content:
        "After years of chronic back pain, I finally found relief through the treatment plan developed by PhysioMe. Their holistic approach addressed not just my symptoms but the root causes.",
      rating: 4,
    },
  ];
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Therapists",
      description:
        "Our team of certified physiotherapists brings years of experience and expertise to your care.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description:
        "Book appointments that fit your schedule with our easy online booking system.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personalized Care",
      description:
        "Receive customized treatment plans tailored to your specific needs and goals.",
    },
  ];

  const services = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Physical Therapy",
      description:
        "Comprehensive treatment for injuries, chronic conditions, and post-surgery rehabilitation.",
      link: "/services/physical-therapy",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Sports Rehabilitation",
      description:
        "Specialized care for athletes and sports-related injuries to get you back in the game.",
      link: "/services/sports-rehabilitation",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Manual Therapy",
      description:
        "Hands-on techniques to reduce pain and improve mobility in joints and soft tissues.",
      link: "/services/manual-therapy",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Dark background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/20 to-blue-600/20" />

        {/* Background image with dark overlay */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        {/* Floating decorative elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-16 h-16 border rounded-lg top-32 left-32 bg-primary/20 backdrop-blur-sm border-primary/30"
          />
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-12 h-12 border rounded-full bottom-32 right-32 bg-blue-400/20 backdrop-blur-sm border-blue-400/30"
          />
          <motion.div
            animate={{ x: [-15, 15, -15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-20 border rounded-full top-64 right-64 bg-teal-400/10 backdrop-blur-sm border-teal-400/20"
          />
        </div>
        <div className="container relative z-20 px-4 py-20 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.span
                className="inline-block px-4 py-2 mb-6 text-sm font-medium text-white rounded-full bg-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Professional Physiotherapy Care
              </motion.span>
              <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Your Journey to{" "}
                <span className="italic text-white/90">Better Health</span>{" "}
                Starts Here
              </h1>
              <p className="max-w-xl mb-8 text-xl text-white/90">
                Experience expert physiotherapy care tailored to your unique
                needs. We're here to help you move better, feel better, and live
                better.
              </p>
              <div className="relative z-10 flex flex-wrap gap-4">
                {isAuthenticated && user?.role === "patient" ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <Button
                      size="lg"
                      className="relative z-30 bg-white shadow-lg cursor-pointer text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link to="/patient/dashboard" className="relative z-40">
                        Book Appointment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                ) : isAuthenticated && user?.role === "therapist" ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <Button
                      size="lg"
                      className="relative z-30 bg-white shadow-lg cursor-pointer text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link to="/therapist/dashboard" className="relative z-40">
                        View Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <Button
                      size="lg"
                      className="relative z-30 bg-white shadow-lg cursor-pointer text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link
                        to="/register?role=patient"
                        className="relative z-40"
                      >
                        Book Appointment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-20"
                >
                  <Link to="/services">
                    <Button
                      size="lg"
                      variant="outline"
                      className="relative z-30 text-white border-white shadow-lg cursor-pointer hover:bg-white/10"
                    >
                      Our Services
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-xl bg-white/10 backdrop-blur-sm -z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Physiotherapy Session"
                  className="object-cover w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute flex items-center gap-3 p-4 bg-white rounded-lg shadow-xl -bottom-6 -right-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Certified Therapists</p>
                    <p className="text-xs text-muted-foreground">
                      Professional & Experienced
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 z-20 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden bg-slate-800">
        {/* Dark background with decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-primary/10 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute rounded-full bottom-20 right-20 w-72 h-72 bg-blue-500/10 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute w-64 h-64 rounded-full top-40 right-40 bg-teal-500/10 mix-blend-multiply filter blur-2xl"></div>
        </div>
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium border rounded-full bg-primary/20 text-primary border-primary/30">
              Our Advantages
            </span>
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text">
              Why Choose PhysioMe
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-300">
              We're committed to providing the highest quality physiotherapy
              care with a focus on personalized treatment and patient education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 transition-all duration-300 border shadow-lg bg-slate-900/50 backdrop-blur-sm rounded-xl border-slate-700/50 hover:shadow-xl hover:border-primary/30 hover:bg-slate-800/60"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="inline-block p-4 mb-6 border rounded-full bg-primary/20 border-primary/30">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 overflow-hidden bg-slate-900">
        {/* Dark background with decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full top-10 right-10 w-80 h-80 bg-blue-600/5 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute rounded-full bottom-10 left-10 w-80 h-80 bg-teal-500/5 mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium border rounded-full bg-primary/20 text-primary border-primary/30">
              What We Offer
            </span>
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text">
              Our Services
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-300">
              We offer a comprehensive range of physiotherapy services to
              address various conditions and help you achieve optimal health.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="relative p-8 overflow-hidden transition-all duration-300 border shadow-lg bg-slate-800/60 backdrop-blur-sm rounded-xl border-slate-700/50 hover:shadow-xl group hover:border-primary/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 transition-colors duration-300 rounded-bl-full bg-primary/10 -z-10 group-hover:bg-primary/20"></div>
                <div className="mb-6">{service.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mb-6 text-slate-300">{service.description}</p>
                <Link
                  to={service.link}
                  className="inline-flex items-center font-medium transition-colors text-primary hover:text-blue-400"
                >
                  Learn more <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Expert Team Section */}
      <section className="py-24 bg-slate-800">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium border rounded-full bg-primary/20 text-primary border-primary/30">
              Meet Our Expert Team
            </span>
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text">
              Our Physiotherapy Specialists
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-300">
              Our team of certified physiotherapists brings years of specialized
              training and experience to provide you with the highest quality
              care.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {therapists.slice(0, 3).map((therapist, index) => (
              <motion.div
                key={therapist._id}
                className="flex flex-col items-center p-8 text-center transition-all duration-300 border shadow-lg bg-slate-900/60 backdrop-blur-sm rounded-xl border-slate-700/50 hover:border-primary/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={therapist.profilePictureUrl || "/images/team-1.svg"}
                  alt={therapist.name}
                  className="object-cover mb-4 border-4 rounded-full w-28 h-28 border-primary/30"
                />
                <h3 className="mb-1 text-xl font-semibold text-white">
                  {therapist.name}
                </h3>
                <p className="mb-2 font-medium text-primary">
                  {therapist.specialization}
                </p>
                <p className="mb-4 text-sm text-slate-300">
                  {therapist.bio ||
                    "A dedicated therapist providing excellent care."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden text-white bg-gradient-to-br from-slate-900 via-primary/20 to-slate-800">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-r from-primary/10 to-transparent"></div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 border rounded-full top-10 right-10 border-primary/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-24 h-24 border rounded-full bottom-20 left-20 border-blue-400/30"
          />
        </div>
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Ready to Start Your Recovery Journey?
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
                Book an appointment today and take the first step towards better
                health and mobility.
              </p>
              <div className="relative z-10 flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === "patient" ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <Button
                      size="lg"
                      className="relative z-30 bg-white shadow-lg cursor-pointer text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link to="/patient/dashboard" className="relative z-40">
                        Book Appointment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                ) : isAuthenticated && user?.role === "therapist" ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <Button
                      size="lg"
                      className="relative z-30 bg-white shadow-lg cursor-pointer text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link to="/therapist/dashboard" className="relative z-40">
                        View Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-20"
                  >
                    <Button
                      size="lg"
                      className="relative z-30 bg-white shadow-lg cursor-pointer text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link
                        to="/register?role=patient"
                        className="relative z-40"
                      >
                        Book Your First Session
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-20"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="relative z-30 text-white border-white shadow-lg cursor-pointer hover:bg-white/10"
                    asChild
                  >
                    <Link to="/contact" className="relative z-40">
                      Contact Us
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
