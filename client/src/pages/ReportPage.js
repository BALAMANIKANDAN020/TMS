import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Download, FileDown, Search, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './ReportPage.css';

const ReportPage = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: '',
        programme: '',
        type: '',
        status: '',
        assignee: ''
    });
    const [options, setOptions] = useState({ departments: [], programmes: [], staff: [] });

    const statusColors = {
        'Pending': '#f59e0b',
        'Assigned': '#6366f1',
        'In-Progress': '#06b6d4',
        'Completed': '#10b981',
        'Closed': '#64748b'
    };

    useEffect(() => {
        fetchOptions();
        fetchReport();
    }, []);

    const fetchOptions = async () => {
        try {
            const [d, p] = await Promise.all([
                api.get('/departments'),
                api.get('/programmes')
            ]);

            let staffData = [];
            if (user?.role === 'SuperAdmin') {
                try {
                    const u = await api.get('/users');
                    staffData = u.data.filter(u => u.role !== 'User' && u.role !== 'SuperAdmin');
                } catch (err) {
                    console.error('Error fetching users:', err);
                }
            }

            setOptions({
                departments: d.data,
                programmes: p.data,
                staff: staffData
            });
        } catch (err) {
            console.error('Error fetching options:', err);
        }
    };

    const fetchReport = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/complaints');
            setData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item => {
        return (
            (!filters.department || item.department?._id === filters.department) &&
            (!filters.programme || item.programme?._id === filters.programme) &&
            (!filters.type || item.type === filters.type) &&
            (!filters.status || item.status === filters.status) &&
            (!filters.assignee || item.assignedTo?._id === filters.assignee)
        );
    });

    const exportPDF = () => {
        const doc = new jsPDF();
        
        // Add Branding
        doc.setFillColor(15, 23, 42); // --bg-sidebar color
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('TICKET MANAGEMENT SYSTEM', 14, 25);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('COMPLAINTS REPORT', 14, 33);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 140, 33);

        // Define Table Headers
        const tableColumn = ["Date", "User", "Type", "Department", "Programme", "Status", "Assignee"];
        const tableRows = filteredData.map(item => [
            new Date(item.createdAt).toLocaleDateString(),
            item.user?.name || 'N/A',
            item.type,
            item.department?.shortName || item.department?.name || 'N/A',
            item.programme?.shortName || item.programme?.name || 'N/A',
            item.status,
            item.assignedTo?.name || 'Unassigned'
        ]);

        // Generate Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            headStyles: { 
                fillColor: [99, 102, 241], // --primary color
                fontSize: 10,
                halign: 'center',
                valign: 'middle',
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { halign: 'center' }, // Date
                1: { halign: 'center' }, // User
                2: { halign: 'center' }, // Type
                3: { halign: 'center' }, // Dept
                4: { halign: 'center' }, // Prog
                5: { halign: 'center', fontStyle: 'bold' }, // Status
                6: { halign: 'center' }  // Assignee
            },
            didDrawCell: (data) => {
                // Background colors for status column (5)
                if (data.section === 'body' && data.column.index === 5) {
                    const status = data.cell.raw;
                    if (status === 'Pending') doc.setTextColor(245, 158, 11);
                    else if (status === 'Assigned') doc.setTextColor(99, 102, 241);
                    else if (status === 'In-Progress') doc.setTextColor(6, 182, 212);
                    else if (status === 'Completed' || status === 'Closed') doc.setTextColor(16, 185, 129);
                } else {
                    doc.setTextColor(60, 60, 60);
                }
            },
            styles: { 
                fontSize: 8, 
                cellPadding: 4,
                font: 'helvetica',
                valign: 'middle',
                overflow: 'linebreak'
            },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: 14, right: 14 }
        });

        doc.save(`TMS_Report_${new Date().getTime()}.pdf`);
    };

    return (
        <MainLayout>
            <div className="report-container">
                <div className="report-filters">
                    <div className="filter-grid">
                        <div className="filter-item">
                            <label>Department</label>
                            <select onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                                <option value="">All Departments</option>
                                {options.departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Status</label>
                            <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In-Progress">In-Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <label>Complaint Type</label>
                            <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                                <option value="">All Types</option>
                                <option value="PC Hardware">PC Hardware</option>
                                <option value="PC Software">PC Software</option>
                                <option value="Application Issues">Application Issues</option>
                                <option value="Network">Network</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Plumbing">Plumbing</option>
                            </select>
                        </div>
                        {user?.role === 'SuperAdmin' && (
                            <div className="filter-item">
                                <label>Assignee</label>
                                <select onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}>
                                    <option value="">All Staff</option>
                                    {options.staff.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <button className="export-btn ripple-button" onClick={exportPDF}>
                        <FileText size={20} />
                        <span>Export PDF</span>
                    </button>
                </div>

                <div className="report-table">
                    {loading ? (
                        <div className="table-skeleton-container" style={{ padding: '20px' }}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div className="skeleton skeleton-text" key={i} style={{ marginBottom: '16px', height: '44px' }}></div>
                            ))}
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Dept</th>
                                    <th>Prog</th>
                                    <th>Status</th>
                                    <th>Assignee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(item => (
                                    <tr key={item._id} className="page-enter">
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>{item.user?.name}</td>
                                        <td>{item.type}</td>
                                        <td>{item.department?.shortName || item.department?.name || 'N/A'}</td>
                                        <td>{item.programme?.shortName || item.programme?.name || 'N/A'}</td>
                                        <td>
                                            <span 
                                                className="status-pill"
                                                style={{ 
                                                    background: `${statusColors[item.status]}20`, 
                                                    color: statusColors[item.status], 
                                                    borderColor: statusColors[item.status] 
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.assignedTo?.name || 'Unassigned'}</td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            No records found for the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ReportPage;
