import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  courseCode: string;
  academicUnits: number;
  lecValue: number;
  labValue: number;
  status: string;
}

interface Payment {
  term: string;
  due: number;
  paid: number;
  balance: number;
}

interface TuitionDataProps {
  data: {
    courses: Course[];
  };
}

interface PermitData {
  name: string;
  college: string;
  semester: string;
  schoolYear: string;
  courses: {
    code: string;
    section: string;
  }[];
}

const TuitionData: React.FC<TuitionDataProps> = ({ data }) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const courseData: Course[] = data.courses;

  const paymentData: Payment[] = [
    { term: "Pre-Midterm", due: 1500.0, paid: 1500.0, balance: 1500.0 },
    { term: "Midterm", due: 1500.0, paid: 1500.0, balance: 1500.0 },
    { term: "Pre-Final", due: 1500.0, paid: 1500.0, balance: 1500.0 },
    { term: "Final", due: 1500.0, paid: 1500.0, balance: 1500.0 },
  ];

  const handleRequestPermit = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const permitData: PermitData = {
        name: session?.user?.fullname as string,
        college: session?.user?.course as string,
        semester: '1st',
        schoolYear: '2024-2025',
        courses: courseData.map(course => ({
          code: course.courseCode,
          section: 'C20'
        }))
      };
  
      const response = await fetch('/api/send-permit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permitData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to send permit request');
      }
  
      toast({
        title: "Success",
        description: "Exam permit has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send permit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (data && data?.courses?.length) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>1ST Semester</CardTitle>
          <div className="text-blue-800 font-bold mt-2">
            {session?.user && `${session.user.fullname} - ${session.user.course}`}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Course Fees Section */}
            <div>
              <h3 className="text-blue-800 font-bold mb-2">COURSE FEES</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Academic Units</TableHead>
                        <TableHead>Lec Value</TableHead>
                        <TableHead>Lab Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseData.map((course, index) => (
                        <TableRow key={index}>
                          <TableCell>{course.courseCode}</TableCell>
                          <TableCell>{course.academicUnits}</TableCell>
                          <TableCell>{course.lecValue.toFixed(2)}</TableCell>
                          <TableCell>{course.labValue.toFixed(2)}</TableCell>
                          <TableCell className="text-green-600">
                            {course.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-blue-900 text-white p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Total Course Fee</h4>
                  <div className="space-y-1 text-sm">
                    <div>Lecture: 10,000</div>
                    <div>Laboratory: 10,000</div>
                    <div className="font-bold">Total: 17,000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableHead>Due*</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentData.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{payment.term}</TableCell>
                        <TableCell>{payment.due.toFixed(2)}</TableCell>
                        <TableCell>{payment.paid.toFixed(2)}</TableCell>
                        <TableCell>{payment.balance.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-xs h-7 px-2"
                            onClick={handleRequestPermit}
                            disabled={isLoading}
                          >
                            {isLoading ? "Sending..." : "Request Permit"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">
                        {paymentData
                          .reduce((sum, p) => sum + p.due, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {paymentData
                          .reduce((sum, p) => sum + p.paid, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {paymentData
                          .reduce((sum, p) => sum + p.balance, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-900 text-white p-4 rounded-lg">
                  <div className="font-bold">Total Payments:</div>
                  <div>0.00</div>
                </div>

                <div className="bg-red-500 text-white p-4 rounded-lg">
                  <div className="font-bold">Remaining Balance</div>
                  <div>10.00</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TuitionData;