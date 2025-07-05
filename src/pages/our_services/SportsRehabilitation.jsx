import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowRight, CheckCircle2, Zap, Target, Trophy, Activity } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function SportsRehabilitation() {
  const { isAuthenticated, user } = useAuth();

  const benefits = [
    "Faster return to sport activities",
    "Injury prevention strategies",
    "Performance enhancement",
    "Sport-specific rehabilitation",
    "Biomechanical analysis",
    "Mental resilience building"
  ];

  const sportsInjuries = [
    {
      title: "ACL & Knee Injuries",
      description: "Comprehensive rehabilitation for cruciate ligament tears and knee trauma",
      icon: <Target className="w-8 h-8 text-primary" />
    },
    {
      title: "Shoulder Injuries",
      description: "Rotator cuff tears, dislocations, and impingement syndrome treatment",
      icon: <Activity className="w-8 h-8 text-primary" />
    },
    {
      title: "Ankle Sprains",
      description: "Complete recovery and strengthening for ankle ligament injuries",
      icon: <Zap className="w-8 h-8 text-primary" />
    },
    {
      title: "Muscle Strains",
      description: "Hamstring, quadriceps, and calf muscle injury rehabilitation",
      icon: <Trophy className="w-8 h-8 text-primary" />
    },
    {
      title: "Tennis Elbow",
      description: "Lateral epicondylitis treatment and prevention strategies",
      icon: <Target className="w-8 h-8 text-primary" />
    },
    {
      title: "Concussion Management",
      description: "Safe return-to-play protocols for head injury recovery",
      icon: <Activity className="w-8 h-8 text-primary" />
    }
  ];

  const athleteTypes = [
    {
      title: "Professional Athletes",
      description: "Elite-level rehabilitation with cutting-edge techniques",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Weekend Warriors",
      description: "Practical rehabilitation for recreational athletes",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Youth Athletes",
      description: "Age-appropriate rehabilitation and injury prevention",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const phases = [
    {
      phase: "Phase 1",
      title: "Acute Care",
      description: "Pain management, swelling reduction, and tissue protection",
      duration: "Days 1-7"
    },
    {
      phase: "Phase 2",
      title: "Early Mobilization",
      description: "Gentle movement, range of motion, and basic strengthening",
      duration: "Weeks 1-3"
    },
    {
      phase: "Phase 3",
      title: "Progressive Loading",
      description: "Strength building, functional movement patterns",
      duration: "Weeks 3-8"
    },
    {
      phase: "Phase 4",
      title: "Sport-Specific Training",
      description: "Sport-specific movements, agility, and conditioning",
      duration: "Weeks 6-12"
    },
    {
      phase: "Phase 5",
      title: "Return to Play",
      description: "Performance testing, confidence building, injury prevention",
      duration: "Weeks 8-16"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/90 to-teal-800/90" />
        <motion.div
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        />
        <div className="container relative z-20 px-4 py-20 mx-auto">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-white rounded-full bg-white/10 backdrop-blur-sm">
                Peak Performance Recovery
              </span>
              <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Sports <span className="italic text-blue-300">Rehabilitation</span>
              </h1>
              <p className="max-w-3xl mx-auto mb-8 text-xl text-white/90">
                Get back in the game stronger than ever. Our specialized sports rehabilitation program is designed for athletes of all levels to recover, perform, and excel.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === 'patient' ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/dashboard">
                      <Button size="lg" className="text-blue-900 bg-white shadow-lg hover:bg-white/90">
                        Start Your Recovery
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register?role=patient">
                      <Button size="lg" className="text-blue-900 bg-white shadow-lg hover:bg-white/90">
                        Get Back in the Game
                        <ArrowRight className="w-5 h-5 ml-2" />
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
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
              Why Choose Sports Rehabilitation?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Our sports rehabilitation program offers specialized care that goes beyond traditional physical therapy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center p-4 space-x-3 transition-all duration-300 border rounded-lg bg-card border-border/50 hover:shadow-md"
              >
                <CheckCircle2 className="flex-shrink-0 w-6 h-6 text-blue-600" />
                <span className="font-medium text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Injuries Section */}
      <section className="py-24 bg-accent/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
              Common Sports Injuries We Treat
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              From acute injuries to overuse conditions, we have the expertise to get you back to peak performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sportsInjuries.map((injury, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full p-6 transition-all duration-300 border bg-card border-border/50 hover:shadow-lg">
                  <div className="mb-4">
                    {injury.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{injury.title}</h3>
                  <p className="text-muted-foreground">{injury.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Athlete Types Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
              Who We Help
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Our sports rehabilitation services are tailored for athletes at every level.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {athleteTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden transition-all duration-300 border bg-card border-border/50 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={type.image} 
                      alt={type.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-semibold">{type.title}</h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rehabilitation Phases */}
      <section className="py-24 bg-accent/30">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
              Our 5-Phase Rehabilitation Process
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A systematic approach to ensure safe and effective return to sport performance.
            </p>
          </motion.div>

          <div className="space-y-8">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 bg-card border border-border/50 hover:shadow-lg transition-all duration-300 ${index % 2 === 0 ? 'ml-0 mr-auto' : 'ml-auto mr-0'} max-w-4xl`}>
                  <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 text-sm font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-teal-600">
                        {phase.phase}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col mb-2 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-xl font-semibold">{phase.title}</h3>
                        <span className="text-sm font-medium text-blue-600">{phase.duration}</span>
                      </div>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-white bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Return to Your Sport?</h2>
              <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
                Don't let an injury keep you on the sidelines. Start your specialized sports rehabilitation journey today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated && user?.role === 'patient' ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/patient/dashboard">
                      <Button size="lg" className="text-blue-600 bg-white shadow-lg hover:bg-white/90">
                        Book Sports Rehab Session
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register?role=patient">
                      <Button size="lg" className="text-blue-600 bg-white shadow-lg hover:bg-white/90">
                        Start Your Comeback
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="text-white border-white shadow-lg hover:bg-white/10">
                      Contact Our Team
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
