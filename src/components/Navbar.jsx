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
          className="flex items-center gap-3"
        >
          <span className="text-3xl text-primary flex-shrink-0">⚗️</span>
          <div className="flex flex-col items-start leading-none select-none">
            <span className={`font-heading font-extrabold text-xl md:text-2xl tracking-tight transition-colors duration-300 ${isScrolled ? "text-dark" : "text-white"}`}>
              Chem<span className="text-accent">Concept</span>
            </span>
            <div className="h-[1.5px] w-full bg-gold my-0.5 rounded-full" />
            <span className="text-[8px] font-bold text-gold tracking-[0.2em] uppercase whitespace-nowrap">
              Chemistry Educator
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`font-semibold text-sm xl:text-base transition-colors ${
                activeSection === link.href.substring(1)
                  ? isScrolled ? "text-primary font-bold" : "text-accent font-bold"
                  : isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#demo"
            onClick={(e) => scrollToSection(e, "#demo")}
            className="btn-primary py-2 px-4 xl:px-5 text-sm whitespace-nowrap"
          >
            Book Demo
          </a>
        </div>

        {/* Mobile / Tablet Toggle */}
        <button
          className={`lg:hidden transition-colors ${isScrolled ? "text-gray-800" : "text-white"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile / Tablet Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-5 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`text-lg font-semibold transition-colors ${
                activeSection === link.href.substring(1)
                  ? "text-primary font-bold"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#demo"
            onClick={(e) => scrollToSection(e, "#demo")}
            className="btn-primary text-center py-2.5 mt-2"
          >
            Book Free Demo
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
