import React, { useState, useEffect } from "react";
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

interface Totals {
  totalLecture: number;
  totalLaboratory: number;
  grandTotal: number;
}

interface Term {
  term: string;
  dueAmount: number;
  paid: number;
  balance: number;
  _id: string;
}

interface Semester {
  semester: number;
  terms: Term[];
  totalPayments: number;
  remainingBalance: number;
  _id: string;
}

interface StudentTuition {
  _id: string;
  userId: string;
  semesters: Semester[];
}

interface TuitionDataProps {
  data: {
    courses: Course[];
    totals: Totals;
  };
  studentTuition?: StudentTuition;
  selectedTerm: "1st" | "2nd";
}

const TuitionData: React.FC<TuitionDataProps> = ({
  data,
  studentTuition,
  selectedTerm,
}) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const courseData: Course[] = data?.courses || [];
  const semesterIndex = selectedTerm === "1st" ? 0 : 1;
  const currentSemester = studentTuition?.semesters[semesterIndex];

  const title = selectedTerm === "1st"? "1st Semester" : "2nd Semester";

  useEffect(() => {
    console.log("Student Tuition Data:", studentTuition);
  }, [studentTuition]);

  const canRequestPermit = (term: Term) => {
    return term.balance === 0;
  };

  const handleRequestPermit = async (term: Term): Promise<void> => {
    setIsLoading(true);
    try {
      const permitData = {
        email: session?.user?.email as string,
        name: session?.user?.fullname as string,
        college: session?.user?.course as string,
        semester: selectedTerm,
        term: term.term,
        schoolYear: "2024-2025",
        courses: courseData.map((course) => ({
          code: course.courseCode,
          section: "C20",
        })),
      };

      const response = await fetch("/api/send-permit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permitData),
      });

      if (!response.ok) {
        throw new Error("Failed to send permit request");
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
          <CardTitle>{title}</CardTitle>
          <div className="text-blue-800 font-bold mt-2">
            {session?.user &&
              `${session.user.fullname} - ${session.user.course}`}
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
                    <div>Lecture: ₱{data.totals?.totalLecture.toFixed(2)}</div>
                    <div>
                      Laboratory: ₱{data.totals?.totalLaboratory.toFixed(2)}
                    </div>
                    <div className="font-bold">
                      Total: ₱{data.totals?.grandTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule Section */}
            {currentSemester && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term</TableHead>
                        <TableHead>Due Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSemester.terms.map((term, index) => (
                        <TableRow key={term._id}>
                          <TableCell>{term.term}</TableCell>
                          <TableCell>
                            ₱
                            {term.dueAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell>
                            ₱
                            {term.paid.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell>
                            ₱
                            {term.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-xs h-7 px-2"
                              onClick={() => handleRequestPermit(term)}
                              disabled={!canRequestPermit(term)}
                              >
                              {isLoading ? "Sending..." : "Request Permit"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="font-bold">
                          ₱
                          {currentSemester.terms
                            .reduce((sum, term) => sum + term.dueAmount, 0)
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </TableCell>
                        <TableCell className="font-bold">
                          ₱
                          {currentSemester.totalPayments.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </TableCell>
                        <TableCell className="font-bold">
                          ₱
                          {currentSemester.remainingBalance.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-900 text-white p-4 rounded-lg">
                    <div className="font-bold">Total Payments:</div>
                    <div>
                      ₱
                      {currentSemester.totalPayments.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  <div className="bg-red-500 text-white p-4 rounded-lg">
                    <div className="font-bold">Remaining Balance</div>
                    <div>
                      ₱
                      {currentSemester.remainingBalance.toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TuitionData;
