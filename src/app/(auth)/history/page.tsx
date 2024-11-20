"use client"
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
import { ScrollArea } from "@/components/ui/scroll-area"
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

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-200 text-gray-800 hover:bg-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-4 lg:mx-0">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 lg:p-0 max-w-[1200px] mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primaryBlue text-xl text-center lg:text-left">
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
              {/* Desktop View */}
              <div className="hidden md:block">
                <ScrollArea className="rounded-md border">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Transaction ID</TableHead>
                          <TableHead className="w-[120px]">Date</TableHead>
                          <TableHead className="w-[120px]">Method</TableHead>
                          <TableHead className="w-[150px]">Reference No.</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="text-right w-[130px]">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.transactionId}>
                            <TableCell className="font-medium">
                              {payment.transactionId}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>{payment.paymentGateway}</TableCell>
                            <TableCell>{payment.referenceNumber}</TableCell>
                            <TableCell>
                              <Badge className={getStatusStyle(payment.status)}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              ₱ {payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted">
                          <TableCell colSpan={5} className="font-semibold">Total</TableCell>
                          <TableCell className="text-right font-semibold">
                            ₱ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {payments.map((payment) => (
                  <div key={payment.transactionId} 
                       className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm break-all">
                          {payment.transactionId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge className={getStatusStyle(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Method:</span>
                        <span>{payment.paymentGateway}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reference:</span>
                        <span className="text-right break-all">
                          {payment.referenceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-2 border-t">
                        <span>Amount:</span>
                        <span>
                          ₱ {payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span>
                      ₱ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
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