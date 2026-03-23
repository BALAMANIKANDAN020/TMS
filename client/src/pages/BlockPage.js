import React, { useState, useEffect } from 'react';
import MasterScreen from '../components/MasterScreen';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';

const BlockPage = () => {
    const [departments, setDepartments] = useState([]);
    const [programmes, setProgrammes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [depts, progs] = await Promise.all([
                api.get('/departments'),
                api.get('/programmes')
            ]);
            setDepartments(depts.data);
            setProgrammes(progs.data);
        };
        fetchData();
    }, []);

    const fields = [
        { name: 'department', label: 'Department', type: 'select', options: departments },
        { name: 'programme', label: 'Programme', type: 'select', options: programmes },
        { name: 'name', label: 'Block Name' },
    ];

    return (
        <MainLayout>
            <MasterScreen title="Block" endpoint="/blocks" fields={fields} />
        </MainLayout>
    );
};

export default BlockPage;
