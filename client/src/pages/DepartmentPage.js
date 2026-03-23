import React from 'react';
import MasterScreen from '../components/MasterScreen';
import MainLayout from '../components/MainLayout';

const DepartmentPage = () => {
    const fields = [
        { name: 'name', label: 'Department Name' },
        { name: 'shortName', label: 'Short Name' },
    ];

    return (
        <MainLayout>
            <MasterScreen
                title="Department"
                endpoint="/departments"
                fields={fields}
            />
        </MainLayout>
    );
};

export default DepartmentPage;
