import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ADMIN_CREDENTIALS } from "../data/teacherData";
import { supabase } from "../lib/supabaseClient";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [practiceUnits, setPracticeUnits] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("isAdminLoggedIn") === "true";
  });

  const fetchNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  }, []);

  const fetchPracticeUnits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("practice_units")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPracticeUnits(data || []);
    } catch (error) {
      console.error("Error fetching practice units:", error.message);
    }
  }, []);

  const fetchDemoRequests = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    try {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDemoRequests(data || []);
    } catch (error) {
      console.error("Error fetching demo requests:", error.message);
    }
  }, [isAdminLoggedIn]);

  const fetchContactMessages = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContactMessages(data || []);
    } catch (error) {
      console.error("Error fetching contact messages:", error.message);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      await Promise.all([fetchNotes(), fetchPracticeUnits()]);
      if (isAdminLoggedIn) {
        await Promise.all([fetchDemoRequests(), fetchContactMessages()]);
      }
      setLoading(false);
    };
    initFetch();
  }, [fetchNotes, fetchPracticeUnits, fetchDemoRequests, fetchContactMessages, isAdminLoggedIn]);

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

  const addNote = async (note) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([note])
        .select();

      if (error) throw error;
      setNotes((prev) => [data[0], ...prev]);
      return { success: true };
    } catch (error) {
      console.error("Error adding note:", error.message);
      return { success: false, error: error.message };
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update(updatedNote)
        .eq("id", id);

      if (error) throw error;
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...updatedNote } : note,
        ),
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating note:", error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (error) throw error;
        setNotes((prev) => prev.filter((note) => note.id !== id));
        return { success: true };
      } catch (error) {
        console.error("Error deleting note:", error.message);
        return { success: false, error: error.message };
      }
    }
  };

  const addPracticeUnit = async (unit) => {
    try {
      const { data, error } = await supabase
        .from("practice_units")
        .insert([unit])
        .select();

      if (error) throw error;
      setPracticeUnits((prev) => [data[0], ...prev]);
      return { success: true };
    } catch (error) {
      console.error("Error adding practice unit:", error.message);
      return { success: false, error: error.message };
    }
  };

  const updatePracticeUnit = async (id, updatedUnit) => {
    try {
      const { error } = await supabase
        .from("practice_units")
        .update(updatedUnit)
        .eq("id", id);

      if (error) throw error;
      setPracticeUnits((prev) =>
        prev.map((unit) =>
          unit.id === id ? { ...unit, ...updatedUnit } : unit,
        ),
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating practice unit:", error.message);
      return { success: false, error: error.message };
    }
  };

  const deletePracticeUnit = async (id) => {
    if (window.confirm("Are you sure you want to delete this practice unit?")) {
      try {
        const { error } = await supabase.from("practice_units").delete().eq("id", id);
        if (error) throw error;
        setPracticeUnits((prev) => prev.filter((unit) => unit.id !== id));
        return { success: true };
      } catch (error) {
        console.error("Error deleting practice unit:", error.message);
        return { success: false, error: error.message };
      }
    }
  };

  const submitDemoRequest = async (request) => {
    try {
      const { error } = await supabase.from("demo_requests").insert([request]);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error submitting demo request:", error.message);
      return { success: false, error: error.message };
    }
  };

  const submitContactMessage = async (message) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([message]);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error submitting contact message:", error.message);
      return { success: false, error: error.message };
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        practiceUnits,
        demoRequests,
        contactMessages,
        loading,
        isAdminLoggedIn,
        login,
        logout,
        addNote,
        updateNote,
        deleteNote,
        addPracticeUnit,
        updatePracticeUnit,
        deletePracticeUnit,
        submitDemoRequest,
        submitContactMessage,
        refreshData: () => {
          fetchNotes();
          fetchPracticeUnits();
          if (isAdminLoggedIn) {
            fetchDemoRequests();
            fetchContactMessages();
          }
        },
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
