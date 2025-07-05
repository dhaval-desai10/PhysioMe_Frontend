import { motion } from "framer-motion";
import { Users, Heart, Award, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Dark background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/20 to-blue-600/20" />

        {/* Background pattern */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-32 w-16 h-16 bg-primary/20 rounded-lg backdrop-blur-sm border border-primary/30"
          />
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-32 w-12 h-12 bg-blue-400/20 rounded-full backdrop-blur-sm border border-blue-400/30"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto text-white"
          >
            <motion.span
              className="inline-block px-4 py-2 mb-6 text-sm font-medium text-white rounded-full bg-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              About Our Platform
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About PhysioMe
            </h1>
            <p className="text-lg text-white/90 mb-8">
              We're revolutionizing physiotherapy care by connecting patients
              with expert therapists through an innovative digital platform that
              makes recovery more accessible and effective.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 mb-20 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-white/80 mb-6">
              At PhysioMe, we're dedicated to making physiotherapy care more
              accessible, effective, and personalized. We believe that everyone
              deserves access to quality rehabilitation services, regardless of
              their location or schedule.
            </p>
            <p className="text-white/80">
              Our platform combines cutting-edge technology with expert care to
              create a seamless experience for both patients and therapists,
              ensuring better outcomes and faster recovery.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-600/20 rounded-lg transform rotate-3 backdrop-blur-sm"></div>
            <img
              src="/images/about-mission.svg"
              alt="Our mission"
              className="rounded-lg shadow-xl relative z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-300"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 mb-20 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Patient-Centered Care
            </h3>
            <p className="text-white/80">
              We put our patients first, ensuring their needs and goals are at
              the center of every treatment plan and interaction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center mb-6">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Compassion
            </h3>
            <p className="text-white/80">
              We approach every patient with empathy and understanding,
              recognizing the challenges they face in their recovery journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center mb-6">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Excellence
            </h3>
            <p className="text-white/80">
              We maintain the highest standards of care and continuously strive
              to improve our services and outcomes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Innovation
            </h3>
            <p className="text-white/80">
              We embrace technology and new approaches to make physiotherapy
              more accessible and effective for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Our Expert Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/30">
              <img
                src="/images/team-1.svg"
                alt="Dr. Sarah Johnson"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Dr. Sarah Johnson
            </h3>
            <p className="text-primary mb-2">Chief Medical Officer</p>
            <p className="text-sm text-white/80">
              15+ years of experience in sports rehabilitation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/30">
              <img
                src="/images/team-2.svg"
                alt="Dr. Michael Chen"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Dr. Michael Chen
            </h3>
            <p className="text-primary mb-2">Head of Rehabilitation</p>
            <p className="text-sm text-white/80">
              Specialized in neurological rehabilitation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-6 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/30">
              <img
                src="/images/team-3.svg"
                alt="Dr. Emma Davis"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Dr. Emma Davis
            </h3>
            <p className="text-primary mb-2">Lead Physiotherapist</p>
            <p className="text-sm text-white/80">
              Expert in orthopedic rehabilitation
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
