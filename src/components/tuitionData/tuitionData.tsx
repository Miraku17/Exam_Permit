import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';

const TuitionData = () => {
  const { data: session, status } = useSession();

  const courseData = [
    { code: 'PRIACC130', units: 1.0, lecValue: 1500.00, labValue: 0.00, status: 'Regular' },
    { code: 'PRIACC130', units: 1.0, lecValue: 1500.00, labValue: 1500.00, status: 'Regular' },
    { code: 'PRIACC130', units: 1.0, lecValue: 1500.00, labValue: 0.00, status: 'Regular' },
    { code: 'PRIACC130', units: 1.0, lecValue: 1500.00, labValue: 0.00, status: 'Regular' },
    { code: 'PRIACC130', units: 1.0, lecValue: 1500.00, labValue: 0.00, status: 'Regular' },
  ];

  const paymentData = [
    { term: 'Pre-Midterm', due: 1500.00, paid: 1500.00, balance: 1500.00 },
    { term: 'Midterm', due: 1500.00, paid: 1500.00, balance: 1500.00 },
    { term: 'Pre-Final', due: 1500.00, paid: 1500.00, balance: 1500.00 },
    { term: 'Final', due: 1500.00, paid: 1500.00, balance: 1500.00 },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>1ST Semester</CardTitle>
        <div className="text-blue-800 font-bold mt-2">
          {/* [18103903] CARANAO-O, CYRUS NOEL - BS CPE */}
          { session && session.user && session.user.fullname + ' - ' + session.user.course}
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
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.units}</TableCell>
                        <TableCell>{course.lecValue.toFixed(2)}</TableCell>
                        <TableCell>{course.labValue.toFixed(2)}</TableCell>
                        <TableCell className="text-green-600">{course.status}</TableCell>
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
                          disabled={payment.balance > 0}
                        >
                          Request Permit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">{paymentData.reduce((sum, p) => sum + p.due, 0).toFixed(2)}</TableCell>
                    <TableCell className="font-bold">{paymentData.reduce((sum, p) => sum + p.paid, 0).toFixed(2)}</TableCell>
                    <TableCell className="font-bold">{paymentData.reduce((sum, p) => sum + p.balance, 0).toFixed(2)}</TableCell>
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
};

export default TuitionData;