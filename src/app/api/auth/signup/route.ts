import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user'
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {

    const { fullname, email, password, course, yearLevel } = await request.json();

    if (!password || password.length < 6) return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });

    try {
        
        await connectDB();
        console.log('here');
        const userFound = await User.findOne({ email });

        if (userFound) return NextResponse.json({ message: 'Email already exists' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('here2');
        // Create new user
        const user = await User.create({
            email,
            password: hashedPassword,
            fullname,
            course,
            yearLevel
        });

        console.log(user);

        return NextResponse.json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            course: user.course,
            yearLevel: user.yearLevel
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400,
                }
            );
        }
    }
}