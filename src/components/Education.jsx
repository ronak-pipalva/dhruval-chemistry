import { motion } from "framer-motion";
import { teacher } from "../data/teacherData";
import { GraduationCap, Calendar, Award } from "lucide-react";

const Education = () => {
  return (
    <section id="education" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
          Educational Qualifications
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {teacher.education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-8 rounded-2xl shadow-xl border-t-4 border-primary hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              {/* Background Icon Decoration */}
              <div className="absolute -bottom-6 -right-6 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
                <GraduationCap size={120} />
              </div>

              <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <GraduationCap size={28} />
              </div>

              <h3 className="text-xl font-bold text-dark mb-2 leading-tight h-14">
                {edu.degree}
              </h3>

              <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                <Award size={18} />
                <span>{edu.university}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={16} />
                  <span>{edu.year}</span>
                </div>
                <div className="inline-block px-4 py-1 bg-light-accent text-primary rounded-full font-bold text-sm">
                  {edu.percentage === "Pursuing"
                    ? "Pursuing"
                    : `Score: ${edu.percentage}`}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
