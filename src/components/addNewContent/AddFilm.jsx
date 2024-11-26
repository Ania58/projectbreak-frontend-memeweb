import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddContentNavigation from './AddContentNavigation';
import '../../css/AddContentForm.css';

const AddFilm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    filmCategory: '',
    description: '',
    tags: '',
    rulesAccepted: false,
    copyrightsAccepted: false,
  });


  const [file, setFile] = useState(null);

  const clearForm = () => {
    setFormData({
        title: '',
        category: '',
        filmCategory: '',
        description: '',
        tags: '',
        rulesAccepted: false,
        copyrightsAccepted: false,
      });
      setFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
  
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'rulesAccepted' || key === 'copyrightsAccepted') {
          formPayload.append(`agreements.${key}`, value); 
      } else {
          formPayload.append(key, value);
      }
  });

    if (file) {
      formPayload.append('file', file);
    }
    
    try {
      const response = await axios.post('http://localhost:3000/add/films', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Film added successfully!');
    } catch (error) {
      console.error('Error adding film:', error);
      alert('Failed to add film.');
    }
  };

  return (
    <div>
      <AddContentNavigation /> 
      <form onSubmit={handleSubmit} className="add-content-form">
        <h2>Add Film</h2>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="animals">Animals</option>
          <option value="humor">Humor</option>
          <option value="videos">Videos</option>
          <option value="memes">Memes</option>
          <option value="comics">Comics</option>
          <option value="curiosities">Curiosities</option>
          <option value="food">Food</option>
          <option value="politics">Politics</option>
          <option value="culture">Culture</option>
          <option value="sport">Sport</option>
          <option value="popculture">Popculture</option>
          <option value="history">History</option>
          <option value="war">War</option>
          <option value="WTF">WTF</option>
          <option value="cats">Cats</option>
          <option value="emotions">Emotions</option>
          <option value="art">Art</option>
          <option value="nature">Nature</option>
          <option value="music and film">Music and film</option>
          <option value="news">News</option>
          <option value="dogs">Dogs</option>
          <option value="motorization">Motorization</option>
        </select>
        <select name="filmCategory" value={formData.filmCategory} onChange={handleChange} required>
          <option value="">Select Film Category</option>
          <option value="humor">Humor</option>
          <option value="wow">Wow</option>
          <option value="curiosities">Curiosities</option>
          <option value="popculture">Popculture</option>
          <option value="youtubers">Youtubers</option>
          <option value="fail">Fail</option>
          <option value="games">Games</option>
          <option value="WTF">WTF</option>
          <option value="wholesome">Wholesome</option>
        </select>
        <input type="file" name="file" onChange={handleFileChange} accept="video/*" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
        <div className="agreement-section">
          <label>
            <input type="checkbox" name="rulesAccepted" checked={formData.rulesAccepted} onChange={handleChange} required />
            I accept the rules
          </label>
          <label>
            <input type="checkbox" name="copyrightsAccepted" checked={formData.copyrightsAccepted} onChange={handleChange} required />
            I accept copyrights
          </label>
        </div>
        <button type="submit">Submit</button>
        <button className="clear-btn" type="button" onClick={clearForm}>Clear</button>
      </form>
    </div>
  );
};

export default AddFilm;