const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
      },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true,
      },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
        type: String,
        required: true,
      },
    signature: {
      type: String,
      required: true,
    }, 
    specialization : { // Corrected spelling
        type: String,
        required : true,
    },
    experience : {
        type: Number,
        required : true,
    },
    feePerConsultation: { // Corrected spelling
        type: Number,
        required: true
    },
    status : {
      type: String,
      default : "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema); // Corrected model name

module.exports = Doctor;
