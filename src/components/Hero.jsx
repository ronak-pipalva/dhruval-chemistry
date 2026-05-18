import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { teacher } from "../data/teacherData";

const Hero = () => {
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
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-dark via-[#0a5c5e] to-primary"
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
            className="absolute text-white/20 font-mono text-xl md:text-3xl font-bold"
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-semibold mb-6">
            <span className="animate-pulse mr-2">●</span> {typedText}
            <span className="ml-1 border-r-2 border-accent animate-ping" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {teacher.tagline}
          </h1>
          <p className="text-lg md:text-xl text-light-accent/80 mb-8 max-w-lg leading-relaxed">
            M.Sc Chemistry | B.Ed | 2+ Years Experience | Rajkot, Gujarat.
            Providing top-quality education for 11th & 12th Standard students.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection("demo")}
              className="px-8 py-4 bg-accent hover:bg-white hover:text-primary text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-accent/20 flex items-center gap-2"
            >
              📅 Book Free Demo
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full transition-all duration-300"
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
          className="relative flex justify-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-2 border-2 border-accent/30">
            <div className="absolute inset-0 rounded-full border-2 border-accent border-dashed animate-spin-slow opacity-50" />
            <div className="absolute -inset-4 rounded-full border border-white/10 animate-[ping_4s_linear_infinite]" />
            <img
              src={teacher.photo}
              alt={teacher.name}
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
