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
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = hashSync(user.password, 10);
    next();
});

export default model('User', userSchema);