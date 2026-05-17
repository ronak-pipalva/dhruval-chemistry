import { motion } from "framer-motion";
import { teacher } from "../data/teacherData";
import { Award, Users, BookOpen, GraduationCap } from "lucide-react";

const About = () => {
  const statIcons = [<Award />, <Users />, <BookOpen />, <GraduationCap />];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Info Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              About Me
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {teacher.profile}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
              {teacher.stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 bg-light-accent rounded-2xl border border-primary/10 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-primary mb-3 flex justify-center scale-110">
                    {statIcons[i]}
                  </div>
                  <div className="text-2xl font-bold text-dark">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12 text-left">
              {/* Skills */}
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">
                    ✓
                  </span>
                  Core Competencies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {teacher.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-white border border-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center text-sm">
                    🌐
                  </span>
                  Languages Known
                </h3>
                <div className="space-y-4">
                  {teacher.languages.map((lang, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                    >
                      <span className="font-bold text-dark">{lang}</span>
                      <span className="text-xl">
                        {lang === "Gujarati"
                          ? "🇮🇳"
                          : lang === "Hindi"
                            ? "🇮🇳"
                            : "🇬🇧"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
