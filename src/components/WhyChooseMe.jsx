import { motion } from "framer-motion";
import { Microscope, Lightbulb, TrendingUp, Atom } from "lucide-react";

const WhyChooseMe = () => {
  const features = [
    {
      icon: <Microscope className="w-8 h-8" />,
      title: "Lab Expert",
      description:
        "Hands-on practical experience with GSEB board exams and sophisticated lab protocols.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Simplified Concepts",
      description:
        "Complex topics broken into easy, logical steps for better understanding and retention.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Result Focused",
      description:
        "Consistent improvement in student scores with targeted practice and regular evaluation.",
    },
    {
      icon: <Atom className="w-8 h-8" />,
      title: "Board Specialist",
      description:
        "Deep knowledge of GSEB, CBSE & ISC syllabus with insights into exam patterns and scoring.",
    },
  ];

  return (
    <section className="py-20 bg-dark text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why Students Choose Dhruval Sir
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-accent/20 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
