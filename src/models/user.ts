import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            "Please provide a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        minLength: [3, "Fullname must be at least 3 characters long"],
        maxLength: [50, "Fullname must be at most 50 characters long"]
    },
    course: { 
        type: String,
        required: [true, "Course is required"],
    },
    yearLevel: {
        type: String,
        required: [true, "yearLevel is required"],
    },
});

// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;