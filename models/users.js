const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        fname: { type: String, required: true},
        lname: { type: String, required: true},
    },
    phone: {
        type: Number,
        required: true,
        min: 10,
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
        zip: {
            type: String,
            required: false
        },
        street: {
            type: String,
            required: false
        },
        block: { type: String },
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 8,
        maxLength: 32
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
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
    const saltRounds = 10;

    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(saltRounds, function(saltError, salt) {
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

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error) {
            return callback(error)
        } else {
            callback(null, isMatch)
        }
    })
}

const User = mongoose.model('User', UserSchema);

module.exports = User;