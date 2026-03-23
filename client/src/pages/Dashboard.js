import React, { useContext, useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [statsData, setStatsData] = useState({ total: 0, pending: 0, assigned: 0, closed: 0 });
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/complaints');
                setComplaints(data);
                setStatsData({
                    total: data.length,
                    pending: data.filter(t => t.status === 'Pending').length,
                    assigned: data.filter(t => t.status === 'Assigned').length,
                    closed: data.filter(t => t.status === 'Closed' || t.status === 'Completed').length,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Complaints', value: statsData.total, icon: <Ticket />, color: 'var(--primary-gradient)' },
        { label: 'Pending', value: statsData.pending, icon: <Clock />, color: 'var(--accent-gradient)' },
        { label: 'Assigned', value: statsData.assigned, icon: <CheckCircle />, color: 'var(--secondary-gradient)' },
        { label: 'Closed', value: statsData.closed, icon: <AlertCircle />, color: 'linear-gradient(135deg, #64748b 0%, #334155 100%)' },
    ];

    const statusColors = {
        'Pending': '#f59e0b',
        'Assigned': '#6366f1',
        'In-Progress': '#06b6d4',
        'Completed': '#10b981',
        'Closed': '#64748b'
    };

    return (
        <MainLayout>
            <div className={`dashboard-content ${loading ? 'loading' : 'page-enter'}`}>
                <div className="dashboard-header">
                    {loading ? (
                        <>
                            <div className="skeleton skeleton-title" style={{ width: '240px' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '320px' }}></div>
                        </>
                    ) : (
                        <>
                            <h1>Hello, {user?.name}!</h1>
                            <p>Here's what's happening with the system today.</p>
                        </>
                    )}
                </div>

                <div className="stats-grid">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div className="stat-card skeleton-card skeleton" key={i}></div>
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <div className="stat-card" key={index} style={{ '--accent-grad': stat.color }}>
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-info">
                                    <h3>{stat.value}</h3>
                                    <p>{stat.label}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="dashboard-complaints-section">
                    <div className="section-title">
                        <AlertCircle size={24} />
                        <h2>Recent Complaints</h2>
                    </div>

                    <div className="complaints-table-container">
                        {loading ? (
                            <div className="table-skeleton-container" style={{ padding: '20px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div className="skeleton skeleton-text" key={i} style={{ marginBottom: '20px', height: '40px' }}></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <table className="complaints-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Dept</th>
                                            <th>Prog</th>
                                            <th>Block/Room</th>
                                            <th>Requested By</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.slice(0, 5).map((ticket) => (
                                            <tr key={ticket._id} className="table-row">
                                                <td>
                                                    <span className="type-badge">{ticket.type}</span>
                                                </td>
                                                <td>{ticket.department?.name || 'N/A'}</td>
                                                <td>{ticket.programme?.shortName || ticket.programme?.name || 'N/A'}</td>
                                                <td>{ticket.block?.name} - {ticket.room?.roomNumber}</td>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="mini-avatar">{ticket.user?.name?.charAt(0)}</div>
                                                        <span>{ticket.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span
                                                        className="status-pill"
                                                        style={{ background: `${statusColors[ticket.status]}20`, color: statusColors[ticket.status], borderColor: statusColors[ticket.status] }}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {complaints.length === 0 && (
                                    <div className="empty-state">No complaints to show.</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;
