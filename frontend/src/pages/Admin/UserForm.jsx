import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchUserById, updateUser } from '../../services/userService';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const UserForm = ({ id: modalId, isModal = false, onClose, onSaved }) => {
  const params = useParams();
  const navigate = isModal ? null : useNavigate();
  const { updateCurrentUser, currentUser } = useAuth();
  
  const id = isModal ? modalId : params.id;
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
  })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { password, ...submissionData } = user;
      const response = await updateUser(id, submissionData);

      if (currentUser && currentUser._id === id) {
        updateCurrentUser(response.data);
      }
      
      if (isModal) {
        onSaved();
        onClose();
      } else {
        navigate('/admin/users');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
      console.error(err);
    } finally {
      setLoading(false);
  } };
  
  const formContent = (
    <form onSubmit={handleSubmit} className="admin-form-container">
      <div className="admin-form__grid">
        <div className="admin-form__group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={user.username} onChange={handleChange} required />
        </div>

        <div className="admin-form__group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={user.email} onChange={handleChange} required />
        </div>

        <div className="admin-form__group span-2">
          <label htmlFor="profilePic">Profile Picture URL</label>
          <input
            type="url"
            id="profilePic"
            name="profilePic"
            value={user.profilePic || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
          />
        </div>

        <div className="admin-form__group span-2">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={user.bio || ''} onChange={handleChange} rows="4"></textarea>
        </div>

        <div className="admin-form__group span-2 admin-form__checkbox-group">
          <input type="checkbox" id="isAdmin" name="isAdmin" checked={user.isAdmin} onChange={handleChange} />
          <label htmlFor="isAdmin">Administrator Privileges</label>
        </div>
      </div>

      <button type="submit" className="admin-button-save" disabled={loading}>
        {loading ? 'Saving...' : 'Save User'}
      </button>
    </form>
  );

  if (loading && !isModal) return <LoadingSpinner />;

  if (isModal) {
    return formContent;
  }

  return (
    <div className="admin-page">
      <h1>{isEditing ? `Edit User: ${user.username}` : 'Create New User'}</h1>
      <ErrorMessage message={error} />
      {formContent}
    </div>
); };

export default UserForm;