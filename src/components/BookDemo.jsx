import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const BookDemo = () => {
  const { submitDemoRequest } = useNotes();
  const [formData, setFormData] = useState({
    name: "",
    board: "",
    otherBoard: "",
    gender: "",
    medium: "",
    standard: "",
    prepType: "",
    whatsapp: "",
    city: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.board) newErrors.board = "Board is required";
    if (formData.board === "Other" && !formData.otherBoard)
      newErrors.board = "Please specify board";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.medium) newErrors.medium = "Medium is required";
    if (!formData.standard) newErrors.standard = "Standard is required";
    if (!formData.prepType) newErrors.prepType = "Preparation type is required";
    if (!formData.whatsapp) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "Invalid 10-digit number";
    }
    if (!formData.city) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const displayBoard =
        formData.board === "Other" ? formData.otherBoard : formData.board;

      const result = await submitDemoRequest({
        name: formData.name,
        board: displayBoard,
        gender: formData.gender,
        medium: formData.medium,
        standard: formData.standard,
        group_name: formData.prepType,
        whatsapp: formData.whatsapp,
        city: formData.city,
        message: formData.message,
      });

      if (result.success) {
        setIsSubmitted(true);
        window.scrollTo({
          top: document.getElementById("demo").offsetTop - 80,
          behavior: "smooth",
        });
      } else {
        alert("Failed to submit: " + result.error);
      }
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <section id="demo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-light-accent p-10 rounded-3xl border-2 border-accent text-center shadow-2xl"
          >
            <CheckCircle className="w-20 h-20 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-dark mb-4">
              🎉 Thank You, {formData.name}!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Your demo request has been received. Dhruval Sir will contact you
              on WhatsApp within 24 hours. Get ready to master Chemistry! ⚗️
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" className="py-20 bg-light-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Book a Free Demo Class
            </h2>
            <p className="text-gray-600">
              Fill out the form below and start your journey towards excellence
              in Chemistry.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Name */}
              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Board */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Board *
                </label>
                <div className="space-y-3">
                  <select
                    name="board"
                    value={formData.board}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.board ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all appearance-none bg-white`}
                  >
                    <option value="">Select Board</option>
                    <option value="GSEB">GSEB</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="ISC">ISC</option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.board === "Other" && (
                    <motion.input
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      name="otherBoard"
                      placeholder="Specify your board"
                      value={formData.otherBoard || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all text-sm"
                      required
                    />
                  )}
                </div>
                {errors.board && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.board}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="flex gap-6 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Female</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Medium */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Medium *
                </label>
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.medium ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all appearance-none bg-white`}
                >
                  <option value="">Select Medium</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="English">English</option>
                </select>
                {errors.medium && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.medium}
                  </p>
                )}
              </div>

              {/* Standard */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Standard *
                </label>
                <select
                  name="standard"
                  value={formData.standard}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.standard ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all appearance-none bg-white`}
                >
                  <option value="">Select Standard</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
                {errors.standard && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.standard}
                  </p>
                )}
              </div>

              {/* Prep Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Preparation Type *
                </label>
                <select
                  name="prepType"
                  value={formData.prepType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.prepType ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all appearance-none bg-white`}
                >
                  <option value="">Select Preparation Type</option>
                  <option value="Board Only">Board Only</option>
                  <option value="Board + NEET">Board + NEET</option>
                  <option value="Board + JEE">Board + JEE</option>
                </select>
                {errors.prepType && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.prepType}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  WhatsApp No *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.whatsapp ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all`}
                  placeholder="10-digit number"
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.city ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-primary outline-none transition-all`}
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="col-span-full">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Any specific topics you want to learn?"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary hover:bg-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <Send size={20} />
              )}
              {isSubmitting ? "Submitting..." : "Submit Demo Request"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookDemo;
