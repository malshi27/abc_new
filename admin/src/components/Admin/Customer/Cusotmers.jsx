import React from 'react'
import AdminLayout from '../AdminLayout/AdminLayout'
import './Customer.css';
import TrackAppointment from './TrackAppointment';

const Patients = () => {
    return (
        <>
            <AdminLayout >
               <TrackAppointment/>
            </AdminLayout>
        </>
    )
}
export default Patients;