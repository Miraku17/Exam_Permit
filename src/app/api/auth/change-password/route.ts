import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user'
import { Semester } from '@/models/Semester';
import { StudentTuition } from '@/models/studentTuition';
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const { currentPassword, newPassword, email } = await request.json();

    if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
            { message: 'Password must be at least 6 characters' }, 
            { status: 400 }
        );
    }

    try {
        await connectDB();
        
        // Find the user
        const user = await User.findOne({ email }).select("+password");;
        
        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' }, 
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        
        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Current password is incorrect' }, 
                { status: 400 }
            );
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update the user's password
        await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedNewPassword } },
            { new: true }
        );

        return NextResponse.json(
            { message: 'Password updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.log('Error:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: 'An error occurred while updating password' },
            { status: 500 }
        );
    }
}