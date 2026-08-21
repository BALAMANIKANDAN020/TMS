import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import { Send, FileText, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import './RaiseComplaintPage.css';

const RaiseComplaintPage = () => {
    const navigate = useNavigate();
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });
    const [formData, setFormData] = useState({
        block: '',
        room: '',
        department: '',
        programme: '',
        type: '',
        remarks: '',
        attachment: '',
    });

    useEffect(() => {
        const fetchOptions = async () => {
            const [b, r, d, p] = await Promise.all([
                api.get('/blocks'),
                api.get('/rooms'),
                api.get('/departments'),
                api.get('/programmes')
            ]);
            setBlocks(b.data);
            setRooms(r.data);
            setDepartments(d.data);
            setProgrammes(p.data);
        };
        fetchOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaints', formData);
            setPopup({
                show: true,
                type: 'success',
                title: 'Complaint Raised Successfully!',
                message: 'Your complaint has been submitted. Our support team will process it shortly.'
            });
            setFormData({ block: '', room: '', department: '', programme: '', type: '', remarks: '', attachment: '' });
        } catch (err) {
            setPopup({
                show: true,
                type: 'error',
                title: 'Submission Failed',
                message: err.response?.data?.message || 'Failed to raise complaint. Please try again.'
            });
        }
    };

    const complaintTypes = [
        'PC Hardware', 'PC Software', 'Application Issues',
        'Network', 'Electronics', 'Plumbing'
    ];

    return (
        <MainLayout>
            <div className="raise-complaint-container page-enter">
                <div className="form-card">
                    <div className="form-header">
                        <div className="icon-circle">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h2>Create New Complaint</h2>
                            <p>Please provide accurate details to help us resolve the issue faster.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="complaint-form">
                        <div className="form-group">
                            <label>Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value, programme: '', block: '', room: '' })}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Programme</label>
                            <select
                                value={formData.programme}
                                onChange={(e) => setFormData({ ...formData, programme: e.target.value, block: '', room: '' })}
                                required
                                disabled={!formData.department}
                                className={!formData.department ? 'disabled' : ''}
                            >
                                <option value="">{formData.department ? 'Select Programme' : 'Select Department First'}</option>
                                {programmes
                                    .filter(p => {
                                        const deptId = p.department?._id || p.department;
                                        return deptId === formData.department;
                                    })
                                    .map(p => <option key={p._id} value={p._id}>{p.name}</option>)
                                }
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Block Name</label>
                                <select
                                    value={formData.block}
                                    onChange={(e) => setFormData({ ...formData, block: e.target.value, room: '' })}
                                    required
                                    disabled={!formData.programme}
                                    className={!formData.programme ? 'disabled' : ''}
                                >
                                    <option value="">{formData.programme ? 'Select Block' : 'Select Programme First'}</option>
                                    {blocks
                                        .filter(b => {
                                            const progId = b.programme?._id || b.programme;
                                            return progId === formData.programme;
                                        })
                                        .map(b => <option key={b._id} value={b._id}>{b.name}</option>)
                                    }
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Room Number</label>
                                <select
                                    value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                    required
                                    disabled={!formData.block}
                                    className={!formData.block ? 'disabled' : ''}
                                >
                                    <option value="">{formData.block ? 'Select Room' : 'Select Block First'}</option>
                                    {rooms
                                        .filter(r => {
                                            const blockId = r.block?._id || r.block;
                                            return blockId === formData.block;
                                        })
                                        .map(r => (
                                            <option key={r._id} value={r._id}>{r.roomNumber}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Complaint Type</label>
                            <div className="type-grid">
                                {complaintTypes.map(type => (
                                    <label key={type} className={`type-card ${formData.type === type ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="complaintType"
                                            value={type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            required
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Remarks / Description</label>
                            <textarea
                                placeholder="Describe the issue in detail..."
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Attachment (Optional)</label>
                            <div className="file-upload">
                                <FileText size={20} />
                                <input
                                    type="text"
                                    placeholder="Paste image URL or file path..."
                                    value={formData.attachment}
                                    onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn ripple-button">
                            <Send size={20} />
                            <span>Submit Complaint</span>
                        </button>
                    </form>
                </div>
            </div>

            {popup.show && (
                <div className="popup-overlay page-enter">
                    <div className={`popup-card ${popup.type}`}>
                        <div className="popup-icon-box">
                            {popup.type === 'success' ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
                        </div>
                        <h3 className="popup-title">{popup.title}</h3>
                        <p className="popup-message">{popup.message}</p>
                        <div className="popup-actions">
                            {popup.type === 'success' && (
                                <button
                                    className="popup-btn secondary"
                                    onClick={() => navigate('/complaints')}
                                >
                                    View Complaints
                                </button>
                            )}
                            <button
                                className="popup-btn primary"
                                onClick={() => setPopup({ ...popup, show: false })}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default RaiseComplaintPage;
