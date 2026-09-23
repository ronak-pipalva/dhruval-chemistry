import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "../context/NotesContext";
import { ClipboardList, ExternalLink, FileText } from "lucide-react";

const PracticeZone = () => {
  const { practiceUnits, loading } = useNotes();

  return (
    <section id="practice" className="py-20 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-heading text-center mb-4">
          Practice Zone
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          Test your knowledge with unit-wise MCQ practice sets. Attempt the
          questions and check your answers with detailed solutions.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted font-medium">
              Loading practice sets...
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {practiceUnits.length > 0 ? (
                practiceUnits.map((unit) => (
                  <motion.div
                    key={unit.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                          <ClipboardList size={28} />
                        </div>
                        <span className="text-xs bg-accent/10 text-accent font-bold px-3 py-1 rounded-full">
                          {unit.no_of_questions} Questions
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-heading mb-2 leading-tight group-hover:text-accent transition-colors">
                        {unit.unit_name}
                      </h3>

                      {unit.description && (
                        <p className="text-sm text-muted mb-6 leading-relaxed line-clamp-3">
                          {unit.description}
                        </p>
                      )}

                      <div className="mt-auto flex flex-col sm:flex-row gap-3">
                        <a
                          href={unit.form_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 bg-accent hover:bg-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 text-sm"
                        >
                          <ExternalLink size={16} />
                          Start Practice
                        </a>
                        <a
                          href={unit.solution_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 bg-surface-hover hover:bg-surface text-text font-bold rounded-xl border border-border transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <FileText size={16} />
                          View Solution
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-muted mb-4 flex justify-center">
                    <ClipboardList size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-heading">
                    No practice sets available yet
                  </h3>
                  <p className="text-muted">
                    Practice sets will be added soon. Stay tuned!
                  </p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PracticeZone;
