import React from 'react'
import DoctorDashCard from './staff/StaffDashCard';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import DashboardPage from './staff/DashboardPage';
import PatientDashboard from './CustomerDashboard';

const Dashboard = () => {
    const { role } = useAuthCheck();
    return (
        <>
            <DashboardLayout>
                {role === 'doctor' && <DoctorDashCard />}

                <div className="row">
                    {role === 'patient' &&
                        <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                            <h5 className="text-title my-3">My Appointments</h5>
                            <PatientDashboard />
                        </div>
                    }
                    {role === 'doctor' &&
                        <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                            <h5 className="text-title py-3">Appointments</h5>
                            <DashboardPage />
                        </div>
                    }

                </div>
            </DashboardLayout>
        </>
    )
}

export default Dashboard;