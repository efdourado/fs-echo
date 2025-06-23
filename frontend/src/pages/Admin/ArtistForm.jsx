import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArtistById } from '../../api/api';
import { createArtist, updateArtist } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ArtistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // ... (outros estados)
  const [artist, setArtist] = useState({
    name: '',
    description: '',
    image: '',
    banner: '',
    genre: '',
    verified: false,
    socials: { instagram: '', x: '', youtube: '', tiktok: '' }
  });
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);


  // ... (useEffect e outros handlers)
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchArtistById(id)
        .then(data => {
          setArtist({ ...data, genre: data.genre.join(', '), socials: data.socials || { instagram: '', x: '', youtube: '', tiktok: '' } });
          if (data.image) setImagePreview(`http://localhost:3000${data.image}`);
          if (data.banner) setBannerPreview(`http://localhost:3000${data.banner}`);
        })
        .catch(err => setError('Failed to fetch artist details.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('socials.')) {
      const socialPlatform = name.split('.')[1];
      setArtist(prev => ({ ...prev, socials: { ...prev.socials, [socialPlatform]: value }}));
    } else {
      setArtist(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (name === 'image') {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (name === 'banner') {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };


  // dentro do componente ArtistForm

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    
    // Anexa os campos de texto um por um
    formData.append('name', artist.name);
    formData.append('description', artist.description);
    formData.append('genre', artist.genre); // Já é uma string separada por vírgulas
    formData.append('verified', artist.verified);
    
    // Anexa o objeto socials como uma string JSON
    formData.append('socials', JSON.stringify(artist.socials));
    
    // Anexa os arquivos se eles foram selecionados
    if (imageFile) formData.append('image', imageFile);
    if (bannerFile) formData.append('banner', bannerFile);

    try {
      if (isEditing) {
        await updateArtist(id, formData);
      } else {
        await createArtist(formData);
      }
      navigate('/admin/artists');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save artist.');
    } finally {
      setLoading(false);
    }
  };


  // ... (código JSX do return)
  return (
    <div className="admin-page">
      <h1>{isEditing ? 'Edit Artist' : 'Create New Artist'}</h1>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="admin-form">
            <div className="form-grid">
                <div className="form-group span-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={artist.name} onChange={handleTextChange} required />
                </div>
                {/* ... outros campos de texto (description, genre, socials, etc.) ... */}
                <div className="form-group span-2">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={artist.description} onChange={handleTextChange} rows="4"></textarea>
                </div>
                <div className="form-group">
                    <label>Artist Image</label>
                    <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="form-preview-image" />}
                </div>
                <div className="form-group">
                    <label>Banner Image</label>
                    <input type="file" name="banner" onChange={handleFileChange} accept="image/*" />
                    {bannerPreview && <img src={bannerPreview} alt="Preview" className="form-preview-image" />}
                </div>
                 <div className="form-group span-2">
                    <label htmlFor="genre">Genres (comma-separated)</label>
                    <input type="text" id="genre" name="genre" value={artist.genre} onChange={handleTextChange} placeholder="Hip-Hop, Pop, R&B" />
                </div>
                 <div className="form-group span-2 form-group-checkbox">
                    <input type="checkbox" id="verified" name="verified" checked={artist.verified} onChange={handleTextChange} />
                    <label htmlFor="verified">Verified Artist</label>
                </div>
                 <h2 className="span-2">Social Links</h2>
                 <div className="form-group">
                    <label htmlFor="socials.instagram">Instagram</label>
                    <input type="text" id="socials.instagram" name="socials.instagram" value={artist.socials.instagram} onChange={handleTextChange} placeholder="https://instagram.com/..." />
                </div>
                 <div className="form-group">
                    <label htmlFor="socials.x">X (Twitter)</label>
                    <input type="text" id="socials.x" name="socials.x" value={artist.socials.x} onChange={handleTextChange} placeholder="https://x.com/..." />
                </div>
                 <div className="form-group">
                    <label htmlFor="socials.youtube">YouTube</label>
                    <input type="text" id="socials.youtube" name="socials.youtube" value={artist.socials.youtube} onChange={handleTextChange} placeholder="https://youtube.com/..." />
                </div>
                 <div className="form-group">
                    <label htmlFor="socials.tiktok">TikTok</label>
                    <input type="text" id="socials.tiktok" name="socials.tiktok" value={artist.socials.tiktok} onChange={handleTextChange} placeholder="https://tiktok.com/..." />
                </div>
            </div>

            <button type="submit" className="admin-button-save" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Artist' : 'Create Artist')}
            </button>
        </div>
      </form>
    </div>
  );
};


export default ArtistForm;