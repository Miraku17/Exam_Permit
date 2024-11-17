import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const PaymentInstructions = () => {
  return (
    <Card className="w-full lg:w-[650px]">
      <CardHeader>
        <CardTitle className="text-xl text-primaryBlue">
          Payment of Tuition Fees
        </CardTitle>
        <CardDescription>
          All payment shall be made at any accredited payment facilities below:
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* GCash Logo and Details */}
        <div className="flex flex-col items-center">
          <img
            src="/images/gcash.png"
            alt="GCash Logo"
            className="w-24 lg:w-28 h-24 lg:h-28 mb-4"
          />
          <h2 className="text-xl font-bold">Joanna Kate P.</h2>
          <p className="text-lg">09390161258</p>
          {/* <Button variant="link" className="mt-1">
            <QrCode className="mr-2 h-4 w-4" />
            View QR Code here
          </Button> */}
        </div>

        {/* Payment Instructions */}
        <div className="space-y-3">
          <h3 className="font-bold">How to Pay Your Tuition Using GCash:</h3>
          <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
            <li>Open your GCash app and select "Pay Bills"</li>
            <li>Search for or select "UNO-R" from the billers list</li>
            <li>
              Enter the following payment details:
              <ul className="list-disc ml-6 mt-1">
                <li>Account/Student Number</li>
                <li>Amount to Pay</li>
                <li>Reference Number (if required)</li>
              </ul>
            </li>
            <li>Double-check that the GCash number matches: 09390161258</li>
            <li>
              For faster transaction, you can scan the QR code by clicking "View
              QR Code here"
            </li>
            <li>
              Review all payment details before confirming the transaction
            </li>
            <li>
              Keep your transaction receipt/reference number for your records
            </li>
          </ol>
        </div>

        {/* Important Reminders */}
        <div className="space-y-3">
          <h3 className="font-bold">Important Reminders:</h3>
          <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
            <li>
              Make sure your GCash account has sufficient balance before making
              the payment
            </li>
            <li>
              Save a screenshot or download the electronic receipt as proof of
              payment
            </li>
            <li>
              For payment concerns, keep your transaction reference number handy
            </li>
            <li>
              The payment may take 24-48 hours to be reflected in the school's
              system
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInstructions;
