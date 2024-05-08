import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from "react-hot-toast";
import { Table } from 'antd';
import moment from 'moment'; 

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/admin/get-all-doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('An error occurred while fetching doctors:', error);
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/admin/change-doctor-account-status',
        {
          doctorId: record._id,
          userId: record.userId,
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
        getDoctorsData();
      } else {
        toast.error('Failed to change doctor account status');
      }
    } catch (error) {
      toast.error('Error changing doctor account status');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (createdAt) => moment(createdAt).format('MMMM Do YYYY, h:mm:ss a'),
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
            <span className="anchor" onClick={() => changeDoctorStatus(record, 'approved')}>
              Approve
            </span>
          )}
          {record.status === 'approved' && (
            <span className="anchor" onClick={() => changeDoctorStatus(record, 'blocked')}>
              Block
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="page-header">Doctor List</div>
      <Table columns={columns} dataSource={doctors} rowKey="id" />
    </Layout>
  );
}

export default DoctorList;
