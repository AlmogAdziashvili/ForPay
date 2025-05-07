import { model, Schema } from 'mongoose';

const requestSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    identificationNumber: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

export default model('Request', requestSchema);