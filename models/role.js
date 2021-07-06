const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        default: "user",
        enum: ["user", "staff", "admin"]
    },
})

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;