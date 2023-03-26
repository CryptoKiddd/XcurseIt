const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        required: [true, "Please Tell us Your Name"],
        type: String
    },
    email: {
        required: [true, "Please Tell us Your Email"],
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid Email']
    },

    photo: String,

    password: {
        required: [true, "Please Provide Your Password"],
        type: String,
        minlength: 6
    },
    passwordConfirm: {
        required: [true, "Please Confirm Your Password"],
        type: String,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Passwords are not the same"
        }
    },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
})
const User = mongoose.model("User", userSchema)
module.exports = User