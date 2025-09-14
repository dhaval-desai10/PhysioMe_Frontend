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
import { contact } from "../lib/api";

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
      const response = await contact.sendMessage(formData);

      if (response.data.success) {
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
        console.error(
          "Form submission error:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      console.error("Error details:", error.response?.data);
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
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-16 h-16 border rounded-lg top-20 left-32 bg-primary/20 backdrop-blur-sm border-primary/30"
          />
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-12 h-12 border rounded-full bottom-20 right-32 bg-blue-400/20 backdrop-blur-sm border-blue-400/30"
          />
        </div>

        <div className="container relative z-20 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <motion.span
              className="inline-block px-4 py-2 mb-6 text-sm font-medium text-white rounded-full bg-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Get In Touch
            </motion.span>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Contact Us
            </h1>
            <p className="mb-8 text-lg text-white/90">
              Have questions or need assistance? We're here to help.
              Reach out to us through any of the following channels or
              fill out the contact form below.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 py-20 mx-auto">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 border rounded-lg border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <h2 className="mb-8 text-2xl font-bold text-white">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border rounded-lg bg-primary/20 backdrop-blur-sm border-primary/30">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Email
                  </h3>
                  <p className="text-white/80">
                    support@physiome.com
                  </p>
                  <p className="text-white/80">info@physiome.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border rounded-lg bg-primary/20 backdrop-blur-sm border-primary/30">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Phone
                  </h3>
                  <p className="text-white/80">+1 (555) 123-4567</p>
                  <p className="text-white/80">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border rounded-lg bg-primary/20 backdrop-blur-sm border-primary/30">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Address
                  </h3>
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
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border rounded-lg bg-primary/20 backdrop-blur-sm border-primary/30">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Business Hours
                  </h3>
                  <p className="text-white/80">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-white/80">
                    Saturday: 10:00 AM - 4:00 PM
                  </p>
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
            className="p-8 border rounded-lg border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-4 space-x-2 border rounded-lg bg-green-500/10 border-green-500/20"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-400">
                    Thank you! Your message has been sent
                    successfully. We'll get back to you within 24
                    hours.
                  </p>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-4 space-x-2 border rounded-lg bg-red-500/10 border-red-500/20"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-400">
                    Sorry, there was an error sending your message.
                    Please try again or contact us directly.
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

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
