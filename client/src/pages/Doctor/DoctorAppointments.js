import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from "react-hot-toast";
import { Table } from 'antd';
import moment from 'moment';


const DoctorAppointments = () => {


    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();


    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/doctor/get-appointments-by-doctor-id', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setAppointments(response.data.data);
            } else {
                console.error('Failed to fetch doctors');
            }
        } catch (error) {
            console.error('An error occurred while fetching doctors:', error);
            dispatch(hideLoading());
        }
    };


    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/doctor/change-appointment-status',
                {
                    appointmentId: record._id,
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                getAppointmentsData();
            } else {
                toast.error('Failed to change doctor account status');
            }
        } catch (error) {
            toast.error('Error changing doctor account status');
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getAppointmentsData();
    }, []);


    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Patient',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text, record) => <span>
                {record.userInfo.name}
            </span>,
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (text, record) => <span>
                {record.doctorInfo.phoneNumber}
            </span>,
        },
        {
            title: 'Date & Time',
            dataIndex: 'createdAt',
            render: (text, record) => <span>
                {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
            </span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === 'pending' && (
                        <div className='d-flex'>
                            <span className="anchor px-2" onClick={() => changeAppointmentStatus(record, 'approved')}>
                                Approve
                            </span>
                            <span className="anchor" onClick={() => changeAppointmentStatus(record, 'rejected')}>
                                Reject
                            </span>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (

        <Layout>
            <div className="page-title">Appointments</div>
            <Table columns={columns} dataSource={appointments} rowKey="id" />
        </Layout>
    )
}

export default DoctorAppointments