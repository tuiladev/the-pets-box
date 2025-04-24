const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    pointsRedeemed: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'transfer', 'momo', 'zalopay'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        district: String,
        province: String
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Tự tạo số đơn hàng trước khi lưu
OrderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        
        const prefix = `ORD${year}${month}${day}`;
        
        // Tìm đơn hàng mới nhất có cùng prefix để tăng số thứ tự
        const lastOrder = await this.constructor.findOne({
            orderNumber: { $regex: `^${prefix}` }
        }).sort({ orderNumber: -1 });
        
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.substr(-4));
            sequence = lastSequence + 1;
        }
        
        this.orderNumber = `${prefix}${('0000' + sequence).slice(-4)}`;
    }
    next();
});

// Tính điểm tích lũy dựa trên cấp thành viên
OrderSchema.methods.calculatePoints = function(membershipLevel) {
    // Cơ chế: 1 điểm = 1.000 VNĐ
    let multiplier = 1;
    
    switch(membershipLevel) {
        case 'Platinum':
            multiplier = 2;
            break;
        case 'Gold':
            multiplier = 1.5;
            break;
        case 'Silver':
            multiplier = 1.2;
            break;
        default:
            multiplier = 1;
    }
    
    this.pointsEarned = Math.floor(this.totalAmount / 1000 * multiplier);
    return this.pointsEarned;
};

module.exports = mongoose.model('Order', OrderSchema);