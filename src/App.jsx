import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";
import ScrollProgressBar from "./components/ScrollProgressBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Notes from "./components/Notes";
import WhyChooseMe from "./components/WhyChooseMe";
import BookDemo from "./components/BookDemo";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import HealthCheck from "./components/HealthCheck";

function Portfolio() {
  return (
    <div className="relative">
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Notes />
        <WhyChooseMe />
        <BookDemo />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/health" element={<HealthCheck />} />
        </Routes>
      </BrowserRouter>
    </NotesProvider>
  );
}
