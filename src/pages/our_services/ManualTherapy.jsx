import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowRight, CheckCircle2, Hand, Zap, Target, Heart } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function ManualTherapy() {
  const { isAuthenticated, user } = useAuth();

  const benefits = [
    "Immediate pain relief",
    "Improved joint mobility",
    "Enhanced muscle flexibility",
    "Better circulation",
    "Reduced muscle tension",
    "Accelerated healing"
  ];

  const techniques = [
    {
      title: "Soft Tissue Mobilization",
      description: "Targeted manipulation of muscles, tendons, and ligaments to reduce tension and improve flexibility",
      icon: <Hand className="w-8 h-8 text-primary" />
    },
    {
      title: "Joint Mobilization",
      description: "Gentle passive movements to restore normal joint mechanics and reduce stiffness",
      icon: <Target className="w-8 h-8 text-primary" />
    },
    {
      title: "Myofascial Release",
      description: "Specialized technique to release fascial restrictions and improve tissue quality",
      icon: <Zap className="w-8 h-8 text-primary" />
    },
    {
      title: "Trigger Point Therapy",
      description: "Precise pressure application to release muscle knots and referral pain patterns",
      icon: <Heart className="w-8 h-8 text-primary" />
    },
    {
      title: "Spinal Manipulation",
      description: "Safe and effective techniques to improve spinal alignment and mobility",
      icon: <Hand className="w-8 h-8 text-primary" />
    },
    {
      title: "Craniosacral Therapy",
      description: "Gentle approach to enhance the body's natural healing mechanisms",
      icon: <Target className="w-8 h-8 text-primary" />
    }
  ];

  const conditions = [
    {
      title: "Chronic Pain",
      description: "Long-term pain management through hands-on techniques",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Joint Stiffness",
      description: "Restore mobility and range of motion in affected joints",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Muscle Tension",
      description: "Release tight muscles and improve tissue flexibility",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const approach = [
    {
      step: "1",
      title: "Comprehensive Assessment",
      description: "Detailed evaluation of your condition, movement patterns, and pain levels to identify the root cause"
    },
    {
      step: "2",
      title: "Personalized Treatment Plan",
      description: "Custom manual therapy approach tailored to your specific needs and treatment goals"
    },
    {
      step: "3",
      title: "Hands-On Treatment",
      description: "Skilled application of manual therapy techniques to address tissue restrictions and pain"
    },
    {
      step: "4",
      title: "Progress Monitoring",
      description: "Regular assessment and treatment plan adjustments to ensure optimal outcomes"
    },
    {
      step: "5",
      title: "Self-Care Education",
      description: "Teaching you techniques and exercises to maintain improvements between sessions"
    }
  ];

  const whatToExpect = [
    "Gentle, hands-on treatment techniques",
    "Immediate improvement in many cases",
    "Minimal to no side effects",
    "Personalized treatment approach",
    "Education about your condition",
    "Home exercise recommendations"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-800/90 z-10" />
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
                Healing Through Touch
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Manual <span className="text-emerald-300 italic">Therapy</span> Excellence
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Experience the power of skilled hands-on treatment. Our manual therapy techniques provide immediate relief and lasting results for pain and mobility issues.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === 'patient' ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/dashboard">
                      <Button size="lg" className="bg-white text-emerald-900 hover:bg-white/90 shadow-lg">
                        Book Manual Therapy
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register?role=patient">
                      <Button size="lg" className="bg-white text-emerald-900 hover:bg-white/90 shadow-lg">
                        Experience Healing Touch
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Benefits of Manual Therapy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover how our skilled manual therapy techniques can provide immediate relief and long-term healing.
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
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques Section */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Manual Therapy Techniques
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We employ a variety of evidence-based manual therapy techniques to address your specific needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techniques.map((technique, index) => (
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
                    {technique.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{technique.title}</h3>
                  <p className="text-muted-foreground">{technique.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Conditions We Treat
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Manual therapy is effective for a wide range of musculoskeletal conditions and pain syndromes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={condition.image} 
                      alt={condition.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{condition.title}</h3>
                    <p className="text-muted-foreground">{condition.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Approach */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Treatment Approach
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A systematic approach to manual therapy that ensures the best possible outcomes for your recovery.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {approach.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <Card className="p-6 bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              What to Expect
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Here's what you can expect during your manual therapy sessions with our experienced therapists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {whatToExpect.map((expectation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 rounded-lg bg-card border border-border/50 hover:shadow-md transition-all duration-300"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <span className="text-foreground font-medium">{expectation}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Healing Power of Touch?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
                Book your manual therapy session today and discover how hands-on treatment can transform your health and mobility.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === 'patient' ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/dashboard">
                      <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90 shadow-lg">
                        Book Your Session
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register?role=patient">
                      <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90 shadow-lg">
                        Start Your Healing Journey
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 shadow-lg">
                      Learn More
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
