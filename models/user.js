import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        fname: { type: String, required: true},
        lname: { type: String, required: true},
    },
    phone: { type: Number, required: true, min: 10, max: 10},
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        zip: { type: String, required: false},
        street: { type: String, required: false},
        block: { type: String},
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 32
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

const User = mongoose.model('User', UserSchema);

export default User;