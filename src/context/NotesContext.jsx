import { createContext, useContext, useState, useEffect } from "react";
import { notesData, ADMIN_CREDENTIALS } from "../data/teacherData";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("dhruval_notes");
    return savedNotes ? JSON.parse(savedNotes) : notesData;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("isAdminLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("dhruval_notes", JSON.stringify(notes));
  }, [notes]);

  const login = (email, password) => {
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("isAdminLoggedIn", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("isAdminLoggedIn");
  };

  const addNote = (note) => {
    const newNote = { ...note, id: Date.now() };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const updateNote = (id, updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note,
      ),
    );
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        isAdminLoggedIn,
        login,
        logout,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
