const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    examDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    treatment: {
        type: String,
        trim: true
    },
    medications: [{
        name: String,
        dosage: String,
        instructions: String
    }],
    notes: {
        type: String,
        trim: true
    },
    vet: {
        name: String,
        contact: String
    },
    nextAppointment: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);