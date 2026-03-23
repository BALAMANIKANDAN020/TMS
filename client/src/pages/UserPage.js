import React, { useState, useEffect } from 'react';
import MasterScreen from '../components/MasterScreen';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';

const UserPage = () => {
    const [data, setData] = useState({ roles: [] });

    useEffect(() => {
        const fetchData = async () => {
            const { data: rolesData } = await api.get('/roles');
            setData({ roles: rolesData });
        };
        fetchData();
    }, []);

    const fields = [
        { name: 'name', label: 'User Name' },
        { name: 'email', label: 'Email' },
        { name: 'phoneNumber', label: 'Phone' },
        { name: 'role', label: 'Role', type: 'select', options: data.roles.map(r => ({ _id: r.name, name: r.name })) },
        // Add password field for new users, hide in table
        { name: 'password', label: 'Password', type: 'password', hideInTable: true }
    ];

    return (
        <MainLayout>
            <MasterScreen title="User" endpoint="/users" fields={fields} />
        </MainLayout>
    );
};

export default UserPage;
