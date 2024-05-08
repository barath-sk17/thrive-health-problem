
import React, { useState } from 'react';
import { Col, Form, Input, Row, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import moment from 'moment';

// Custom Base85 encoding function
function base85Encode(data) {
  const base85Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';
  let result = '';
  let padding = 0;

  const bytes = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    bytes[i] = data.charCodeAt(i);
  }

  for (let i = 0; i < bytes.length; i += 4) {
    let value = 0;
    for (let j = 0; j < 4; j++) {
      value = (value << 8) | (bytes[i + j] || 0);
      if (bytes[i + j] === undefined) {
        padding++;
      }
    }
    const encoded = [];
    for (let k = 0; k < 5 - padding; k++) {
      encoded.unshift(base85Chars[value % 85]);
      value = Math.floor(value / 85);
    }
    result += encoded.join('');
  }
  return result;
}

function ApplyDoctor() {
  const [form] = Form.useForm(); // Initializing the form
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [signatureBase85, setSignatureBase85] = useState('');

  const getBase85 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const base64String = reader.result.split(',')[1]; // Base64-encoded image data
      const decodedBinary = atob(base64String); // Decode to raw binary
      const base85String = base85Encode(decodedBinary); // Encode to Base85
      callback(base85String);
    });
    reader.readAsDataURL(file); // Read the file as a Base64 data URL
  };

  const beforeUpload = (file) => {
    getBase85(file, (base85) => {
      setSignatureBase85(base85);
    });

    // Return false to prevent automatic upload
    return false;
  };

  const onFinish = async (values) => {
    const { timings, ...restValues } = values;
    const formattedTimings = timings ? timings.map((time) => time.format('HH:mm')) : [];

    const formData = {
      ...restValues,
      signature: signatureBase85, // Use Base85-encoded data
      timings: formattedTimings,
      userId: user._id,
    };

    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/user/apply-doctor-account',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong during registration');
    }
  };
  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h1 className="card-title mt-3">Personal Information</h1>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter your address' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Signature"
              name="signature"
              rules={[{ required: true, message: 'Please upload your signature' }]}
            >
              <Upload
                beforeUpload={beforeUpload}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <hr />
        <h1 className="card-title mt-3">Professional Information</h1>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              label="Specialization"
              name="specialization"
              rules={[{ required: true, message: 'Please enter your specialization' }]}
            >
              <Input placeholder="Specialization" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true, message: 'Please enter your experience in years' }]}
            >
              <Input type="number" placeholder="Experience (years)" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Fee Per Consultation"
              name="feePerConsultation"
              rules={[{ required: true, message: 'Please enter the fee per consultation' }]}
            >
              <Input type="number" placeholder="Fee per consultation" />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button type="primary" htmlType="submit">
            SUBMIT
          </Button>
        </div>
      </Form>
    </Layout>
  );
}

export default ApplyDoctor;
