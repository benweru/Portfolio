import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/contact", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center">Contact Me</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-6">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} className="border p-2 w-full mb-2" required />
        <textarea name="message" placeholder="Message" onChange={handleChange} className="border p-2 w-full mb-2" required></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Send</button>
      </form>
    </div>
  );
};

export default Contact;
