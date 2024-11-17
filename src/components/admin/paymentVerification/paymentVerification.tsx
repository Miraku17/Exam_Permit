import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X, ExternalLink, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentHistory {
  _id: string;
  transactionId: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  amount: number;
  status: string;
  createdAt: string;
  referenceNumber: number;
  proofOfPaymentUrl: string;
}

interface PaymentVerificationTableProps {
  payments: PaymentHistory[];
  onAccept?: (transactionId: string) => Promise<void>;
  onReject?: (transactionId: string) => Promise<void>;
}

const PaymentVerificationTable = ({ 
  payments, 
  onAccept, 
  onReject
}: PaymentVerificationTableProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<{
    payment: PaymentHistory;
    action: 'accept' | 'reject';
  } | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Transaction Details</th>
                <th className="px-4 py-2 text-left">Student Info</th>
                <th className="px-4 py-2 text-left">Contact Details</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-center">Proof</th>
                <th className="px-4 py-2 text-center">Status</th>
                {(onAccept || onReject) && <th className="px-4 py-2 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="space-y-1">
                      <p className="font-medium">TXN: {payment.transactionId}</p>
                      <p className="text-sm text-gray-500">
                        REF: {payment.referenceNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <p className="font-medium">{payment.fullName}</p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="space-y-1">
                      <p className="text-sm">{payment.emailAddress}</p>
                      <p className="text-sm text-gray-500">{payment.mobileNumber}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    ₱{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {payment.proofOfPaymentUrl && (
                      <button
                        onClick={() => setSelectedImage(payment.proofOfPaymentUrl)}
                        className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition-colors"
                        title="View Proof of Payment"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  {(onAccept || onReject) && payment.status === 'pending' && (
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        {onReject && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmationData({ 
                              payment, 
                              action: 'reject' 
                            })}
                            className="h-8 px-2"
                            title="Reject Payment"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        {onAccept && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setConfirmationData({ 
                              payment, 
                              action: 'accept' 
                            })}
                            className="h-8 px-2"
                            title="Accept Payment"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payment records found
            </div>
          )}
        </div>

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Proof of Payment</DialogTitle>
            </DialogHeader>
            <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={selectedImage || ''} 
                alt="Proof of Payment" 
                className="object-contain w-full h-full"
              />
              <a 
                href={selectedImage || ''} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <AlertDialog 
          open={!!confirmationData} 
          onOpenChange={() => setConfirmationData(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmationData?.action === 'accept' ? 'Accept Payment' : 'Reject Payment'}
              </AlertDialogTitle>
              <div className="text-sm text-muted-foreground">
                <div className="mb-4">
                  Are you sure you want to {confirmationData?.action} the payment from{' '}
                  <span className="font-medium">{confirmationData?.payment?.fullName}</span> for{' '}
                  <span className="font-medium">₱{confirmationData?.payment?.amount.toLocaleString()}</span>?
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <div>Transaction ID: {confirmationData?.payment?.transactionId}</div>
                  <div>Reference Number: {confirmationData?.payment?.referenceNumber}</div>
                  <div>Contact: {confirmationData?.payment?.mobileNumber}</div>
                  <div>Email: {confirmationData?.payment?.emailAddress}</div>
                  <div>Date: {confirmationData?.payment?.createdAt && 
                    new Date(confirmationData.payment.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={confirmationData?.action === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                onClick={() => {
                  if (confirmationData?.action === 'accept' && onAccept) {
                    onAccept(confirmationData.payment.transactionId);
                  } else if (confirmationData?.action === 'reject' && onReject) {
                    onReject(confirmationData.payment.transactionId);
                  }
                  setConfirmationData(null);
                }}
              >
                {confirmationData?.action === 'accept' ? 'Accept' : 'Reject'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default PaymentVerificationTable;