"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface Payment {
  transactionId: string;
  fullName: string;
  emailAddress: string;
  mobileNumber: string;
  referenceNumber: string;
  paymentGateway: string;
  amount: number;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
}

const TransactionHistory = () => {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.email) return;
      
      try {
        setLoading(true);
        const email = encodeURIComponent(session.user.email);
        const response = await fetch(`/api/payments/history/${email}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }

        const data = await response.json();
        setPayments(data.payments);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session?.user?.email]);

  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Mobile view renderer
  const renderMobileCard = (payment: Payment) => (
    <div key={payment.transactionId} className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{payment.transactionId}</p>
          <p className="text-sm text-gray-500">
            {new Date(payment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
        <Badge 
          variant={payment.status === "verified" ? "success" : "secondary"}
          className={
            payment.status === "verified" 
              ? "bg-green-100 text-green-800 hover:bg-green-100" 
              : payment.status === "rejected"
              ? "bg-red-100 text-red-800 hover:bg-red-100"
              : "bg-gray-200 text-gray-800 hover:bg-gray-200"
          }
        >
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-600">{payment.paymentGateway}</span>
        <span className="font-medium">₱ {payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-primaryBlue text-xl">
            TRANSACTION HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment history found
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hidden md:block">
                <ScrollArea className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference No.</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.transactionId}>
                          <TableCell>{payment.transactionId}</TableCell>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{payment.paymentGateway}</TableCell>
                          <TableCell>{payment.referenceNumber}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={payment.status === "verified" ? "success" : "secondary"}
                              className={
                                payment.status === "verified" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : payment.status === "rejected"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-gray-200 text-gray-800 hover:bg-gray-200"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ₱ {payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Total Row */}
                      <TableRow className="bg-gray-100">
                        <TableCell colSpan={5} className="font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              {/* Mobile view */}
              <div className="md:hidden">
                <div className="space-y-4">
                  {payments.map(renderMobileCard)}
                  {/* Mobile Total */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">
                        ₱ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;