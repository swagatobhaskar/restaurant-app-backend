import mongoose from 'mongoose';
var bcrypt = require('bcryptjs');

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
        lowercase: true,
        unique: true,
        required: true,
        index: true,
    },
    address: {
        zip: { type: String, required: false},
        street: { type: String, required: false},
        block: { type: String},
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "staff", "admin"]
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

// we need to add a Mongoose pre middleware function to the model we just created.
// This middleware needs to salt and hash passwords before they are saved to the database.
UserSchema.pre('save', function(next){
    const user = this

    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function(saltError, salt) {
            if (saltError){
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function(hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }

                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
})

const User = mongoose.model('User', UserSchema);

export default User;