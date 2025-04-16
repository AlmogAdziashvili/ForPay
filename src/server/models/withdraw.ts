import { model, Schema } from 'mongoose';

const withdrawSchema = new Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default model('Withdraw', withdrawSchema);