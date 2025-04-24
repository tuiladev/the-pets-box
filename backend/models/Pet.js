const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        trim: true // Loại: chó, mèo, cá...
    },
    breed: {
        type: String,
        trim: true // Giống: siamese, persian...
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown'
    },
    dateOfBirth: {
        type: Date
    },
    age: {
        type: Number
    },
    weight: {
        type: Number
    },
    image: {
        type: String
    },
    furColor: {
        type: String,
        trim: true
    },
    // Tham chiếu đến lịch sử khám bệnh
    medicalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord'
    }],
    // Tham chiếu đến vaccine
    vaccines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vaccine'
    }]
}, { timestamps: true });

// Pre-save hook để tính tuổi tự động
PetSchema.pre('save', function(next) {
    if (this.dateOfBirth) {
        const ageDifMs = Date.now() - this.dateOfBirth.getTime();
        const ageDate = new Date(ageDifMs);
        this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    next();
});

module.exports = mongoose.model('Pet', PetSchema);