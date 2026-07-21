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
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const AdminDashboard = () => {
  const {
    notes,
    demoRequests,
    contactMessages,
    isAdminLoggedIn,
    logout,
    addNote,
    updateNote,
    deleteNote,
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
  };

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 text-primary font-bold text-xl mb-12">
          <span>⚗️</span>
          <span>Admin Panel</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button
            onClick={() => setActiveTab("notes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "notes" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <FileText size={20} />
            Notes Manager
          </button>
          <button
            onClick={() => setActiveTab("demos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "demos" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "messages" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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
          className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-dark text-capitalize">
              {activeTab === "notes"
                ? "Notes Management"
                : activeTab === "demos"
                  ? "Demo Requests"
                  : "Student Inquiries"}
            </h1>
            <p className="text-gray-500">Welcome back, Dhruval Sir</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Total Notes
              </div>
              <div className="text-2xl font-bold text-primary">
                {stats.total}
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                New Requests
              </div>
              <div className="text-2xl font-bold text-dark">
                {unreadDemosCount + unreadMessagesCount}
              </div>
            </div>
          </div>
        </header>

        {activeTab === "notes" && (
          <>
            {/* Add Note Form */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
              <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <Plus className="text-primary" />
                Add New Note
              </h2>
              <form
                onSubmit={handleAddSubmit}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Standard
                    </label>
                    <select
                      value={newNote.standard}
                      onChange={(e) =>
                        setNewNote({ ...newNote, standard: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
                    >
                      <option value="11th">11th Standard</option>
                      <option value="12th">12th Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Medium
                    </label>
                    <select
                      value={newNote.medium}
                      onChange={(e) =>
                        setNewNote({ ...newNote, medium: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
                    >
                      <option value="EM">English Medium (EM)</option>
                      <option value="GM">Gujarati Medium (GM)</option>
                      <option value="Both">Both (EM & GM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
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
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
                        required
                        autoComplete="off"
                      />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Display File Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Theory Notes"
                      value={newNote.fileName}
                      onChange={(e) =>
                        setNewNote({ ...newNote, fileName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Google Drive Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={newNote.fileUrl}
                      onChange={(e) =>
                        setNewNote({ ...newNote, fileUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-3 bg-primary hover:bg-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-dark">Notes Folder Structure</h3>
              </div>
              <div className="divide-y divide-gray-100">
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
                      <div className="p-10 text-center text-gray-400">
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
                          className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-lg">
                              {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mr-2">
                                {std}
                              </span>
                              <span className="font-semibold text-dark">{chapter}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-bold">
                              {notesInGroup.length} {notesInGroup.length === 1 ? "file" : "files"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="bg-gray-50/30 px-6 py-2 border-t border-gray-50">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  <th className="py-2">File Name</th>
                                  <th className="py-2 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {notesInGroup.map((note) => {
                                  const isEditing = editingId === note.id;
                                  return (
                                    <tr key={note.id} className="hover:bg-gray-50/50">
                                      {isEditing ? (
                                        <td className="py-3 px-2 text-sm text-gray-600 font-medium" colSpan="2">
                                          <div className="flex flex-col gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
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
                                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
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
                                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
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
                                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
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
                                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                                                >
                                                  <option value="11th">11th Standard</option>
                                                  <option value="12th">12th Standard</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
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
                                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                                                >
                                                  <option value="EM">English Medium (EM)</option>
                                                  <option value="GM">Gujarati Medium (GM)</option>
                                                  <option value="Both">Both (EM & GM)</option>
                                                </select>
                                              </div>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                              <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg text-xs transition-all flex items-center gap-1"
                                              >
                                                <X size={12} />
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                onClick={saveEdit}
                                                className="px-3 py-1.5 bg-primary hover:bg-dark text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-md shadow-primary/10"
                                              >
                                                <Save size={12} />
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        </td>
                                      ) : (
                                        <>
                                          <td className="py-3 text-sm text-gray-600 font-medium">
                                            <div className="flex items-center gap-2">
                                              <FileText size={14} className="text-gray-400" />
                                              <div className="flex flex-col">
                                                <a
                                                  href={note.file_url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="hover:text-primary hover:underline truncate max-w-md"
                                                >
                                                  {note.file_name || getCleanFilename(note.file_url)}
                                                </a>
                                                <div className="flex gap-2 items-center mt-0.5">
                                                  <span className="text-[10px] text-gray-400">
                                                    URL: {getCleanFilename(note.file_url)}
                                                  </span>
                                                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold uppercase">
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
                                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                title="Edit note details"
                                              >
                                                <Edit2 size={16} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => deleteNote(note.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {activeTab === "demos" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {demoRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-dark">{req.name}</div>
                        <div className="text-xs text-gray-400">{req.city}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold">
                          {req.standard} Standard
                        </div>
                        <div className="text-xs text-primary">
                          {req.board} Board | {req.group_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://wa.me/91${req.whatsapp}`}
                          target="_blank"
                          className="flex items-center gap-2 text-green-600 font-bold hover:underline"
                        >
                          <span>📱</span> {req.whatsapp}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {demoRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-gray-400"
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Sender
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Message Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contactMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-dark">{msg.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm max-w-md break-words italic">
                          "{msg.message}"
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`https://wa.me/91${msg.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-green-600 font-bold hover:underline text-sm"
                          >
                            <span>📱</span> {msg.email}
                          </a>
                          <a
                            href={`tel:${msg.email}`}
                            className="text-xs text-gray-400 hover:text-primary transition-colors"
                          >
                            📞 Call: {msg.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {contactMessages.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-gray-400"
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
