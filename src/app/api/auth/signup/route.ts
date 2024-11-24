import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user'
import { Semester } from '@/models/Semester';
import { StudentTuition } from '@/models/studentTuition';
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const { fullname, email, password, course, yearLevel, role = 'student' } = await request.json();

    if (!password || password.length < 6) {
        return NextResponse.json(
            { message: 'Password must be at least 6 characters' }, 
            { status: 400 }
        );
    }

    try {
        await connectDB();
        
        const userFound = await User.findOne({ email });
        if (userFound) {
            return NextResponse.json(
                { message: 'Email already exists' }, 
                { status: 400 }
            );
        }

        const programCode = course.match(/\((.*?)\)/)?.[1] || course;
        const semesters = await Semester.find({ programCode });

        // Create the user first
        const hashedPassword = await bcrypt.hash(password, 12);
        const data = {
            email: email,
            password: hashedPassword,
            fullname: fullname,
            course: course,
            yearLevel: yearLevel,
            role: 'student',
        };
        const user = await User.create(data);
        console.log('Created User:', user);

        // Format and create StudentTuition data with three terms
        const studentTuitionData = {
            userId: user._id,
            semesters: semesters.map(sem => {
                const termTotal = sem.totals.grandTotal;
                const termPayments = [
                    {
                        term: '1st Term',
                        dueAmount: termTotal * 0.4, // 40% for first term
                        paid: 0,
                        balance: termTotal * 0.4
                    },
                    {
                        term: '2nd Term',
                        dueAmount: termTotal * 0.3, // 30% for second term
                        paid: 0,
                        balance: termTotal * 0.3
                    },
                    {
                        term: '3rd Term',
                        dueAmount: termTotal * 0.3, // 30% for third term
                        paid: 0,
                        balance: termTotal * 0.3
                    }
                ];

                return {
                    semester: sem.semester,
                    terms: termPayments,
                    totalPayments: 0,
                    remainingBalance: termTotal
                };
            })
        };

        // Create StudentTuition record
        const studentTuition = await StudentTuition.create(studentTuitionData);

        console.log('Created Student Tuition Record:', JSON.stringify(studentTuition, null, 2));

        return NextResponse.json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            course: user.course,
            yearLevel: user.yearLevel,
            tuitionData: studentTuition,
            role: user?.role,
        });

    } catch (error) {
        console.log('Error:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }
    }
}