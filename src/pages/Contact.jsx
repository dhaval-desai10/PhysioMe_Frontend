import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        "https://physiome-backend.onrender.com/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        console.error("Form submission error:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get In Touch
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-white/90 mb-8">
              Have questions or need assistance? We're here to help. Reach out
              to us through any of the following channels or fill out the
              contact form below.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold mb-8 text-white">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Email</h3>
                  <p className="text-white/80">support@physiome.com</p>
                  <p className="text-white/80">info@physiome.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Phone</h3>
                  <p className="text-white/80">+1 (555) 123-4567</p>
                  <p className="text-white/80">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Address</h3>
                  <p className="text-white/80">
                    123 Health Street
                    <br />
                    Medical District
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">
                    Business Hours
                  </h3>
                  <p className="text-white/80">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-white/80">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-white/80">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-400 text-sm">
                    Thank you! Your message has been sent successfully. We'll
                    get back to you within 24 hours.
                  </p>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-400 text-sm">
                    Sorry, there was an error sending your message. Please try
                    again or contact us directly.
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your inquiry in detail..."
                  className="min-h-[150px]"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
