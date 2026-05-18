import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, LogOut, Layout, X, Save } from "lucide-react";

const AdminDashboard = () => {
  const { notes, isAdminLoggedIn, logout, addNote, updateNote, deleteNote } =
    useNotes();
  const navigate = useNavigate();

  const [newNote, setNewNote] = useState({
    standard: "11th",
    chapter: "",
    file: "",
  });
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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newNote.chapter) return;
    addNote({
      ...newNote,
      file: `/notes/${newNote.standard}_${newNote.chapter.toLowerCase().replace(/ /g, "")}.pdf`,
    });
    setNewNote({
      standard: "11th",
      chapter: "",
      file: "",
    });
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditFormData(note);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const saveEdit = () => {
    updateNote(editingId, editFormData);
    setEditingId(null);
  };

  const stats = {
    total: notes.length,
    std11: notes.filter((n) => n.standard === "11th").length,
    std12: notes.filter((n) => n.standard === "12th").length,
  };

  if (!isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 text-primary font-bold text-xl mb-12">
          <span>⚗️</span>
          <span>Notes Manager</span>
        </div>

        <nav className="flex-grow space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary rounded-xl text-white font-semibold transition-all">
            <Layout size={20} />
            Dashboard
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
            <h1 className="text-3xl font-bold text-dark">
              Welcome back, Dhruval Sir
            </h1>
            <p className="text-gray-500">
              Manage your study materials and student resources
            </p>
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
                11th / 12th
              </div>
              <div className="text-2xl font-bold text-dark">
                {stats.std11} / {stats.std12}
              </div>
            </div>
          </div>
        </header>

        {/* Add Note Form */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
            <Plus className="text-primary" />
            Add New Note
          </h2>
          <form
            onSubmit={handleAddSubmit}
            className="grid md:grid-cols-3 gap-4"
          >
            <div className="md:col-span-1">
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
            <div className="md:col-span-1">
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
            <div className="md:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Note
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
      </main>
    </div>
  );
};

export default AdminDashboard;
