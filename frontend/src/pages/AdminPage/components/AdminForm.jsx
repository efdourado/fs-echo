import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../../../components/ui/ErrorMessage';
import Form from '../../../components/ui/Form'; 
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const AdminForm = ({ id, config, onSaved, onCancel }) => {
  const [formData, setFormData] = useState(config.initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [relatedData, setRelatedData] = useState({});

  const isEditing = Boolean(id);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const promises = [];

        if (isEditing) {
          promises.push(config.api.fetchById(id));
        }
        if (config.relations) {
          Object.values(config.relations).forEach(relation => {
            promises.push(relation.fetch());
          });
        }

        const responses = await Promise.all(promises);
        
        if (isEditing) {
          const { data: itemData } = responses.shift();
          const processedData = config.processDataForForm(itemData);
          setFormData(processedData);
        }
        if (config.relations) {
          const newRelatedData = {};
          Object.keys(config.relations).forEach((key, index) => {
            newRelatedData[key] = responses[index].data;
          });
          setRelatedData(newRelatedData);
        }
      } catch (err) {
        setError('Failed to load form data.');
      } finally {
        setLoading(false);
    } };
    
    loadData();
  }, [id, isEditing, config]);


  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;
    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const submissionData = config.processDataForSubmit(formData);

    try {
      if (isEditing) {
        await config.api.update(id, submissionData);
      } else {
        await config.api.create(submissionData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item.');
    } finally {
      setSaving(false);
  } };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <div className="form-grid">
        {config.fields.map(field => {
          const { name, label, type, component = 'input', optionsKey, ...rest } = field;
          
          if (component === 'input') {
            return (
              <div key={name} className={`form-group ${field.span || ''}`}>
                <label htmlFor={name}>{label}</label>
                <input id={name} name={name} type={type} value={formData[name] || ''} onChange={handleChange} {...rest} />
              </div>
            );
          }
          if (component === 'textarea') {
            return (
              <div key={name} className={`form-group ${field.span || ''}`}>
                <label htmlFor={name}>{label}</label>
                <textarea id={name} name={name} value={formData[name] || ''} onChange={handleChange} {...rest} />
              </div>
            );
          }
          if (component === 'select') {
            const options = optionsKey ? relatedData[optionsKey] || [] : [];
            return (
              <div key={name} className={`form-group ${field.span || ''}`}>
                <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={formData[name] || ''} onChange={handleChange} {...rest}>
                  <option value="" disabled>Select {label}</option>
                  {options.map(option => (
                    <option key={option._id} value={option._id}>{option.name || option.title}</option>
                  ))}

                </select>
              </div>
            );
          }
           if (component === 'checkbox') {
            return (
              <div key={name} className={`form-group form-checkbox-group ${field.span || ''}`}>
                <input id={name} name={name} type="checkbox" checked={formData[name] || false} onChange={handleChange} />
                <label htmlFor={name}>{label}</label>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cta-button cancel" disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="cta-button secondary-cta" disabled={saving}>
          {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
        </button>
      </div>
    </Form>
); };

AdminForm.propTypes = {
  id: PropTypes.string,
  config: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AdminForm;