import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { StudentTuition } from "@/models/studentTuition";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get userId from the URL
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { message: 'Invalid User ID format' },
                { status: 400 }
            );
        }

        // Find student tuition data
        const studentTuition = await StudentTuition.findOne({ 
            userId: new mongoose.Types.ObjectId(userId) 
        });

        if (!studentTuition) {
            return NextResponse.json(
                { message: 'No tuition record found for this user' },
                { status: 404 }
            );
        }

        return NextResponse.json(studentTuition);

    } catch (error) {
        console.error('Error fetching student tuition:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}