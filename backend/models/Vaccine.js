const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    dateAdministered: {
        type: Date,
        required: true,
        default: Date.now
    },
    nextDueDate: {
        type: Date
    },
    administeredBy: {
        name: String,
        contact: String
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vaccine', VaccineSchema);