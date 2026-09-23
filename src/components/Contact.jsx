import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { teacher } from "../data/teacherData";
import { useNotes } from "../context/NotesContext";

const Contact = () => {
  const { submitContactMessage } = useNotes();
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Phone",
      value: teacher.phone,
      href: `tel:${teacher.phone}`,
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: teacher.email,
      href: `mailto:${teacher.email}`,
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Location",
      value: teacher.location,
      href: "https://maps.google.com",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsSubmitting(true);

    const result = await submitContactMessage({
      name: formData.name,
      email: formData.phone, // Map phone to email column of the DB
      message: formData.message,
    });

    if (result.success) {
      setIsSent(true);
      setFormData({ name: "", phone: "", message: "" });
      setTimeout(() => setIsSent(false), 5000);
    } else {
      alert("Failed to send message: " + result.error);
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-input-bg text-text placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all";

  return (
    <section id="contact" className="py-20 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-heading text-center mb-16">
          Get In Touch
        </h2>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {contactCards.map((card, i) => (
              <motion.a
                key={i}
                href={card.href}
                target={card.label === "Location" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel flex items-center gap-4 p-6 rounded-2xl hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-3 bg-surface-solid text-accent rounded-xl shadow-sm">
                  {card.icon}
                </div>
                <div>
                  <div className="text-xs text-muted uppercase tracking-wider font-bold">
                    {card.label}
                  </div>
                  <div className="text-heading font-semibold break-all">
                    {card.value}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 md:p-10 rounded-3xl shadow-sm"
            >
              {isSent ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">
                        Your Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="10-digit phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className={`${inputClass} resize-none`}
                      placeholder="How can I help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent hover:bg-dark text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <Send size={18} />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
