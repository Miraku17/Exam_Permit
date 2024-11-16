"use client";
import React from 'react';
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
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";

// Sample transaction data
const transactions = [
  {
    invoice: "INV001",
    date: "11 Nov, 2024",
    method: "GCASH",
    status: "verified",
    amount: 5000.00,
  },
  {
    invoice: "INV002",
    date: "11 Nov, 2024",
    method: "GCASH",
    status: "pending",
    amount: 5000.00,
  },
  {
    invoice: "INV003",
    date: "11 Nov, 2024",
    method: "GCASH",
    status: "verified",
    amount: 5000.00,
  },
];

const TransactionHistory = () => {
  // Calculate total amount
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  // Mobile view renderer
  const renderMobileCard = (transaction) => (
    <div key={transaction.invoice} className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{transaction.invoice}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
        <Badge 
          variant={transaction.status === "verified" ? "success" : "secondary"}
          className={
            transaction.status === "verified" 
              ? "bg-green-100 text-green-800 hover:bg-green-100" 
              : "bg-gray-200 text-gray-800 hover:bg-gray-200"
          }
        >
          {transaction.status === "verified" ? "Verified" : "Pending"}
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-600">{transaction.method}</span>
        <span className="font-medium">₱ {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-primaryBlue text-xl">
            TRANSACTION HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop view */}
          <div className="hidden md:block">
            <ScrollArea className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.invoice}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.status === "verified" ? "success" : "secondary"}
                          className={
                            transaction.status === "verified" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-gray-200 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {transaction.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₱ {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-gray-100">
                    <TableCell colSpan={4} className="font-medium">
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
              {transactions.map(renderMobileCard)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;