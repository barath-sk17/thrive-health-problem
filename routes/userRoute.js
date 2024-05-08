const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const multer = require('multer'); // File upload middleware
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { error } = require('console');
const authMiddleware = require('../middlewares/authMiddleware');
const Doctor = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');

router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if(userExists){
            return res
            .status(200)
            .send({ message: "User Already Exists", success: false});
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res
            .status(200)
            .send({ message: "User Created Successfully", success: true });
    } catch (error) {
        // Handle other errors
        console.log(error);
        res
            .status(500)
            .send({ message: "Error creating user", success: false, error });
    }
});


router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (!isPasswordValid) {
            return res.status(200).send({ message: "Incorrect password", success: false });
        }else{
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })
            res.status(200).send({ message: "Login successful", success: true, data:token });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error during login", success: false, error });
    }
});

router.post('/get-user-info-by-id', authMiddleware, async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false });
        }else{
            res.status(200).send({ success: true, 
                data: user
             });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});



router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            phoneNumber,
            address,
            signature,
            specialization,
            experience,
            feePerConsultation,
            timings
        } = req.body;

        // Validate required fields
        if (!userId || !firstName || !lastName || !phoneNumber || !address || !signature || !specialization || !experience || !feePerConsultation || !timings) {
            return res.status(400).send({ message: 'All fields are required', success: false });
        }

        const newDoctor = new Doctor({
            userId,
            firstName,
            lastName,
            phoneNumber,
            address,
            signature,
            specialization,
            experience,
            feePerConsultation,
            timings,
            status: 'pending',
        });

        // Log the new doctor information for debugging/verification
        console.log('New Doctor Info:', newDoctor);

        await newDoctor.save();

        // Find the admin user
        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            return res.status(404).send({ message: 'Admin user not found', success: false });
        }

        // Update admin's unseen notifications
        adminUser.unseenNotifications.push({
            type: 'new-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: `${newDoctor.firstName} ${newDoctor.lastName}`,
            },
            onClickPath: '/admin/doctors',
        });

        await adminUser.save();

        res.status(200).send({ message: 'Doctor account has been applied successfully', success: true });
    } catch (error) {
        console.error('Error applying for doctor account:', error);
        res.status(500).send({ message: 'Error applying for doctor account', success: false, error: error.message });
    }
});

router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
    try {
        
        const user = await User.findOne({ _id: req.body.userId });
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;
        const updatedUser = await user.save()
        updatedUser.password = undefined;
        res.status(200).send({ success: true, 
            message: "All notifications marked as seen",
            data: updatedUser,
         });


    } catch (error) {
        console.error('Error applying for doctor account:', error);
        res.status(500).send({ message: 'Error applying for doctor account', success: false, error: error.message });
    }
});

router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
    try {
        
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({ success: true, 
            message: "All notifications are Deleted",
            data: updatedUser,
         });


    } catch (error) {
        console.error('Error applying for doctor account:', error);
        res.status(500).send({ message: 'Error applying for doctor account', success: false, error: error.message });
    }
});

router.get('/get-all-approved-doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({status: "approved"});
        res.status(200).send({ message: 'Doctors fetched successfully', success: true, data: doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send({ message: 'Error fetching doctors', success: false, error: error.message });
    }
});


router.post('/book-appointment', authMiddleware, async (req, res) => {
    try {
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save();
        
        //pushing notifications to doctor based on userId
        const user = await User.findOne({ _id: req.body.doctorInfo.userId });


        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `A new appointment request has been made by ${req.body.userInfo.name}`,
            onClickPath: '/doctor/appointments'
        });
        await user.save();

        res.status(200).send({ message: 'Appointment booked successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'Error at Booking Appointment', success: false, error: error.message });
    }
});


router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
    try {
        const appointments = await appointmentModel.find({userId: req.body.userId});
        res.status(200).send({ message: 'Appointments fetched successfully', success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send({ message: 'Error fetching appointments', success: false, error: error.message });
    }
});


module.exports = router;