// Em frontend/src/pages/Admin/UserForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [user, setUser] = useState({
    username: '',
    email: '',
    bio: '',
    isAdmin: false,
    profilePic: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchUserById(id)
        .then(response => {
          setUser(response.data);
        })
        .catch(err => {
          setError('Failed to fetch user details.');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateUser(id, user);
      navigate('/admin'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <h1>{isEditing ? `Edit User: ${user.username}` : 'Create New User'}</h1>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={user.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={user.email} onChange={handleChange} required />
          </div>

          <div className="form-group span-2">
            <label htmlFor="profilePic">Profile Picture URL</label>
            <input
              type="url"
              id="profilePic"
              name="profilePic"
              value={user.profilePic || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
            />
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile Preview"
                className="form-preview-image"
                style={{ marginTop: '15px', maxHeight: '150px', borderRadius: '8px' }}
              />
            )}
          </div>

          <div className="form-group span-2">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" value={user.bio || ''} onChange={handleChange} rows="4"></textarea>
          </div>

          <div className="form-group span-2 form-group-checkbox">
            <input type="checkbox" id="isAdmin" name="isAdmin" checked={user.isAdmin} onChange={handleChange} />
            <label htmlFor="isAdmin">Administrator Privileges</label>
          </div>
        </div>

        <button type="submit" className="admin-button-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;