import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "../context/NotesContext";
import { Download, FileText, Search, Folder, FolderOpen, ChevronDown, ChevronUp } from "lucide-react";

const Notes = () => {
  const { notes, loading } = useNotes();
  const [activeTab, setActiveTab] = useState("11th");
  const [selectedMedium, setSelectedMedium] = useState("GM");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});

  const filteredNotes = notes.filter((note) => {
    const matchesTab = note.standard === activeTab;
    const matchesSearch = note.chapter
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const noteMedium = note.medium || "EM";
    const matchesMedium =
      selectedMedium === "all" ||
      noteMedium === selectedMedium ||
      noteMedium === "Both";

    return matchesTab && matchesSearch && matchesMedium;
  });

  // Group notes by chapter
  const groupedNotes = filteredNotes.reduce((groups, note) => {
    const chapter = note.chapter || "General";
    if (!groups[chapter]) {
      groups[chapter] = [];
    }
    groups[chapter].push(note);
    return groups;
  }, {});

  const chaptersList = Object.keys(groupedNotes);

  const toggleChapter = (chapter) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }));
  };

  const getCleanFilename = (url) => {
    if (!url) return "Document.pdf";
    if (url.includes("drive.google.com")) {
      return "Google Drive File";
    }
    try {
      const filename = decodeURIComponent(url.split("/").pop());
      const underscoreIndex = filename.indexOf("_");
      if (underscoreIndex !== -1) {
        const prefix = filename.substring(0, underscoreIndex);
        if (/^\d{13}$/.test(prefix) || /^\d+$/.test(prefix)) {
          return filename.substring(underscoreIndex + 1);
        }
      }
      return filename;
    } catch (e) {
      return "Document.pdf";
    }
  };

  const handleDownload = (file, chapter) => {
    if (file) {
      window.open(file, "_blank");
    } else {
      alert(`Notes for "${chapter}" are coming soon! 🔜`);
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
          Simplified explanations of complex chapters to help you excel in GSEB,
          CBSE & ISC boards.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
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

        {/* Medium Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm flex gap-1 border border-gray-100">
            {[
              { id: "EM", label: "English Medium (EM)" },
              { id: "GM", label: "Gujarati Medium (GM)" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMedium(m.id)}
                className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 ${
                  selectedMedium === m.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search chapters..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">
              Loading study materials...
            </p>
          </div>
        ) : (
          /* Notes Folders Grid */
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {chaptersList.length > 0 ? (
                chaptersList.map((chapter) => {
                  const chapterNotes = groupedNotes[chapter];
                  const isExpanded = !!expandedChapters[chapter];
                  return (
                    <motion.div
                      key={chapter}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-fit"
                    >
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

                        <div className="flex justify-between items-center mb-4 relative z-10">
                          <div className="p-3 bg-light-accent text-primary rounded-xl flex items-center justify-center">
                            {isExpanded ? (
                              <FolderOpen size={28} />
                            ) : (
                              <Folder size={28} />
                            )}
                          </div>
                          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                            {chapterNotes.length} {chapterNotes.length === 1 ? "file" : "files"}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-dark mb-4 leading-tight group-hover:text-primary transition-colors relative z-10">
                          {chapter}
                        </h3>

                        <button
                          onClick={() => toggleChapter(chapter)}
                          className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl flex items-center justify-between border border-gray-200 transition-all duration-300 relative z-10"
                        >
                          <span className="text-sm">
                            {isExpanded ? "Hide materials" : "View materials"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>

                        {/* Files List Accordion */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-4 pt-4 border-t border-gray-100 space-y-4 relative z-10 text-left"
                            >
                              {(() => {
                                // Group notes by medium
                                const groupedByMedium = chapterNotes.reduce(
                                  (acc, note) => {
                                    const med = note.medium || "EM";
                                    if (med === "Both") {
                                      acc["EM"].push(note);
                                      acc["GM"].push(note);
                                    } else {
                                      if (acc[med]) {
                                        acc[med].push(note);
                                      }
                                    }
                                    return acc;
                                  },
                                  { EM: [], GM: [] }
                                );

                                return Object.entries(groupedByMedium).map(
                                  ([med, files]) => {
                                    if (files.length === 0) return null;
                                    // If a specific medium filter is active, only show that medium group
                                    if (
                                      selectedMedium !== "all" &&
                                      med !== selectedMedium
                                    ) {
                                      return null;
                                    }

                                    return (
                                      <div key={med} className="space-y-2">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1">
                                          {med === "EM"
                                            ? "English Medium (EM)"
                                            : "Gujarati Medium (GM)"}
                                        </div>
                                        {files.map((note) => (
                                          <div
                                            key={note.id}
                                            className="flex items-center justify-between p-3 bg-light-accent/40 hover:bg-light-accent rounded-xl border border-gray-100/50 transition-all duration-200 group/file"
                                          >
                                            <div className="flex items-center gap-2 max-w-[70%]">
                                              <FileText
                                                size={16}
                                                className="text-primary flex-shrink-0"
                                              />
                                              <span className="text-xs font-semibold text-gray-700 truncate" title={note.file_name || getCleanFilename(note.file_url)}>
                                                {note.file_name ||
                                                  getCleanFilename(note.file_url)}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() =>
                                                handleDownload(
                                                  note.file_url,
                                                  chapter
                                                )
                                              }
                                              className="p-2 bg-white text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all group-hover/file:border-primary border border-gray-200"
                                              title="Download PDF"
                                            >
                                              <Download size={14} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  }
                                );
                              })()}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })
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
        )}
      </div>
    </section>
  );
};

export default Notes;
