import { motion } from 'framer-motion';
import { Activity, Brain, Heart, Bone, Dumbbell, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Sports Rehabilitation",
    description: "Specialized treatment for sports-related injuries and performance enhancement.",
    features: [
      "Injury assessment and treatment",
      "Performance optimization",
      "Return-to-sport programs",
      "Preventive care"
    ]
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Neurological Rehabilitation",
    description: "Comprehensive care for neurological conditions and recovery.",
    features: [
      "Stroke rehabilitation",
      "Balance training",
      "Coordination exercises",
      "Functional mobility"
    ]
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Cardiac Rehabilitation",
    description: "Structured programs for heart health and recovery.",
    features: [
      "Exercise prescription",
      "Lifestyle modification",
      "Stress management",
      "Progress monitoring"
    ]
  },
  {
    icon: <Bone className="h-6 w-6" />,
    title: "Orthopedic Care",
    description: "Treatment for musculoskeletal conditions and injuries.",
    features: [
      "Joint rehabilitation",
      "Post-surgery recovery",
      "Pain management",
      "Mobility improvement"
    ]
  },
  {
    icon: <Dumbbell className="h-6 w-6" />,
    title: "Strength Training",
    description: "Personalized strength and conditioning programs.",
    features: [
      "Custom workout plans",
      "Form correction",
      "Progressive loading",
      "Injury prevention"
    ]
  },
  {
    icon: <Stethoscope className="h-6 w-6" />,
    title: "Preventive Care",
    description: "Proactive approach to maintain optimal physical health.",
    features: [
      "Movement assessment",
      "Posture correction",
      "Ergonomic advice",
      "Wellness planning"
    ]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}      
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-purple-600 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("/images/services-hero-bg.svg")',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Comprehensive Services</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Tailored physiotherapy solutions to help you recover, regain strength, and enhance your well-being.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Original Hero Section Content - now part of the new hero or to be removed/repurposed if redundant */}
      {/* <section className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover our comprehensive range of physiotherapy services designed to help you
            achieve optimal physical health and recovery.
          </p>
        </motion.div>
      </section> */}

      {/* Services Grid - adjusted padding */}
      <section className="container mx-auto px-4 py-16 md:py-20">
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover our comprehensive range of physiotherapy services designed to help you
            achieve optimal physical health and recovery.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary text-primary-foreground rounded-lg p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Recovery Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Book a consultation with one of our expert physiotherapists and take the first step
            towards better health and well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=patient">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Book a Consultation
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}