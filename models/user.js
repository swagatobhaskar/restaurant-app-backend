import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        fname: { type: String, required: true},
        lname: { type: String, required: true},
    },
    phone: {
        type: Number,
        required: true,
        min: 10,
        max: 10
    },
    email: {
        type: String,
        desc: "The user's email address.",
        trim: true,
        unique: true,
        required: true,
        index: true,
    },
    address: {
        zip: { type: String, required: false},
        street: { type: String, required: false},
        block: { type: String},
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 8,
        maxLength: 32
    }
},
{
  strict: true,     // ?
  versionKey: false,    // ?
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
});

const User = mongoose.model('User', UserSchema);

export default User;