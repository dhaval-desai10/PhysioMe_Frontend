import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowRight, CheckCircle2, Heart, Clock, Users, Award } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function PhysicalTherapy() {
  const { isAuthenticated, user } = useAuth();

  const benefits = [
    "Pain reduction and management",
    "Improved mobility and flexibility",
    "Faster recovery from injuries",
    "Prevention of future injuries",
    "Enhanced quality of life",
    "Customized treatment plans"
  ];

  const conditions = [
    {
      title: "Back & Neck Pain",
      description: "Comprehensive treatment for chronic and acute spinal conditions"
    },
    {
      title: "Joint Disorders",
      description: "Arthritis, joint stiffness, and mobility issues"
    },
    {
      title: "Post-Surgery Recovery",
      description: "Rehabilitation after orthopedic and other surgical procedures"
    },
    {
      title: "Muscle Injuries",
      description: "Strains, sprains, and muscle weakness rehabilitation"
    },
    {
      title: "Neurological Conditions",
      description: "Stroke recovery, multiple sclerosis, and Parkinson's disease"
    },
    {
      title: "Chronic Pain",
      description: "Long-term pain management and functional improvement"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Initial Assessment",
      description: "Comprehensive evaluation of your condition, medical history, and goals"
    },
    {
      step: "2",
      title: "Treatment Plan",
      description: "Customized therapy plan designed specifically for your needs"
    },
    {
      step: "3",
      title: "Active Treatment",
      description: "Hands-on therapy sessions with progress monitoring"
    },
    {
      step: "4",
      title: "Recovery & Prevention",
      description: "Ongoing support and education to prevent future issues"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <motion.div
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        />
        <div className="container mx-auto px-4 py-20 relative z-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
                Comprehensive Care
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Physical <span className="text-white/90 italic">Therapy</span> Excellence
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Expert physical therapy services designed to restore function, reduce pain, and improve your quality of life through evidence-based treatment approaches.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === 'patient' ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/dashboard">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                        Book Physical Therapy Session
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register?role=patient">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                        Start Your Recovery Journey
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Benefits of Physical Therapy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover how our comprehensive physical therapy approach can transform your health and mobility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 rounded-lg bg-card border border-border/50 hover:shadow-md transition-all duration-300"
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Conditions We Treat
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our experienced therapists specialize in treating a wide range of conditions and injuries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{condition.title}</h3>
                  <p className="text-muted-foreground">{condition.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Treatment Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A systematic approach to ensure the best possible outcomes for your recovery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {step.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Physical Therapy Journey?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
                Take the first step towards better health and improved mobility with our expert physical therapy services.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === 'patient' ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/dashboard">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                        Book Your Session Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register?role=patient">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 shadow-lg">
                      Contact Us
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
