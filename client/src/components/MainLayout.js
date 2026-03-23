import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard, Building2, BookOpen, Layers,
    MapPin, ShieldCheck, Users, LogOut, Menu, X, ChevronRight, Plus, AlertCircle, FileDown
} from 'lucide-react';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['SuperAdmin', 'User', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Technician'] },
        { name: 'Departments', path: '/departments', icon: <Building2 size={20} />, roles: ['SuperAdmin'] },
        { name: 'Programmes', path: '/programmes', icon: <BookOpen size={20} />, roles: ['SuperAdmin'] },
        { name: 'Blocks', path: '/blocks', icon: <Layers size={20} />, roles: ['SuperAdmin'] },
        { name: 'Rooms', path: '/rooms', icon: <MapPin size={20} />, roles: ['SuperAdmin'] },
        { name: 'Roles', path: '/roles', icon: <ShieldCheck size={20} />, roles: ['SuperAdmin'] },
        { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['SuperAdmin'] },
        { name: 'Raise Complaint', path: '/raise-complaint', icon: <Plus size={20} />, roles: ['User'] },
        { name: 'Complaints List', path: '/complaints', icon: <AlertCircle size={20} />, roles: ['SuperAdmin', 'User', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer', 'Technician'] },
        { name: 'Reports', path: '/reports', icon: <FileDown size={20} />, roles: ['SuperAdmin', 'User'] },
    ];

    const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-section">
                        <div className="logo-icon">T</div>
                        <span>TMS Panel</span>
                    </div>
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="nav-menu">
                    {filteredNav.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="name">{item.name}</span>
                            <ChevronRight className="arrow" size={16} />
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{user?.name?.charAt(0)}</div>
                        <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div className="header-left">
                        <h2 className="gradient-text">
                            {navItems.find(i => window.location.pathname.startsWith(i.path))?.name || 'Overview'}
                        </h2>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar-mini">
                            {/* Placeholder for future search */}
                        </div>
                        <div className="date-display">
                            <span className="date-icon">📅</span>
                            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </header>
                <section className="content-area">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default MainLayout;
