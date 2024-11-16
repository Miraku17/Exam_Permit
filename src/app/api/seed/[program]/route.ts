import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Semester } from "@/models/Semester";

const coursePrograms = {
  BSA: {
    firstYear: {
      firstSemester: [
        "PRIACC130",
        "UDSELF030",
        "READPH030",
        "ARTAPP030",
        "SCITES030",
        "LITERA03Z",
        "REEDFR1C0",
        "PAFIT1020",
        "ENRICH110",
        "NSTP**130",
      ],
      secondSemester: [
        "COFRAC230",
        "INTONE230",
        "MAGECO130",
        "OPEMAN130",
        "ITAPPB13Z",
        "OBLICO130",
        "CWORLD030",
        "PURCOM030",
        "REVISA030",
        "PAFIT2120",
        "NSTP**230",
      ],
    },
  },
  BSHM: {
    secondYear: {
      firstSemester: [
        "TORLAW230",
        "FODOPR23Q",
        "BUSTEC03S",
        "MULDIC030",
        "TORHMA230",
        "MATHMW030",
        "CWORLD030",
        "PAFIT322A",
      ],
      secondSemester: [
        "QUASER230",
        "LODOPR23Q",
        "MENREV030",
        "ELECHM230",
        "TECWRI130",
        "ARTAPP030",
        "PAFIT4220",
        "REEDCG2C0",
      ],
    },
  },
  BSMA: {
    secondYear: {
      firstSemester: [
        "INATWO230",
        "INCTAX130",
        "COSACC130",
        "REGFRA230",
        "STANSA23Z",
        "MATHMW030",
        "ETHICS030",
        "GENDSO030",
        "PAFIT322A",
      ],
      secondSemester: [
        "INATRE430",
        "TBLTAX230",
        "FINMGT230",
        "STRCOM230",
        "ACINSY23Q",
        "MGTSCI130",
        "PARCOL330",
        "STRMAN130",
        "REEDCG2C0",
        "PAFIT4220",
      ],
    },
  },
  BSREM: {
    firstYear: {
      firstSemester: [
        "MICMAC130",
        "PHBMGT130",
        "LITERA03Z",
        "UDSELF030",
        "REEDFR1C0",
        "PAFIT01020",
        "ENRICH110",
        "NSTP**130",
      ],
      secondSemester: [
        "MARMAN130",
        "CORPAC230",
        "ITAPPB13Z",
        "FUNREM230",
        "MATHMW030",
        "PAFIT2120",
        "NSTP**230",
      ],
    },
  },
  "BSBA-FM": {
    thirdYear: {
      firstSemester: [
        "JRIZAL030",
        "ELECTFM330",
        "FINARE330",
        "BUSRES130",
        "REVISA030",
        "CWORLD030",
      ],
      secondSemester: [
        "REEDLC3C0",
        "FEASIB230",
        "INCTAX130",
        "ELECTFM430",
        "LOGIC030",
        "PURCOM030",
        "ETHICS030",
        "INFOMA230",
      ],
    },
  },
  "BSBA-MM": {
    fourthYear: {
      firstSemester: [
        "REEDL4C0",
        "E-COMM13Z",
        "FORLAN130",
        "LOGIC030",
        "INBUST230",
        "STRMAN130",
      ],
      secondSemester: ["PRAMAR96W"],
    },
  },
};

function generateRandomValues() {
  const academicUnits = Math.floor(Math.random() * 4) + 1;
  const lecValue = (Math.floor(Math.random() * 2000) + 1000).toFixed(2);
  const labValue =
    Math.random() < 0.5
      ? 0
      : (Math.floor(Math.random() * 2000) + 500).toFixed(2);
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
    totalCourseFee: {
      lecture: parseFloat(values.lecValue),
      laboratory: parseFloat(values.labValue),
      total: parseFloat(values.totalFee),
    },
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
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    await Semester.deleteMany({ programCode: program });

    const semesters = [];
    const programData = coursePrograms[program];

    for (const [year, yearData] of Object.entries(programData)) {
      // Update the year mapping logic
      const yearMapping = {
        firstYear: 1,
        secondYear: 2,
        thirdYear: 3,
        fourthYear: 4
      };
      
      const yearNumber = yearMapping[year];

      if (yearData.firstSemester) {
        semesters.push({
          programCode: program,
          semester: 1,
          year: yearNumber,
          courses: yearData.firstSemester.map((code) =>
            createCourseStructure(code)
          ),
        });
      }

      if (yearData.secondSemester) {
        semesters.push({
          programCode: program,
          semester: 2,
          year: yearNumber,
          courses: yearData.secondSemester.map((code) =>
            createCourseStructure(code)
          ),
        });
      }
    }

    await Semester.insertMany(semesters);
    return NextResponse.json({
      message: `Seeding completed for ${program}`,
      semesters,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}