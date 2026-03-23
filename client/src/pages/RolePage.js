import React from 'react';
import MasterScreen from '../components/MasterScreen';
import MainLayout from '../components/MainLayout';

const RolePage = () => {
    const fields = [{ name: 'name', label: 'Role Name' }];
    // Note: Backend Role routes needs implementation or just use generic
    return (
        <MainLayout>
            <MasterScreen title="Role" endpoint="/roles" fields={fields} />
        </MainLayout>
    );
};

export default RolePage;
