import React from 'react'
import Footer from '../../Shared/Footer/Footer'
import './index.css';
import { useParams } from 'react-router-dom';
import Header from '../../Shared/Header/Header';
import SubHeader from '../../Shared/SubHeader';
import { useGetDoctorQuery } from '../../../redux/api/doctorApi';
import { Empty, message } from 'antd';
import SearchContent from '../SearchStaff/SearchContent';
import { Tabs } from 'antd';
import OverView from './OverView';
import Location from './Location';
import Review from './Review';
import Availibility from './Availibility';

const DoctorProfile = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useGetDoctorQuery(id);
    let content = null;
    if (!isLoading && isError) content = <div>{message.error('Something went Wrong!')}</div>
    if (!isLoading && !isError && data?.id === undefined) content = <Empty />
    if (!isLoading && !isError && data?.id) content = <SearchContent data={data} />

    const items = [
      
        {
            key: '2',
            label: 'Locations',
            children: <Location doctorId={id} />,
        },
        {
            key: '3',
            label: 'Reviews',
            children: <Review doctorId={id}/>,
        },
    ];

    
    return (
        <>
            <Header />
            <SubHeader title='Doctor Details' subtitle='' />
            <div className="container" style={{ marginBottom: '4rem', marginTop: '6rem' }}>
                {content}
                <div className='p-4 rounded' style={{ marginBottom: '7rem', backgroundColor: '#f3f3f3' }}>
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default DoctorProfile;