import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Table } from 'antd';
import moment from 'moment'; // for date formatting

function UserList() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/admin/get-all-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('An error occurred while fetching users:', error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []); // empty dependency array to run only once on component mount

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (createdAt) => moment(createdAt).format('MMMM Do YYYY, h:mm:ss a'), // formatting
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <div className="d-flex">
            <h1 className="anchor" onClick={() => console.log('Block user:', record)}>Block</h1>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="page-header">User List</div>
      <Table columns={columns} dataSource={users} rowKey="id" />
    </Layout>
  );
}

export default UserList;
