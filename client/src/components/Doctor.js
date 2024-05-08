import React from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Doctor({doctor}) {

  const navigate = useNavigate()
  return (
    <div className='card' onClick={() => navigate(`/book-appointment/${doctor._id}`)}>
        <h1 className='card-title'>{doctor.firstName} {doctor.lastName}</h1>
        <p className='card-text'><b> Phone Number : </b>{doctor.phoneNumber}</p>
        <p className='card-text'><b> Adress : </b>{doctor.address}</p>
        <p className='card-text'><b> Specialization : </b>{doctor.specialization}</p>
        <p className='card-text'><b> Consultation Fee : </b>{doctor.feePerConsultation}</p>
    </div>
  )
}

export default Doctor