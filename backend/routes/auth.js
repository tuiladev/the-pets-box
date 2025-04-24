const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kiểm tra kết nối MongoDB (giữ nguyên)
router.get('/check-connection', async (req, res) => {
    try {
        // Thử tìm một user bất kỳ
        const user = await User.findOne();
        res.json({
            status: 'success',
            message: 'MongoDB connected successfully',
            database: 'petshop',
            collections: ['users', 'pets', 'medicalrecords', 'vaccines', 'orders', 'products'],
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'MongoDB connection failed',
            error: error.message,
        });
    }
});

// Register - đơn giản chỉ với email/phone và mật khẩu
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Kiểm tra user đã tồn tại chưa
        let existingUser;
        if (email) {
            existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }
        }
        if (phone) {
            existingUser = await User.findOne({ phone });
            if (existingUser) {
                return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
            }
        }

        // Tạo user mới (không cần hash mật khẩu vì đã xử lý trong pre-save hook)
        const user = new User({
            fullName,
            email,
            phone,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
        });

        await user.save();

        // Tạo token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d', // Token có hiệu lực 1 ngày
        });

        // Trả về thông tin user (không bao gồm password)
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            membershipLevel: user.membershipLevel,
            points: user.points,
            memberSince: user.memberSince,
            tier: user.tier,
        };

        res.status(201).json({ token, user: userResponse });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login - đơn giản với email/phone và mật khẩu
router.post('/login', async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Tìm user theo email hoặc phone
        const user = await User.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null }
            ]
        });
        if (!user) {
            return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
        }

        // Cập nhật thời gian đăng nhập cuối
        user.lastLogin = new Date();
        await user.save();
        // Tạo JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ token, user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            membershipLevel: user.membershipLevel,
            points: user.points,
            tier: user.tier
        }});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware xác thực đơn giản
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Không có token, từ chối truy cập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Lấy thông tin người dùng hiện tại
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;

