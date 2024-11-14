// app/api/seed/[program]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Semester } from '@/models/Semester';

const coursePrograms = {
  BSA: {
    firstYear: {
      firstSemester: [
        'PRIACC130', 'UDSELF030', 'READPH030', 'ARTAPP030', 'SCITES030',
        'LITERA03Z', 'REEDFR1C0', 'PAFIT1020', 'ENRICH110', 'NSTP**130'
      ],
      secondSemester: [
        'COFRAC230', 'INTONE230', 'MAGECO130', 'OPEMAN130', 'ITAPPB13Z',
        'OBLICO130', 'CWORLD030', 'PURCOM030', 'REVISA030', 'PAFIT2120', 'NSTP**230'
      ]
    }
  },
  BSHM: {
    secondYear: {
      firstSemester: [
        'TORLAW230', 'FODOPR23Q', 'BUSTEC03S', 'MULDIC030', 'TORHMA230',
        'MATHMW030', 'CWORLD030', 'PAFIT322A'
      ],
      secondSemester: [
        'QUASER230', 'LODOPR23Q', 'MENREV030', 'ELECHM230', 'TECWRI130',
        'ARTAPP030', 'PAFIT4220', 'REEDCG2C0'
      ]
    }
  }
};

function generateRandomValues() {
  const academicUnits = Math.floor(Math.random() * 4) + 1;
  const lecValue = (Math.floor(Math.random() * 2000) + 1000).toFixed(2);
  const labValue = Math.random() < 0.5 ? 0 : (Math.floor(Math.random() * 2000) + 500).toFixed(2);
  const totalFee = parseFloat(lecValue) + parseFloat(labValue);
  const termPayment = (totalFee / 4).toFixed(2);
  
  return { academicUnits, lecValue, labValue, termPayment, totalFee };
}

function createCourseStructure(courseCode: string) {
  const values = generateRandomValues();
  return {
    courseCode,
    academicUnits: values.academicUnits,
    lecValue: parseFloat(values.lecValue),
    labValue: parseFloat(values.labValue),
    status: 'Regular',
    terms: [
      {
        name: 'Pre-Midterm',
        due: parseFloat(values.termPayment),
        paid: 0,
        balance: parseFloat(values.termPayment)
      },
      {
        name: 'Midterm',
        due: parseFloat(values.termPayment),
        paid: 0,
        balance: parseFloat(values.termPayment)
      },
      {
        name: 'Pre-Final',
        due: parseFloat(values.termPayment),
        paid: 0,
        balance: parseFloat(values.termPayment)
      },
      {
        name: 'Final',
        due: parseFloat(values.termPayment),
        paid: 0,
        balance: parseFloat(values.termPayment)
      }
    ],
    totalCourseFee: {
      lecture: parseFloat(values.lecValue),
      laboratory: parseFloat(values.labValue),
      total: parseFloat(values.totalFee)
    },
    totalPayments: 0,
    remainingBalance: parseFloat(values.totalFee)
  };
}

export async function POST(
  request: Request,
  { params }: { params: { program: string } }
) {
  try {
    await connectDB();
    const { program } = params;
    
    if (!coursePrograms[program]) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    await Semester.deleteMany({ programCode: program });

    const semesters = [];
    const programData = coursePrograms[program];

    for (const [year, yearData] of Object.entries(programData)) {
      const yearNumber = year === 'firstYear' ? 1 : 2;
      
      if (yearData.firstSemester) {
        semesters.push({
          programCode: program,
          semester: 1,
          year: yearNumber,
          courses: yearData.firstSemester.map(code => createCourseStructure(code))
        });
      }
      
      if (yearData.secondSemester) {
        semesters.push({
          programCode: program,
          semester: 2,
          year: yearNumber,
          courses: yearData.secondSemester.map(code => createCourseStructure(code))
        });
      }
    }

    await Semester.insertMany(semesters);
    return NextResponse.json({ 
      message: `Seeding completed for ${program}`,
      semesters 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}