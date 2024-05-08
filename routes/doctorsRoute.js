const express = require("express");
const Doctor = require("../models/doctorModel");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

router.post('/get-doctor-info-by-id', authMiddleware, async(req,res) => {
    try{
        userid = req.body.userId
        //console.log(userid)
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }
        
        res.status(200).send({ success: true, message: "Doctor info fetched Successfully",
                data: doctor,
             });
    }
    catch(error){
        res.status(500).send({ message: "Error getting doctor info", success: false, error });
    }
});


router.post('/update-doctor-profile', authMiddleware, async(req,res) => {
    try{
        userid = req.body.userId
        //console.log(userid)
        const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, req.body);
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }
        
        res.status(200).send({ success: true, message: "Doctor info updated Successfully",
                data: doctor,
             });
    }
    catch(error){
        res.status(500).send({ message: "Error getting doctor info", success: false, error });
    }
});


router.post('/get-doctor-info-by-user-id', authMiddleware, async(req,res) => {
    try{
        userid = req.body.userId
        //console.log(userid)
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }
        
        res.status(200).send({ success: true, message: "Doctor info fetched Successfully",
                data: doctor,
             });
    }
    catch(error){
        res.status(500).send({ message: "Error getting doctor info", success: false, error });
    }
});


router.get('/get-appointments-by-doctor-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({doctorId: doctor._id});
        res.status(200).send({ message: 'Appointments fetched successfully', success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send({ message: 'Error fetching appointments', success: false, error: error.message });
    }
});


router.post('/change-appointment-status', authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status });

        const user = await User.findById({_id: appointment.userId});
        if (user) {
            const unseenNotifications = user.unseenNotifications;
            unseenNotifications.push({
                type: 'appointment-status-changed',
                message: `Your appointment status has been ${status}`,
                onClickPath: '/appointments',
            });
            await user.save();
        }

        res.status(200).send({ message: 'Appointment status updated successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'Error updating appointment account status', success: false, error: error.message });
    }
});


module.exports = router;