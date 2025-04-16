import { model, Schema } from 'mongoose';

const transferSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

export default model('Transfer', transferSchema);