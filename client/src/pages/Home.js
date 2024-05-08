import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { Col, Row } from 'antd';
import Layout from '../components/Layout';
import Doctor from '../components/Doctor';

function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Not used in your original code, but here for completeness

  const getData = async () => {
    try {
      dispatch(showLoading());
      const token = localStorage.getItem('token'); // Ensure token is retrieved
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get('/api/user/get-all-approved-doctors', {
        headers: {
          Authorization: 'Bearer ' + token, // Use the token you retrieved
        },
      });

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        console.error('Error: ', response.data.message); // Handle unsuccessful response
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error fetching data:', error); // Use console.error for error logging
    }
  };

  useEffect(() => {
    getData(); // Fetch data when the component is mounted
  }, []); // Empty array to ensure useEffect runs only once on mount

  return (
    <Layout>
      <Row gutter={[16, 16]}> 
        {doctors.map((doctor) => (
          <Col key={doctor._id} span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;
