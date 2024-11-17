import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Semester } from "@/models/Semester";

export async function GET(req: NextRequest) {
    // const { programCode, sem, year} = await req.json();
    const url = new URL(req.url);
    const programCode = url.searchParams.get('courseCode');
    const sem = url.searchParams.get('term');
    const year = url.searchParams.get('year');

    try {
        await connectDB();
        const data = {programCode: programCode, semester: sem[0], year: year};
        console.log('data', data);
        const semester = await Semester.findOne(data);

        console.log('semester here', semester);

        if (!semester) return NextResponse.json({ message: 'Not found yet' }, { status: 400 });

        return NextResponse.json({
            _id: semester._id,
            programCode: programCode,
            semester: sem,
            year: year,
            courses: semester.courses,
        }, { status: 200 })
    } catch (error) {
        console.error("Payment submission error:", error);
        return NextResponse.json(
        {
            message: error.message || "Error finding tuition details",
        },
            { status: 500 }
        );
    }
}