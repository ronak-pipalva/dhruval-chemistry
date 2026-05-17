import { useState, useEffect, useMemo } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = useMemo(
    () => [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Experience", href: "#experience" },
      { name: "Notes", href: "#notes" },
      { name: "Demo", href: "#demo" },
      { name: "Contact", href: "#contact" },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active section highlighting
      const sections = navLinks.map((link) => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="flex items-center gap-2 text-primary font-heading font-bold text-xl"
        >
          <span className="text-2xl">⚗️</span>
          <span className="hidden sm:inline">Dhruval Talsaniya</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`font-semibold transition-colors hover:text-primary ${
                activeSection === link.href.substring(1)
                  ? "text-primary"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#demo"
            onClick={(e) => scrollToSection(e, "#demo")}
            className="btn-primary py-2 px-5 text-sm"
          >
            Book Demo
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`text-lg font-semibold ${
                activeSection === link.href.substring(1)
                  ? "text-primary"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#demo"
            onClick={(e) => scrollToSection(e, "#demo")}
            className="btn-primary text-center"
          >
            Book Free Demo
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
