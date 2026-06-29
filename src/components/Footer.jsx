import { teacher } from "../data/teacherData";

const LinkedinIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
    {
      icon: <LinkedinIcon size={20} />,
      href: "https://www.linkedin.com/in/dhruval-talsaniya-243171223",
    },
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
            <div className="flex items-center gap-3">
              <span className="text-3xl text-primary flex-shrink-0">⚗️</span>
              <div className="flex flex-col items-start leading-none select-none text-left">
                <span className="font-heading font-extrabold text-xl md:text-2xl tracking-tight text-white">
                  Chem<span className="text-accent">Concept</span>
                </span>
                <div className="h-[1.5px] w-full bg-gold my-0.5 rounded-full" />
                <span className="text-[8px] font-bold text-gold tracking-[0.2em] uppercase whitespace-nowrap">
                  Chemistry Educator
                </span>
              </div>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
