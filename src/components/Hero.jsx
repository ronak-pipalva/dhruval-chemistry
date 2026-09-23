import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { teacher } from "../data/teacherData";
import { useTheme } from "../context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [typedText, setTypedText] = useState("");
  const subjects = useMemo(
    () => ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
    [],
  );
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentSubject = subjects[subjectIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentSubject.length) {
        setTypedText(currentSubject.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentSubject.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentSubject.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setSubjectIndex((prev) => (prev + 1) % subjects.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, subjectIndex, subjects]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const chemistryElements = [
    { text: "H₂O", top: "15%", left: "10%" },
    { text: "NaCl", top: "25%", left: "80%" },
    { text: "CO₂", top: "70%", left: "15%" },
    { text: "CH₄", top: "80%", left: "75%" },
    { text: "C₆H₆", top: "40%", left: "85%" },
    { text: "NH₃", top: "10%", left: "70%" },
  ];

  // Pre-generate random values to avoid Math.random during render
  const benzeneRings = useMemo(
    () =>
      [...Array(6)].map((_, i) => ({
        id: i,
        top: `${10 + i * 12}%`, // deterministic random-ish
        left: `${15 + (i % 3) * 25}%`,
        duration: 12 + i * 2,
        delay: i * 0.5,
      })),
    [],
  );

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center pt-20 pb-12 md:pb-0 overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-[#0a1128] via-[#0f1e3d] to-[#0a1f3d]"
          : "bg-gradient-to-br from-light-accent via-white to-[#e8f5f5]"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hexagons / Benzene rings */}
        {benzeneRings.map((ring) => (
          <motion.div
            key={`hex-${ring.id}`}
            className="absolute opacity-10 border-2 border-accent w-24 h-24"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              top: ring.top,
              left: ring.left,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: ring.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Molecular Formulas */}
        {chemistryElements.map((el, i) => (
          <motion.div
            key={i}
            className={`absolute font-mono text-xl md:text-3xl font-bold ${isDark ? "text-white/20" : "text-accent/20"}`}
            style={{ top: el.top, left: el.left }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            {el.text}
          </motion.div>
        ))}

        {/* Atom Orbit Circles */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border rounded-full animate-spin-slow ${isDark ? "border-white/5" : "border-accent/10"}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border rounded-full animate-[spin_12s_linear_infinite_reverse] ${isDark ? "border-white/5" : "border-accent/10"}`} />
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10 grid md:grid-cols-2 gap-6 lg:gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={`inline-block px-4 py-1 rounded-full border font-semibold mt-4 md:mt-0 mb-6 ${isDark ? "bg-accent/20 border-accent/30 text-accent" : "bg-accent/10 border-accent/30 text-accent"}`}>
            <span className="animate-pulse mr-2">●</span> {typedText}
            <span className="ml-1 border-r-2 border-accent animate-ping" />
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? "text-white" : "text-heading"}`}>
            {teacher.tagline}
          </h1>
          <p className={`text-lg md:text-xl mb-8 max-w-lg leading-relaxed ${isDark ? "text-white/80" : "text-muted"}`}>
            M.Sc Chemistry | B.Ed | 2+ Years Experience | Rajkot, Gujarat.
            Providing top-quality education for 11th & 12th Standard students.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection("demo")}
              className="px-8 py-4 bg-accent hover:bg-white hover:text-accent text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-accent/20 flex items-center gap-2"
            >
              📅 Book Free Demo
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`px-8 py-4 border-2 font-bold rounded-full transition-all duration-300 ${isDark ? "border-white/30 hover:border-white text-white" : "border-accent/40 hover:border-accent text-heading"}`}
            >
              📞 Contact Me
            </button>
          </div>
        </motion.div>

        {/* Right Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex flex-col items-center justify-center gap-6"
        >
          <div className={`relative w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full p-2 border-2 border-accent/30`}>
            <div className="absolute inset-0 rounded-full border-2 border-accent border-dashed animate-spin-slow opacity-50" />
            <div className={`absolute -inset-4 rounded-full border animate-[ping_4s_linear_infinite] ${isDark ? "border-white/10" : "border-accent/10"}`} />
            <img
              src={teacher.photo}
              alt={teacher.name}
              className={`w-full h-full object-cover rounded-full border-4 shadow-2xl ${isDark ? "border-white" : "border-white"}`}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>

          <div className={`text-center backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl max-w-xs transition-all hover:scale-105 duration-300 ${isDark ? "bg-white/10 border border-white/20" : "bg-white/70 border border-accent/20"}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-accent">
              Founder of ChemConcept
            </div>
            <div className={`text-lg font-extrabold mt-1 ${isDark ? "text-white" : "text-heading"}`}>
              Dhruval Talsaniya
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
