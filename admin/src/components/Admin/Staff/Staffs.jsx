import React from 'react'
import AdminLayout from '../AdminLayout/AdminLayout'
import './Doctors.css';
import SearchDoctorAdmin from './SearchStaff/SearchStaff';

const Doctors = () => {
    return (
        <>
            <AdminLayout >
               <SearchDoctorAdmin/>
            </AdminLayout>
        </>
    )
}
export default Doctors;