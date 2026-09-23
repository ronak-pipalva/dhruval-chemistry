import { useState, useEffect, useMemo } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  // Text color for nav elements over the hero (non-scrolled state)
  const heroText = isDark ? "text-white" : "text-heading";
  const heroLink = isDark ? "text-white/90 hover:text-white" : "text-muted hover:text-accent";
  const heroIcon = isDark ? "text-white" : "text-heading";

  const navLinks = useMemo(
    () => [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Experience", href: "#experience" },
      { name: "Study Material", href: "#notes" },
      { name: "Practice Zone", href: "#practice" },
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
          <span className="text-3xl text-accent flex-shrink-0">⚗️</span>
          <div className="flex flex-col items-start leading-none select-none">
            <span className={`font-heading font-extrabold text-xl md:text-2xl tracking-tight transition-colors duration-300 ${isScrolled ? "text-heading" : heroText}`}>
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
                  ? isScrolled ? "text-accent font-bold" : "text-accent font-bold"
                  : isScrolled ? "text-muted hover:text-accent" : heroLink
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
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg transition-colors duration-300 ${
              isScrolled
                ? "text-heading hover:bg-surface-hover"
                : `${heroIcon} ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`
            }`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile / Tablet Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`transition-colors p-2 rounded-lg ${
              isScrolled
                ? "text-heading hover:bg-surface-hover"
                : `${heroIcon} ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`
            }`}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            className={`lg:hidden transition-colors ${isScrolled ? "text-heading" : heroIcon}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full glass shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 border-t border-border" : "max-h-0"
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
                  ? "text-accent font-bold"
                  : "text-muted hover:text-accent"
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
