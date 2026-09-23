import { motion } from "framer-motion";
import { teacher } from "../data/teacherData";
import { Microscope, Book, School } from "lucide-react";

const Experience = () => {
  const icons = [<Microscope />, <Book />, <School />];

  return (
    <section id="experience" className="py-20 bg-bg-alt">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-heading text-center mb-16">
          Work Experience
        </h2>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-accent/20" />

          {teacher.experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`relative mb-12 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right md:ml-0" : "md:pl-12 md:ml-auto"}`}
            >
              {/* Dot */}
              <div
                className="absolute top-0 left-[-8px] md:left-auto md:right-[-12px] w-6 h-6 bg-accent rounded-full border-4 border-bg z-10 shadow-md transform translate-x-1/2 md:translate-x-0"
                style={i % 2 !== 0 ? { left: "-12px" } : {}}
              />

              <div className="glass-panel p-6 rounded-2xl shadow-lg hover:border-accent/30 transition-all duration-300">
                <div
                  className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? "md:justify-end" : ""}`}
                >
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">
                    {icons[i] || <Microscope />}
                  </div>
                  <span className="text-accent font-bold text-sm uppercase tracking-wider">
                    {exp.period}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-heading mb-1">{exp.role}</h3>
                <div className="text-accent font-semibold mb-3">
                  {exp.company}, {exp.location}
                </div>

                <ul
                  className={`text-muted text-sm space-y-2 list-none ${i % 2 === 0 ? "md:text-right" : ""}`}
                >
                  {exp.points.map((point, j) => (
                    <li key={j} className="flex gap-2 items-start justify-end">
                      {i % 2 !== 0 ? (
                        <>
                          <span className="text-accent mt-1">•</span>
                          <span>{point}</span>
                        </>
                      ) : (
                        <div className="md:contents hidden">
                          <span>{point}</span>
                          <span className="text-accent mt-1">•</span>
                        </div>
                      )}
                      {/* Mobile version always has bullet on left */}
                      <div className="md:hidden flex gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{point}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
