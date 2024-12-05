import React, { useState } from 'react';
import axios from 'axios';
import '../../css/ContactForm.css';

const ContactForm = ({ endpoint, onSuccess }) => {
  const [formData, setFormData] = useState({
    nameOrCompany: '',
    email: '',
    message: '',
  });
  const [advertisementEmail, setAdvertisementEmail] = useState('advertisements@lolture.com'); 
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nameOrCompany || !formData.email || !formData.message ) {
      setError('Please fill in all fields');
      return;
    }

    const backendBaseUrl = import.meta.env.VITE_APP_API_URL;

    try {
      await axios.post(`${backendBaseUrl.replace(/\/$/, '')}${endpoint}`, formData);
      setFormData({ nameOrCompany: '', email: '', message: '' });
      setError(null); 
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        Name and Surname or Company Name:
        <input
          type="text"
          name="nameOrCompany"
          value={formData.nameOrCompany}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Message:
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;