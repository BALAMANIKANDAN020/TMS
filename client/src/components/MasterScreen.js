import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import './MasterScreen.css';

const MasterScreen = ({ title, endpoint, fields, schema }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    const fetchData = async () => {
        try {
            const { data } = await api.get(endpoint);
            setData(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
            setSkeletonLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditId(item._id);
            const initialForm = {};
            fields.forEach(f => {
                initialForm[f.name] = f.type === 'password' ? '' : (item[f.name]?._id || item[f.name]);
            });
            setFormData(initialForm);
        } else {
            setEditId(null);
            const emptyForm = {};
            fields.forEach(f => emptyForm[f.name] = '');
            setFormData(emptyForm);
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`${endpoint}/${editId}`, formData);
            } else {
                await api.post(endpoint, formData);
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`${endpoint}/${id}`);
                fetchData();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val?.name || val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="master-screen">
            <div className="toolbar">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn ripple-button" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>Add New</span>
                </button>
            </div>

            {skeletonLoading ? (
                <div className="table-container page-enter">
                    <div className="table-skeleton-container" style={{ padding: '24px' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div className="skeleton skeleton-text" key={i} style={{ marginBottom: '24px', height: '48px' }}></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="table-container page-enter">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {fields.filter(f => !f.hideInTable).map(f => <th key={f.name}>{f.label}</th>)}
                                <th className="actions-col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item._id}>
                                    {fields.filter(f => !f.hideInTable).map(f => (
                                        <td key={f.name}>
                                            {f.render ? f.render(item[f.name]) : (item[f.name]?.name || item[f.name])}
                                        </td>
                                    ))}
                                    <td className="actions-cell">
                                        <button className="icon-btn edit" onClick={() => handleOpenModal(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(item._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>{editId ? 'Edit' : 'New'} {title}</h3>
                        <form onSubmit={handleSubmit}>
                            {fields.map(f => (
                                <div className="form-group" key={f.name}>
                                    <label>{f.label}</label>
                                    {f.type === 'select' ? (
                                        <select
                                            value={formData[f.name]}
                                            onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                                            required
                                        >
                                            <option value="">Select {f.label}</option>
                                            {f.options?.map(opt => (
                                                <option key={opt._id} value={opt._id}>{opt.name}</option>
                                            ))}
                                        </select>
                                    ) : f.type === 'password' ? (
                                        <input
                                            type="password"
                                            value={formData[f.name]}
                                            onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                                            required={!editId}
                                            placeholder={editId ? 'Leave blank to keep current' : ''}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[f.name]}
                                            onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                                            required
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn ripple-button" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="save-btn ripple-button">Save {title}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterScreen;
