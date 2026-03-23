import React, { useState, useEffect } from 'react';
import MasterScreen from '../components/MasterScreen';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';

const ProgrammePage = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepts = async () => {
            const { data } = await api.get('/departments');
            setDepartments(data);
        };
        fetchDepts();
    }, []);

    const fields = [
        {
            name: 'department',
            label: 'Department',
            type: 'select',
            options: departments
        },
        { name: 'name', label: 'Programme Name' },
        { name: 'shortName', label: 'Short Name' },
    ];

    return (
        <MainLayout>
            <MasterScreen
                title="Programme"
                endpoint="/programmes"
                fields={fields}
            />
        </MainLayout>
    );
};

export default ProgrammePage;
