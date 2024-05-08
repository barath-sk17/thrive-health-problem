import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Button, Upload, TimePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function BookAppointment() {
  

  const {user} = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
     


      const response = await axios.post(
        '/api/doctor/get-doctor-info-by-user-id',
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Failed to fetch doctor info');
    }
  };

  const bookNow = async() => {
    try {
        dispatch(showLoading());
       
  
  
        const response = await axios.post(
          '/api/user/book-appointment',
          { 
            doctorId : params.doctorId,
            userId : user._id,
            doctorInfo : doctor,
            userInfo : user,
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
        }
      } catch (error) {
        toast.error('Error booking appointment');
        dispatch(hideLoading());
        
      }
  }

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
        {doctor &&(
            <div>
                <h1 className='page-title'>{doctor.firstName} {doctor.lastName}</h1>
                <hr/>
                <Row>
                    <Col span={8} sm={24} xs={24} lg={8}>
                        <Button className='secondary-button mt-3 full-width-button' onClick={bookNow}>To get a Schedule</Button>
                    </Col>
                    <Col span={8} sm={24} xs={24} lg={8}>
                      <h1 className='card title'>
                        {doctor.firstName} {doctor.lastName}
                      </h1>
                      <hr/>
                      <p>
                        <b> Phone Number : </b>
                        {doctor.phoneNumber}
                      </p>
                      <p>
                        <b> Address : </b>
                        {doctor.address}
                      </p>
                      <p>
                        <b> Fee per visit : </b>
                        {doctor.feePerConsultation}
                      </p>
                    </Col>
                </Row>
            </div>    
        )}
        </Layout>
    
  )
}

export default BookAppointment