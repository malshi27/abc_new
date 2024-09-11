import React from 'react'
import AdminLayout from '../AdminLayout/AdminLayout'
import './Doctors.css';
import VerifyDoctorAdmin from './SearchStaff/Staffverify';

const UnverifiedDoctors = () => {
    return (
        <>
            <AdminLayout >
               <VerifyDoctorAdmin/>
            </AdminLayout>
        </>
    )
}
export default UnverifiedDoctors;