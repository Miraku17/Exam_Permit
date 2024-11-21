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
        const user = await User.create({
            email,
            password: hashedPassword,
            fullname,
            course,
            yearLevel,
            role: role
        });

        // Format and create StudentTuition data
        const studentTuitionData = {
            userId: user._id, // Link to the created user
            semesters: semesters.map(sem => {
                const termTotal = sem.totals.grandTotal;
                const termPayments = [
                    {
                        term: 'Pre-Midterm',
                        dueAmount: termTotal * 0.3,
                        paid: 0,
                        balance: termTotal * 0.3
                    },
                    {
                        term: 'Midterm',
                        dueAmount: termTotal * 0.3,
                        paid: 0,
                        balance: termTotal * 0.3
                    },
                    {
                        term: 'Pre-Final',
                        dueAmount: termTotal * 0.2,
                        paid: 0,
                        balance: termTotal * 0.2
                    },
                    {
                        term: 'Final',
                        dueAmount: termTotal * 0.2,
                        paid: 0,
                        balance: termTotal * 0.2
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
            role: user.role
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