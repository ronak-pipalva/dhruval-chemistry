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
  const [newNote, setNewNote] = useState({
    standard: "11th",
    chapter: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file, standard, chapter) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${standard}_${chapter.toLowerCase().replace(/ /g, "_")}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("notes").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.chapter || !selectedFile) {
      alert("Please provide chapter name and select a PDF file.");
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadFile(
        selectedFile,
        newNote.standard,
        newNote.chapter,
      );

      const result = await addNote({
        standard: newNote.standard,
        chapter: newNote.chapter,
        file_url: publicUrl,
      });

      if (result.success) {
        setNewNote({
          standard: "11th",
          chapter: "",
        });
        setSelectedFile(null);
        // Reset file input
        e.target.reset();
      } else {
        alert("Failed to add note: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Error uploading file: " + error.message);
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
    const result = await updateNote(editingId, editFormData);
    if (result.success) {
      setEditingId(null);
    } else {
      alert("Failed to update: " + result.error);
    }
  };

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
            {stats.demos > 0 && (
              <span className="ml-auto bg-accent text-white text-[10px] px-2 py-1 rounded-full">
                {stats.demos}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === "messages" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <Mail size={20} />
            Contact Messages
            {stats.messages > 0 && (
              <span className="ml-auto bg-accent text-white text-[10px] px-2 py-1 rounded-full">
                {stats.messages}
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
                {stats.demos + stats.messages}
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
                className="grid md:grid-cols-4 gap-4"
              >
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
                    Chapter Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chemical Bonding"
                    value={newNote.chapter}
                    onChange={(e) =>
                      setNewNote({ ...newNote, chapter: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    PDF File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-primary transition-all"
                    >
                      <span className="text-gray-500 text-sm truncate">
                        {selectedFile ? selectedFile.name : "Choose PDF..."}
                      </span>
                      <Upload size={18} className="text-primary" />
                    </label>
                  </div>
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
                    {uploading ? "Uploading..." : "Add Note"}
                  </button>
                </div>
              </form>
            </div>

            {/* Notes Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                        Standard
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                        Chapter
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence>
                      {notes.map((note) => (
                        <motion.tr
                          key={note.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {editingId === note.id ? (
                              <select
                                value={editFormData.standard}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    standard: e.target.value,
                                  })
                                }
                                className="px-2 py-1 rounded border outline-none"
                              >
                                <option value="11th">11th</option>
                                <option value="12th">12th</option>
                              </select>
                            ) : (
                              <span className="font-semibold text-dark">
                                {note.standard}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingId === note.id ? (
                              <input
                                type="text"
                                value={editFormData.chapter}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    chapter: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 rounded border outline-none focus:border-primary"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">
                                {note.chapter}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {editingId === note.id ? (
                                <>
                                  <button
                                    onClick={saveEdit}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <Save size={18} />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(note)}
                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteNote(note.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Users size={20} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-dark mb-1">{msg.name}</h3>
                <div className="text-xs text-gray-500 mb-4">{msg.email}</div>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                  "{msg.message}"
                </p>
                <a
                  href={`mailto:${msg.email}`}
                  className="mt-6 w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            ))}
            {contactMessages.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400">
                No messages yet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
