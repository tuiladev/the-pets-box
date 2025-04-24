const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true, // Cho phép nhiều null (khi dùng phone để đăng nhập)
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // Cho phép nhiều null (khi dùng email để đăng nhập)
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User',
    },
    addresses: [{
        type: {
            type: String,
            enum: ['home', 'company'],
            default: 'home'
        },
        fullName: String,
        phone: String,
        street: String,
        district: String,
        city: String,
        province: String,
        zipCode: String,
        isDefault: {
            type: Boolean,
            default: false
        },
        notes: String
    }],
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    paymentMethods: [{
        type: {
            type: String,
            enum: ['card', 'bank', 'momo', 'zalopay'],
            required: true
        },
        // Thông tin cho thẻ
        cardNumber: String,
        cardName: String,
        expiryDate: String,
        // Thông tin cho ngân hàng
        bankName: String,
        accountNumber: String,
        accountName: String,
        // Thông tin chung
        isDefault: {
            type: Boolean,
            default: false
        },
        lastUsed: Date
    }],
    membershipLevel: {
        type: String,
        enum: ['Standard', 'Silver', 'Gold', 'Platinum'],
        default: 'Standard',
    },
    points: {
        type: Number,
        default: 0,
    },
    pointsExpiryDate: {
        type: Date,
        default: function() {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1); // Điểm có hạn 12 tháng
            return date;
        }
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    memberSince: {
        type: Date,
        default: Date.now,
    },
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze',
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook', 'zalo'],
        default: 'local',
    },
    googleId: String,
    facebookId: String,
    zaloId: String,
    lastLogin: Date,
}, { timestamps: true });

// Pre-save hook để hash mật khẩu
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method để kiểm tra mật khẩu
UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Method để cập nhật cấp thành viên
UserSchema.methods.updateMembershipLevel = function() {
    if (this.totalSpent > 10000000) {
        this.membershipLevel = 'Platinum';
        this.tier = 'platinum';
    } else if (this.totalSpent > 5000000) {
        this.membershipLevel = 'Gold';
        this.tier = 'gold';
    } else if (this.totalSpent > 2000000) {
        this.membershipLevel = 'Silver';
        this.tier = 'silver';
    } else {
        this.membershipLevel = 'Standard';
        this.tier = 'bronze';
    }
};
module.exports = mongoose.model('User', UserSchema);
