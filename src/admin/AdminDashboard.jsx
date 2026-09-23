import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  X,
  Save,
  FileText,
  Users,
  Mail,
  Upload,
  Calendar,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const AdminDashboard = () => {
  const {
    notes,
    practiceUnits,
    demoRequests,
    contactMessages,
    isAdminLoggedIn,
    logout,
    addNote,
    updateNote,
    deleteNote,
    addPracticeUnit,
    updatePracticeUnit,
    deletePracticeUnit,
  } = useNotes();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("notes");
  const [lastViewedDemos, setLastViewedDemos] = useState(() => {
    return localStorage.getItem("lastViewedDemos") || new Date(0).toISOString();
  });
  const [lastViewedMessages, setLastViewedMessages] = useState(() => {
    return localStorage.getItem("lastViewedMessages") || new Date(0).toISOString();
  });

  useEffect(() => {
    if (activeTab === "demos") {
      const now = new Date().toISOString();
      localStorage.setItem("lastViewedDemos", now);
      setLastViewedDemos(now);
    } else if (activeTab === "messages") {
      const now = new Date().toISOString();
      localStorage.setItem("lastViewedMessages", now);
      setLastViewedMessages(now);
    }
  }, [activeTab]);

  const unreadDemosCount = demoRequests.filter(
    (req) => new Date(req.created_at) > new Date(lastViewedDemos)
  ).length;

  const unreadMessagesCount = contactMessages.filter(
    (msg) => new Date(msg.created_at) > new Date(lastViewedMessages)
  ).length;
  const [newNote, setNewNote] = useState({
    standard: "11th",
    chapter: "",
    medium: "EM",
    fileName: "",
    fileUrl: "",
  });
  const [chapterInputMode, setChapterInputMode] = useState("select"); // "select" or "new"
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});

  // Practice Zone state
  const [newPracticeUnit, setNewPracticeUnit] = useState({
    unit_name: "",
    description: "",
    no_of_questions: "",
    form_link: "",
    solution_link: "",
  });
  const [practiceUploading, setPracticeUploading] = useState(false);
  const [editingPracticeId, setEditingPracticeId] = useState(null);
  const [editPracticeData, setEditPracticeData] = useState({});

  const toggleChapter = (key) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [key]: !prev[key],
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

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.chapter || !newNote.fileUrl || !newNote.fileName) {
      alert("Please fill in all fields (Chapter Name, Display File Name, and Google Drive Link).");
      return;
    }

    setUploading(true);
    try {
      const result = await addNote({
        standard: newNote.standard,
        chapter: newNote.chapter.trim(),
        file_url: newNote.fileUrl,
        medium: newNote.medium || "EM",
        file_name: newNote.fileName.trim(),
      });

      if (result.success) {
        setNewNote({
          standard: "11th",
          chapter: "",
          medium: "EM",
          fileName: "",
          fileUrl: "",
        });
        setChapterInputMode("select");
        e.target.reset();
      } else {
        alert("Failed to add note: " + result.error);
      }
    } catch (error) {
      console.error("Save error:", error.message);
      alert("Error saving note: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditFormData(note);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const saveEdit = async () => {
    const result = await updateNote(editingId, {
      ...editFormData,
      chapter: editFormData.chapter?.trim(),
      file_name: editFormData.file_name?.trim(),
    });
    if (result.success) {
      setEditingId(null);
    } else {
      alert("Failed to update: " + result.error);
    }
  };

  // Practice Zone handlers
  const handleAddPracticeUnit = async (e) => {
    e.preventDefault();
    if (!newPracticeUnit.unit_name || !newPracticeUnit.form_link || !newPracticeUnit.solution_link || !newPracticeUnit.no_of_questions) {
      alert("Please fill in all required fields.");
      return;
    }

    setPracticeUploading(true);
    try {
      const result = await addPracticeUnit({
        unit_name: newPracticeUnit.unit_name.trim(),
        description: newPracticeUnit.description.trim(),
        no_of_questions: parseInt(newPracticeUnit.no_of_questions, 10),
        form_link: newPracticeUnit.form_link.trim(),
        solution_link: newPracticeUnit.solution_link.trim(),
      });

      if (result.success) {
        setNewPracticeUnit({
          unit_name: "",
          description: "",
          no_of_questions: "",
          form_link: "",
          solution_link: "",
        });
      } else {
        alert("Failed to add practice unit: " + result.error);
      }
    } catch (error) {
      console.error("Save error:", error.message);
      alert("Error saving practice unit: " + error.message);
    } finally {
      setPracticeUploading(false);
    }
  };

  const startEditPractice = (unit) => {
    setEditingPracticeId(unit.id);
    setEditPracticeData(unit);
  };

  const cancelEditPractice = () => {
    setEditingPracticeId(null);
    setEditPracticeData({});
  };

  const saveEditPractice = async () => {
    const result = await updatePracticeUnit(editingPracticeId, {
      unit_name: editPracticeData.unit_name?.trim(),
      description: editPracticeData.description?.trim(),
      no_of_questions: parseInt(editPracticeData.no_of_questions, 10),
      form_link: editPracticeData.form_link?.trim(),
      solution_link: editPracticeData.solution_link?.trim(),
    });
    if (result.success) {
      setEditingPracticeId(null);
    } else {
      alert("Failed to update: " + result.error);
    }
  };

  const existingChaptersForSelectedStd = Array.from(
    new Set(
      notes
        .filter((note) => {
          if (note.standard !== newNote.standard) return false;
          if (newNote.medium === "Both") return true;
          return note.medium === newNote.medium || note.medium === "Both";
        })
        .map((note) => note.chapter?.trim())
        .filter(Boolean)
    )
  ).sort();

  useEffect(() => {
    if (!newNote.chapter) return; // keep current mode when field is empty
    if (existingChaptersForSelectedStd.includes(newNote.chapter)) {
      setChapterInputMode("select");
    } else {
      setChapterInputMode("new");
    }
  }, [newNote.chapter, existingChaptersForSelectedStd]);

  const stats = {
    total: notes.length,
    std11: notes.filter((n) => n.standard === "11th").length,
    std12: notes.filter((n) => n.standard === "12th").length,
    demos: demoRequests.length,
    messages: contactMessages.length,
    practiceCount: practiceUnits.length,
  };

  if (!isAdminLoggedIn) return null;

  const fieldInput =
    "w-full px-4 py-3 rounded-xl border border-border bg-input-bg text-text placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all";

  const editInput =
    "w-full px-3 py-1.5 rounded-lg border border-border bg-input-bg text-text text-xs outline-none focus:border-accent transition-all";

  const labelSm = "block text-xs font-bold text-muted uppercase mb-2";
  const labelXs = "block text-[10px] font-bold text-muted uppercase mb-1";

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-bg-alt text-text p-6 flex flex-col border-r border-border">
        <div className="flex items-center gap-3 text-accent font-bold text-xl mb-12">
          <span>⚗️</span>
          <span className="text-heading">Admin Panel</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button
            onClick={() => setActiveTab("notes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "notes" ? "bg-accent text-white" : "text-muted hover:text-heading hover:bg-surface-hover"}`}
          >
            <FileText size={20} />
            Notes Manager
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "practice" ? "bg-accent text-white" : "text-muted hover:text-heading hover:bg-surface-hover"}`}
          >
            <ClipboardList size={20} />
            Practice Zone
          </button>
          <button
            onClick={() => setActiveTab("demos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "demos" ? "bg-accent text-white" : "text-muted hover:text-heading hover:bg-surface-hover"}`}
          >
            <Calendar size={20} />
            Demo Requests
            {unreadDemosCount > 0 && (
              <span className="ml-auto bg-accent text-white text-[10px] px-2 py-1 rounded-full">
                {unreadDemosCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "messages" ? "bg-accent text-white" : "text-muted hover:text-heading hover:bg-surface-hover"}`}
          >
            <Mail size={20} />
            Contact Messages
            {unreadMessagesCount > 0 && (
              <span className="ml-auto bg-accent text-white text-[10px] px-2 py-1 rounded-full">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-muted hover:text-heading hover:bg-surface-hover rounded-xl transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-heading text-capitalize">
              {activeTab === "notes"
                ? "Notes Management"
                : activeTab === "practice"
                  ? "Practice Zone Manager"
                  : activeTab === "demos"
                    ? "Demo Requests"
                    : "Student Inquiries"}
            </h1>
            <p className="text-muted">Welcome back, Dhruval Sir</p>
          </div>

          {activeTab === "notes" && (
            <div className="flex gap-4">
              <div className="glass-panel px-6 py-3 rounded-2xl text-center">
                <div className="text-sm text-muted font-bold uppercase tracking-wider">
                  Total Notes
                </div>
                <div className="text-2xl font-bold text-accent">
                  {stats.total}
                </div>
              </div>
            </div>
          )}
          {activeTab === "practice" && (
            <div className="flex gap-4">
              <div className="glass-panel px-6 py-3 rounded-2xl text-center">
                <div className="text-sm text-muted font-bold uppercase tracking-wider">
                  Practice Units
                </div>
                <div className="text-2xl font-bold text-accent">
                  {stats.practiceCount}
                </div>
              </div>
            </div>
          )}
        </header>

        {activeTab === "notes" && (
          <>
            {/* Add Note Form */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl mb-10">
              <h2 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
                <Plus className="text-accent" />
                Add New Note
              </h2>
              <form
                onSubmit={handleAddSubmit}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelSm}>
                      Standard
                    </label>
                    <select
                      value={newNote.standard}
                      onChange={(e) =>
                        setNewNote({ ...newNote, standard: e.target.value })
                      }
                      className={fieldInput}
                    >
                      <option value="11th">11th Standard</option>
                      <option value="12th">12th Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelSm}>
                      Medium
                    </label>
                    <select
                      value={newNote.medium}
                      onChange={(e) =>
                        setNewNote({ ...newNote, medium: e.target.value })
                      }
                      className={fieldInput}
                    >
                      <option value="EM">English Medium (EM)</option>
                      <option value="GM">Gujarati Medium (GM)</option>
                      <option value="Both">Both (EM & GM)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelSm}>
                      Chapter Name
                    </label>
                    <select
                      value={chapterInputMode === "select" ? newNote.chapter : "new"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "new") {
                          setChapterInputMode("new");
                          setNewNote({ ...newNote, chapter: "" });
                        } else {
                          setChapterInputMode("select");
                          setNewNote({ ...newNote, chapter: value });
                        }
                      }}
                      className={fieldInput}
                      required
                    >
                      <option value="">Select Chapter</option>
                      {existingChaptersForSelectedStd.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch}
                        </option>
                      ))}
                      <option value="new">+ Add New Chapter</option>
                    </select>
                    {chapterInputMode === "new" && (
                      <input
                        type="text"
                        placeholder="e.g. Chemical Bonding"
                        value={newNote.chapter}
                        onChange={(e) =>
                          setNewNote({ ...newNote, chapter: e.target.value })
                        }
                        className={`mt-2 ${fieldInput}`}
                        required
                        autoComplete="off"
                      />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelSm}>
                      Display File Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Theory Notes"
                      value={newNote.fileName}
                      onChange={(e) =>
                        setNewNote({ ...newNote, fileName: e.target.value })
                      }
                      className={fieldInput}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelSm}>
                      Google Drive Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={newNote.fileUrl}
                      onChange={(e) =>
                        setNewNote({ ...newNote, fileUrl: e.target.value })
                      }
                      className={fieldInput}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-3 bg-accent hover:bg-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <span className="animate-spin">⌛</span>
                      ) : (
                        <Plus size={18} />
                      )}
                      {uploading ? "Saving..." : "Add Note"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Notes Grouped by Folders */}
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-bold text-heading">Notes Folder Structure</h3>
              </div>
              <div className="divide-y divide-border">
                {(() => {
                  // Group notes by standard and chapter
                  const groupedAdminNotes = notes.reduce((acc, note) => {
                    const key = `${note.standard} - ${note.chapter?.trim()}`;
                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push(note);
                    return acc;
                  }, {});

                  const keys = Object.keys(groupedAdminNotes);

                  if (keys.length === 0) {
                    return (
                      <div className="p-10 text-center text-muted">
                        No notes uploaded yet.
                      </div>
                    );
                  }

                  return keys.map((groupKey) => {
                    const [std, chapter] = groupKey.split(" - ");
                    const notesInGroup = groupedAdminNotes[groupKey];
                    const isExpanded = !!expandedChapters[groupKey];

                    return (
                      <div key={groupKey} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => toggleChapter(groupKey)}
                          className="flex items-center justify-between px-6 py-4 hover:bg-surface-hover transition-colors w-full text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-accent/10 text-accent rounded-lg">
                              {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full mr-2">
                                {std}
                              </span>
                              <span className="font-semibold text-heading">{chapter}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted font-bold">
                              {notesInGroup.length} {notesInGroup.length === 1 ? "file" : "files"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-muted" />
                            ) : (
                              <ChevronDown size={16} className="text-muted" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="bg-surface-hover/30 px-6 py-2 border-t border-border">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-border text-[10px] font-bold text-muted uppercase tracking-wider">
                                  <th className="py-2">File Name</th>
                                  <th className="py-2 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {notesInGroup.map((note) => {
                                  const isEditing = editingId === note.id;
                                  return (
                                    <tr key={note.id} className="hover:bg-surface-hover/50">
                                      {isEditing ? (
                                        <td className="py-3 px-2 text-sm text-text font-medium" colSpan="2">
                                          <div className="flex flex-col gap-3 p-3 bg-accent/5 rounded-2xl border border-accent/10">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <div>
                                                <label className={labelXs}>
                                                  Display File Name
                                                </label>
                                                <input
                                                  type="text"
                                                  value={editFormData.file_name || ""}
                                                  onChange={(e) =>
                                                    setEditFormData({
                                                      ...editFormData,
                                                      file_name: e.target.value,
                                                    })
                                                  }
                                                  placeholder="e.g. Theory Notes"
                                                  className={editInput}
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <label className={labelXs}>
                                                  Google Drive Link
                                                </label>
                                                <input
                                                  type="url"
                                                  value={editFormData.file_url || ""}
                                                  onChange={(e) =>
                                                    setEditFormData({
                                                      ...editFormData,
                                                      file_url: e.target.value,
                                                    })
                                                  }
                                                  placeholder="https://drive.google.com/..."
                                                  className={editInput}
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <label className={labelXs}>
                                                  Chapter Name
                                                </label>
                                                <input
                                                  type="text"
                                                  value={editFormData.chapter || ""}
                                                  onChange={(e) =>
                                                    setEditFormData({
                                                      ...editFormData,
                                                      chapter: e.target.value,
                                                    })
                                                  }
                                                  className={editInput}
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <label className={labelXs}>
                                                  Standard
                                                </label>
                                                <select
                                                  value={editFormData.standard || "11th"}
                                                  onChange={(e) =>
                                                    setEditFormData({
                                                      ...editFormData,
                                                      standard: e.target.value,
                                                    })
                                                  }
                                                  className={editInput}
                                                >
                                                  <option value="11th">11th Standard</option>
                                                  <option value="12th">12th Standard</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label className={labelXs}>
                                                  Medium
                                                </label>
                                                <select
                                                  value={editFormData.medium || "EM"}
                                                  onChange={(e) =>
                                                    setEditFormData({
                                                      ...editFormData,
                                                      medium: e.target.value,
                                                    })
                                                  }
                                                  className={editInput}
                                                >
                                                  <option value="EM">English Medium (EM)</option>
                                                  <option value="GM">Gujarati Medium (GM)</option>
                                                  <option value="Both">Both (EM & GM)</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                              <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-3 py-1.5 bg-surface-hover hover:bg-surface text-text font-bold rounded-lg text-xs transition-all flex items-center gap-1"
                                              >
                                                <X size={12} />
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                onClick={saveEdit}
                                                className="px-3 py-1.5 bg-accent hover:bg-dark text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-md shadow-accent/10"
                                              >
                                                <Save size={12} />
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        </td>
                                      ) : (
                                        <>
                                          <td className="py-3 text-sm text-text font-medium">
                                            <div className="flex items-center gap-2">
                                              <FileText size={14} className="text-muted" />
                                              <div className="flex flex-col">
                                                <a
                                                  href={note.file_url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="hover:text-accent hover:underline truncate max-w-md"
                                                >
                                                  {note.file_name || getCleanFilename(note.file_url)}
                                                </a>
                                                <div className="flex gap-2 items-center mt-0.5">
                                                  <span className="text-[10px] text-muted">
                                                    URL: {getCleanFilename(note.file_url)}
                                                  </span>
                                                  <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.2 rounded font-bold uppercase">
                                                    {note.medium || "EM"}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                              <button
                                                type="button"
                                                onClick={() => startEdit(note)}
                                                className="p-1.5 text-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                                                title="Edit note details"
                                              >
                                                <Edit2 size={16} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => deleteNote(note.id)}
                                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete note"
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </>
        )}

        {activeTab === "practice" && (
          <>
            {/* Add Practice Unit Form */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl mb-10">
              <h2 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
                <Plus className="text-accent" />
                Add New Practice Unit
              </h2>
              <form onSubmit={handleAddPracticeUnit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelSm}>Unit Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Unit 1 - Chemical Bonding"
                      value={newPracticeUnit.unit_name}
                      onChange={(e) =>
                        setNewPracticeUnit({ ...newPracticeUnit, unit_name: e.target.value })
                      }
                      className={fieldInput}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelSm}>Number of Questions</label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      min="1"
                      value={newPracticeUnit.no_of_questions}
                      onChange={(e) =>
                        setNewPracticeUnit({ ...newPracticeUnit, no_of_questions: e.target.value })
                      }
                      className={fieldInput}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={labelSm}>Description</label>
                  <input
                    type="text"
                    placeholder="e.g. MCQ practice covering ionic and covalent bonding concepts"
                    value={newPracticeUnit.description}
                    onChange={(e) =>
                      setNewPracticeUnit({ ...newPracticeUnit, description: e.target.value })
                    }
                    className={fieldInput}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelSm}>Google Form Link (Practice)</label>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/forms/d/.../viewform"
                      value={newPracticeUnit.form_link}
                      onChange={(e) =>
                        setNewPracticeUnit({ ...newPracticeUnit, form_link: e.target.value })
                      }
                      className={fieldInput}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelSm}>Solution PDF Link (Drive)</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={newPracticeUnit.solution_link}
                      onChange={(e) =>
                        setNewPracticeUnit({ ...newPracticeUnit, solution_link: e.target.value })
                      }
                      className={fieldInput}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={practiceUploading}
                      className="w-full py-3 bg-accent hover:bg-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {practiceUploading ? (
                        <span className="animate-spin">&#8987;</span>
                      ) : (
                        <Plus size={18} />
                      )}
                      {practiceUploading ? "Saving..." : "Add Unit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Practice Units List */}
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="font-bold text-heading">Practice Units</h3>
                <span className="text-xs text-muted font-bold">
                  {stats.practiceCount} {stats.practiceCount === 1 ? "unit" : "units"}
                </span>
              </div>
              <div className="divide-y divide-border">
                {practiceUnits.length === 0 ? (
                  <div className="p-10 text-center text-muted">
                    No practice units added yet.
                  </div>
                ) : (
                  practiceUnits.map((unit) => {
                    const isEditing = editingPracticeId === unit.id;
                    return (
                      <div key={unit.id} className="px-6 py-4 hover:bg-surface-hover/50 transition-colors">
                        {isEditing ? (
                          <div className="flex flex-col gap-3 p-3 bg-accent/5 rounded-2xl border border-accent/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className={labelXs}>Unit Name</label>
                                <input
                                  type="text"
                                  value={editPracticeData.unit_name || ""}
                                  onChange={(e) =>
                                    setEditPracticeData({ ...editPracticeData, unit_name: e.target.value })
                                  }
                                  className={editInput}
                                  required
                                />
                              </div>
                              <div>
                                <label className={labelXs}>No. of Questions</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={editPracticeData.no_of_questions || ""}
                                  onChange={(e) =>
                                    setEditPracticeData({ ...editPracticeData, no_of_questions: e.target.value })
                                  }
                                  className={editInput}
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className={labelXs}>Description</label>
                              <input
                                type="text"
                                value={editPracticeData.description || ""}
                                onChange={(e) =>
                                  setEditPracticeData({ ...editPracticeData, description: e.target.value })
                                }
                                className={editInput}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className={labelXs}>Google Form Link</label>
                                <input
                                  type="url"
                                  value={editPracticeData.form_link || ""}
                                  onChange={(e) =>
                                    setEditPracticeData({ ...editPracticeData, form_link: e.target.value })
                                  }
                                  className={editInput}
                                  required
                                />
                              </div>
                              <div>
                                <label className={labelXs}>Solution PDF Link</label>
                                <input
                                  type="url"
                                  value={editPracticeData.solution_link || ""}
                                  onChange={(e) =>
                                    setEditPracticeData({ ...editPracticeData, solution_link: e.target.value })
                                  }
                                  className={editInput}
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-border">
                              <button
                                type="button"
                                onClick={cancelEditPractice}
                                className="px-3 py-1.5 bg-surface-hover hover:bg-surface text-text font-bold rounded-lg text-xs transition-all flex items-center gap-1"
                              >
                                <X size={12} />
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={saveEditPractice}
                                className="px-3 py-1.5 bg-accent hover:bg-dark text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-md shadow-accent/10"
                              >
                                <Save size={12} />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-accent/10 text-accent rounded-lg">
                                <ClipboardList size={18} />
                              </span>
                              <div>
                                <div className="font-semibold text-heading">{unit.unit_name}</div>
                                <div className="flex gap-2 items-center mt-0.5">
                                  {unit.description && (
                                    <span className="text-xs text-muted truncate max-w-xs">
                                      {unit.description}
                                    </span>
                                  )}
                                  <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-bold">
                                    {unit.no_of_questions} Q
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEditPractice(unit)}
                                className="p-1.5 text-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                                title="Edit practice unit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deletePracticeUnit(unit.id)}
                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete practice unit"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "demos" && (
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-hover border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Student
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {demoRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-heading">{req.name}</div>
                        <div className="text-xs text-muted">{req.city}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-text">
                          {req.standard} Standard
                        </div>
                        <div className="text-xs text-accent">
                          {req.board} Board | {req.group_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://wa.me/91${req.whatsapp}`}
                          target="_blank"
                          className="flex items-center gap-2 text-green-400 font-bold hover:underline"
                        >
                          <span>📱</span> {req.whatsapp}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {demoRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-muted"
                      >
                        No demo requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-hover border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Sender
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Message Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contactMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-heading">{msg.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-muted text-sm max-w-md break-words italic">
                          "{msg.message}"
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`https://wa.me/91${msg.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-green-400 font-bold hover:underline text-sm"
                          >
                            <span>📱</span> {msg.email}
                          </a>
                          <a
                            href={`tel:${msg.email}`}
                            className="text-xs text-muted hover:text-accent transition-colors"
                          >
                            📞 Call: {msg.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {contactMessages.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-muted"
                      >
                        No messages yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
