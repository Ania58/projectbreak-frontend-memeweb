import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddContentNavigation from './AddContentNavigation';
import '../css/AddContentForm.css';

const AddMeme = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    templateId: '',
    topText: '',
    bottomText: '',
    tags: '',
    rulesAccepted: false,
    copyrightsAccepted: false,
  });
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('https://api.imgflip.com/get_memes');
        setTemplates(response.data.data.memes || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId); 
  if (template) {
    setFormData({ ...formData, templateId: template.id }); 
    setSelectedTemplate(template);
  } else {
    console.error('Template not found for the given templateId:', templateId);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      templateId: formData.templateId, 
      tags: Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags,
      rulesAccepted: formData.rulesAccepted ? 'true' : 'false',
      copyrightsAccepted: formData.copyrightsAccepted ? 'true' : 'false',
    };

    try {
      const response = await axios.post('http://localhost:3000/add/memes', payload);
      alert('Meme added successfully!');
    } catch (error) {
      console.error('Error adding meme:', error);
      alert('Failed to add meme.');
    }
  };

  return (
    <div>
        <AddContentNavigation /> 
        <form onSubmit={handleSubmit} className="add-content-form">
        <h2>Add Meme</h2>
        <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
        />
        <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="animals">Animals</option>
            <option value="humor">Humor</option>
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
            <option value="motorization">Motorization'</option>
        </select>
        <div className="template-selection">
            <label>Choose Template:</label>
            <select
            value={formData.templateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            required
            >
            <option value="">Select a Template</option>
            {templates.map((template) => (
                <option key={template.id} value={template.id}>
                {template.name}
                </option>
            ))}
            </select>
        </div>
        {selectedTemplate && (
          <div className="template-preview">
            <h3>Preview:</h3>
            <div className="meme-preview">
              <img
                src={selectedTemplate.url}
                alt="Selected template"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <div className="meme-text top-text">{formData.topText}</div>
              <div className="meme-text bottom-text">{formData.bottomText}</div>
            </div>
          </div>
        )}
        <input
            type="text"
            name="topText"
            placeholder="Top Text"
            value={formData.topText}
            onChange={handleChange}
            required
        />
        <input
            type="text"
            name="bottomText"
            placeholder="Bottom Text"
            value={formData.bottomText}
            onChange={handleChange}
            required
        />
        <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
        />
        <label>
            <input
            type="checkbox"
            name="rulesAccepted"
            checked={formData.rulesAccepted}
            onChange={handleChange}
            required
            />
            I accept the rules
        </label>
        <label>
            <input
            type="checkbox"
            name="copyrightsAccepted"
            checked={formData.copyrightsAccepted}
            onChange={handleChange}
            required
            />
            I accept copyrights
        </label>
        <button type="submit">Submit</button>
        </form>
    </div>
  );
};

export default AddMeme;
