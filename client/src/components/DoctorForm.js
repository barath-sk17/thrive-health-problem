import { Button, Col, Form, Row, Upload } from 'antd'
import React from 'react'

function DoctorForm(onFinish) {
  return (
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
  )
}

export default DoctorForm