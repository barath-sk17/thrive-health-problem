import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from "react-hot-toast";
import { Table } from 'antd';
import moment from 'moment';


const Appointments = () => {
  
    
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();

    const getAppointmentsData = async () => {
    try {
        dispatch(showLoading());
        const response = await axios.get('/api/user/get-appointments-by-user-id', {
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

    useEffect(() => {
        getAppointmentsData();
      }, []);


      const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
          },
        {
          title: 'Doctor',
          dataIndex: 'firstName',
          key: 'firstName',
          render: (text, record) => <span>
            {record.doctorInfo.firstName} {record.doctorInfo.lastName}
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
        }
      ];
  
    return (

      <Layout>
        <div className="page-title">Appointments</div>
        <Table columns={columns} dataSource={appointments} rowKey="id" />
      </Layout>
  )
}

export default Appointments