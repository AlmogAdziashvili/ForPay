import { model, Schema } from 'mongoose';

const walletSchema = new Schema({
    name: String,
    balance: {
        type: Number,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    }
});

export default model('Wallet', walletSchema);