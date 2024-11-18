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
  totalPayments: number;
  remainingBalance: number;
}

export interface ISemesterTotals {
  totalLecture: number;
  totalLaboratory: number;
  grandTotal: number;
  termPayments: {
    preMidterm: number;
    midterm: number;
    preFinal: number;
    final: number;
  };
}

export interface ISemester {
  programCode: string;
  semester: 1 | 2;
  year: number;
  courses: ICourse[];
  totals: ISemesterTotals;

}


export interface IPayment {
  studentId: string,
  transactionId: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  referenceNumber: string;
  paymentGateway: "GCash";
  amount: number;
  proofOfPaymentUrl: string;
  status: "pending" | "verified" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}