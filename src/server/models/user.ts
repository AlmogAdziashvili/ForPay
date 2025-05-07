import { model, Schema } from 'mongoose';
import { hashSync } from 'bcrypt';

const userSchema = new Schema({
    identificationNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    birthDate: {
        type: Date,
        required: false,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: ['USER', 'MERCHANT'],
        default: 'USER'
    },
    bankAccount: {
        type: Object,
        required: false,
        properties: {
            bankCode: {
                type: String,
                required: true
            },
            providerFriendlyId: {
                type: String,
                required: true
            },
            branch: {
                type: String,
                required: true
            },
            bban: {
                type: String,
                required: true
            }
        }
    }
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = hashSync(user.password, 10);
    next();
});

export default model('User', userSchema);