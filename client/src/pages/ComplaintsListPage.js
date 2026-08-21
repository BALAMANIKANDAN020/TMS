import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Filter, Eye, UserPlus, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import './ComplaintsListPage.css';

const ComplaintsListPage = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchComplaints();
        if (user.role === 'SuperAdmin') {
            fetchStaff();
        }
    }, [user]);

    const fetchComplaints = async () => {
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const { data } = await api.get('/users');
            setStaff(data.filter(u => u.role !== 'User' && u.role !== 'SuperAdmin'));
        } catch (err) {
            console.error('Failed to fetch staff:', err);
        }
    };

    const handleAssign = async (complaintId, staffId) => {
        try {
            await api.put(`/complaints/${complaintId}`, { assignedTo: staffId });
            fetchComplaints();
        } catch (err) {
            alert('Assignment failed');
        }
    };

    const handleStatusChange = async (complaintId, status) => {
        try {
            await api.put(`/complaints/${complaintId}`, { status });
            fetchComplaints();
        } catch (err) {
            alert('Status update failed');
        }
    };

    const handleDelete = async (complaintId) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${complaintId}`);
                fetchComplaints();
            } catch (err) {
                let message = `Deletion failed.\n\n`;
                if (err.response) {
                    message += `Error ${err.response.status}: ${err.response.data.message || err.message}`;
                } else if (err.request) {
                    message += 'Network error: Server is not responding. Please check if the server is running.';
                } else {
                    message += `Request Error: ${err.message}`;
                }
                alert(message);
            }
        }
    };

    const statusColors = {
        'Pending': '#f59e0b',
        'Assigned': '#6366f1',
        'In-Progress': '#06b6d4',
        'Completed': '#10b981',
        'Closed': '#64748b'
    };

    return (
        <MainLayout>
            <div className="complaints-list-container">
                <div className="list-toolbar">
                    <div className="filter-group">
                        <Filter size={18} />
                        <span>Filter Complaints</span>
                    </div>
                </div>

                <div className="complaints-grid">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div className="ticket-card skeleton-card skeleton" key={i} style={{ height: '300px' }}></div>
                        ))
                    ) : (
                        complaints.map(ticket => (
                            <div className="ticket-card page-enter" key={ticket._id}>
                                <div className="ticket-header">
                                    <span className="ticket-type">{ticket.type}</span>
                                    <div className="header-right">
                                        <span className="ticket-status" style={{ background: statusColors[ticket.status], color: 'white' }}>
                                            {ticket.status}
                                        </span>
                                        {(user.role === 'SuperAdmin' || ticket.user?._id === user._id) && (
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(ticket._id)}
                                                title="Delete Complaint"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="ticket-body">
                                    <p className="remarks">"{ticket.remarks}"</p>
                                    <div className="ticket-meta">
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span>Dept: {ticket.department?.name || 'N/A'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span>Prog: {ticket.programme?.shortName || ticket.programme?.name || 'N/A'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span>Block: {ticket.block?.name}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span>Room: {ticket.room?.roomNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ticket-footer">
                                    <div className="user-brief">
                                        <div className="mini-avatar">{ticket.user?.name?.charAt(0)}</div>
                                        <div className="user-info-stack">
                                            <span className="user-name">{ticket.user?.name}</span>
                                            <span className="user-dept">{ticket.department?.shortName}</span>
                                        </div>
                                    </div>

                                    <div className="action-area">
                                        {user.role === 'SuperAdmin' && (
                                            <div className="admin-actions">
                                                {ticket.status !== 'Closed' && (
                                                    <select
                                                        className="assign-select"
                                                        value={ticket.assignedTo?._id || ''}
                                                        onChange={(e) => handleAssign(ticket._id, e.target.value)}
                                                    >
                                                        <option value="">Assign Staff</option>
                                                        {staff.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
                                                    </select>
                                                )}

                                                {ticket.status === 'Completed' && (
                                                    <button
                                                        className="btn-status close"
                                                        onClick={() => handleStatusChange(ticket._id, 'Closed')}
                                                    >
                                                        <Eye size={16} /> Close Ticket
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        <div className="status-actions">
                                            {ticket.assignedTo?._id === user._id && (
                                                <>
                                                    {ticket.status === 'Assigned' && (
                                                        <button className="btn-status start" onClick={() => handleStatusChange(ticket._id, 'In-Progress')}>
                                                            <Clock size={16} /> Start Work
                                                        </button>
                                                    )}
                                                    {ticket.status === 'In-Progress' && (
                                                        <button className="btn-status complete" onClick={() => handleStatusChange(ticket._id, 'Completed')}>
                                                            <CheckCircle2 size={16} /> Mark Completed
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {complaints.length === 0 && !loading && (
                        <div className="empty-list">No complaints found.</div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ComplaintsListPage;
