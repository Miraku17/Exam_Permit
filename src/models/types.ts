export interface ITerm {
  name: "Pre-Midterm" | "Midterm" | "Pre-Final" | "Final";
  due: number;
  paid: number;
  balance: number;
}

export interface ITotalCourseFee {
  lecture: number;
  laboratory: number;
  total: number;
}

export interface ICourse {
  courseCode: string;
  academicUnits: number;
  lecValue: number;
  labValue: number;
  status: "Regular" | "Irregular";
  terms: ITerm[];
  totalCourseFee: ITotalCourseFee;
  // totalPayments: number;
  // remainingBalance: number;
}

export interface ISemester {
  programCode: string;
  semester: 1 | 2;
  year: number;
  courses: ICourse[];
}
