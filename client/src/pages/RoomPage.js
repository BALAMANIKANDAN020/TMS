import React, { useState, useEffect } from 'react';
import MasterScreen from '../components/MasterScreen';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';

const RoomPage = () => {
    const [options, setOptions] = useState({ depts: [], progs: [], blocks: [] });

    useEffect(() => {
        const fetchData = async () => {
            const [d, p, b] = await Promise.all([
                api.get('/departments'),
                api.get('/programmes'),
                api.get('/blocks')
            ]);
            setOptions({ depts: d.data, progs: p.data, blocks: b.data });
        };
        fetchData();
    }, []);

    const fields = [
        { name: 'department', label: 'Department', type: 'select', options: options.depts },
        { name: 'programme', label: 'Programme', type: 'select', options: options.progs },
        { name: 'block', label: 'Block', type: 'select', options: options.blocks },
        { name: 'roomNumber', label: 'Room Number' },
    ];

    return (
        <MainLayout>
            <MasterScreen title="Room" endpoint="/rooms" fields={fields} />
        </MainLayout>
    );
};

export default RoomPage;
