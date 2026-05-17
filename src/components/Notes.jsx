import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "../context/NotesContext";
import { Download, FileText, Search } from "lucide-react";

const Notes = () => {
  const { notes } = useNotes();
  const [activeTab, setActiveTab] = useState("11th");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const subjects = ["All", "Physical", "Organic", "Inorganic"];

  const filteredNotes = notes.filter((note) => {
    const matchesTab = note.standard === activeTab;
    const matchesFilter =
      activeFilter === "All" || note.subject === activeFilter;
    const matchesSearch = note.chapter
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesFilter && matchesSearch;
  });

  const handleDownload = (file, chapter) => {
    // In a real app, we'd check if file exists
    // For now, we'll just open it if it starts with /notes/
    if (file && file.startsWith("/notes/")) {
      window.open(file, "_blank");
    } else {
      alert(`Notes for "${chapter}" are coming soon! 🔜`);
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case "Physical":
        return "bg-blue-500";
      case "Organic":
        return "bg-green-500";
      case "Inorganic":
        return "bg-purple-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <section id="notes" className="py-20 bg-light-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
          Study Material
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Access high-quality chemistry notes for 11th & 12th standards.
          Simplified explanations of complex chapters to help you excel in GSEB
          & CBSE boards.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-md flex gap-1 border">
            {["11th", "12th"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab} Standard
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveFilter(sub)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                  activeFilter === sub
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-gray-200 text-gray-500 hover:border-primary/30"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search chapters..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Notes Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col"
                >
                  {/* Top Color Bar */}
                  <div className={`h-2 ${getSubjectColor(note.subject)}`} />

                  <div className="p-6 flex-grow flex flex-col relative">
                    {/* Notebook Paper Lines Decoration */}
                    <div
                      className="absolute inset-x-0 top-0 h-full pointer-events-none opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "100% 2rem",
                      }}
                    />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-2 bg-light-accent text-primary rounded-lg">
                        <FileText size={24} />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${getSubjectColor(note.subject)}`}
                      >
                        {note.subject}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-dark mb-4 leading-tight group-hover:text-primary transition-colors relative z-10">
                      {note.chapter}
                    </h3>

                    <div className="mt-auto relative z-10">
                      <button
                        onClick={() => handleDownload(note.file, note.chapter)}
                        className="w-full py-3 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 font-bold rounded-xl flex items-center justify-center gap-2 border border-gray-200 transition-all duration-300 group-hover:border-primary"
                      >
                        <Download size={18} />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="text-gray-400 mb-4 flex justify-center">
                  <FileText size={64} />
                </div>
                <h3 className="text-xl font-bold text-gray-600">
                  No notes found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Notes;
