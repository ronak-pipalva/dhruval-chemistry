import { Link } from "react-router-dom";
import { teacher } from "../data/teacherData";
import { Globe, Camera, Send, Code, Settings } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Notes", href: "#notes" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: <Camera size={20} />, href: "#" },
    { icon: <Globe size={20} />, href: "#" },
    { icon: <Send size={20} />, href: "#" },
    { icon: <Code size={20} />, href: "#" },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Tagline */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-heading font-bold text-2xl">
              <span>⚗️</span>
              <span>Dhruval Talsaniya</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              {teacher.tagline}. Dedicated to making chemistry accessible and
              engaging for students of all levels.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Navigation</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <div className="text-white font-semibold mb-1">Address:</div>
                {teacher.location}
              </li>
              <li>
                <div className="text-white font-semibold mb-1">Email:</div>
                <a
                  href={`mailto:${teacher.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {teacher.email}
                </a>
              </li>
              <li>
                <div className="text-white font-semibold mb-1">Phone:</div>
                <a
                  href={`tel:${teacher.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  +91 {teacher.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} {teacher.name} | Chemistry Educator, Rajkot. All
            Rights Reserved.
          </p>
          <Link
            to="/admin"
            className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm transition-colors"
          >
            <Settings size={14} />
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
