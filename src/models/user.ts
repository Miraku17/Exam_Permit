import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
        role: {
            type: String,
            default: 'student',
            enum: ['student', 'admin'],
            required: false
        }
    }, 
    {
        timestamps: true,
        strict: false,
    }
);

// Delete the existing model if it exists
delete mongoose.models.User;

// Create the model
const User = mongoose.model('User', userSchema);

export default User;