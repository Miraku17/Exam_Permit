import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <CardContent>
        <Tabs defaultValue="gcash" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gcash">GCash</TabsTrigger>
            <TabsTrigger value="debit">Debit Card</TabsTrigger>
            <TabsTrigger value="credit">Credit Card</TabsTrigger>
          </TabsList>

          <TabsContent value="gcash" className="space-y-6">
            {/* GCash Logo and Details */}
            <div className="flex flex-col items-center">
              <img
                src="/images/gcash.png"
                alt="GCash Logo"
                className="w-24 lg:w-28 h-24 lg:h-28 mb-4"
              />
              <h2 className="text-xl font-bold">Joanna Kate P.</h2>
              <p className="text-lg">09390161258</p>
            </div>

            {/* GCash Payment Instructions */}
            <div className="space-y-3">
              <h3 className="font-bold">How to Pay Your Tuition Using GCash:</h3>
              <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
                <li>Open your GCash app and select "Send Money"</li>
                <li>
                  Enter the following payment details:
                  <ul className="list-disc ml-6 mt-1">
                    <li>Account/Student Number</li>
                    <li>Amount to Pay</li>
                    <li>Reference Number (if required)</li>
                  </ul>
                </li>
                <li>Double-check that the GCash number matches: 09390161258</li>
                <li>Review all payment details before confirming the transaction</li>
                <li>Keep your transaction receipt/reference number for your records</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="debit" className="space-y-6">
            {/* Debit Card Bank Options */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BDO */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/images/bdo.jpg"
                      alt="BDO Logo"
                      className="h-8 object-contain"
                    />
                    <h3 className="font-bold">BDO</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Account Name: UNO-R</p>
                    <p>Account Number: 1234-5678-9012</p>
                    <p>Branch: Main Branch</p>
                  </div>
                </div>

                {/* BPI */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/images/bpi.png"
                      alt="BPI Logo"
                      className="h-8 object-contain"
                    />
                    <h3 className="font-bold">BPI</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Account Name: UNO-R</p>
                    <p>Account Number: 9876-5432-1098</p>
                    <p>Branch: City Center Branch</p>
                  </div>
                </div>

                {/* Metrobank */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/images/metrobank.jpg"
                      alt="Metrobank Logo"
                      className="h-8 object-contain"
                    />
                    <h3 className="font-bold">Metrobank</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Account Name: UNO-R</p>
                    <p>Account Number: 5432-1098-7654</p>
                    <p>Branch: Downtown Branch</p>
                  </div>
                </div>

                {/* UnionBank */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/images/ub.jpg"
                      alt="UnionBank Logo"
                      className="h-8 object-contain"
                    />
                    <h3 className="font-bold">UnionBank</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Account Name: UNO-R</p>
                    <p>Account Number: 3456-7890-1234</p>
                    <p>Branch: University Branch</p>
                  </div>
                </div>
              </div>

              {/* Debit Card Payment Instructions */}
              <div className="space-y-3">
                <h3 className="font-bold">How to Pay Using Your Debit Card:</h3>
                <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
                  <li>Log in to your bank's online banking platform or mobile app</li>
                  <li>Select "Transfer to Another Account" or "Send Money"</li>
                  <li>Enter the university's account details for your preferred bank</li>
                  <li>
                    Include the following in the reference/notes:
                    <ul className="list-disc ml-6 mt-1">
                      <li>Student Number</li>
                      <li>Full Name</li>
                      <li>Course/Year Level</li>
                    </ul>
                  </li>
                  <li>Take a screenshot of the successful transaction</li>
                  <li>Upload the proof of payment in the student portal</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credit" className="space-y-6">
            {/* Credit Card Payment Options */}
            <div className="space-y-6">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-center gap-4 mb-4">
                  <img
                    src="/images/visa.jpg"
                    alt="Visa Logo"
                    className="h-8 object-contain"
                  />
                  <img
                    src="/images/mastercard.png"
                    alt="Mastercard Logo"
                    className="h-8 object-contain"
                  />
                  <img
                    src="/images/am.jpg"
                    alt="American Express Logo"
                    className="h-8 object-contain"
                  />
                </div>
                
                <div className="text-sm text-center text-muted-foreground">
                  <p>We accept Visa, Mastercard, and American Express credit cards</p>
                  <p className="font-semibold mt-2">Payment Gateway: PayMongo</p>
                </div>
              </div>

              {/* Credit Card Payment Instructions */}
              <div className="space-y-3">
                <h3 className="font-bold">How to Pay Using Your Credit Card:</h3>
                <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
                  <li>Click on "Pay with Credit Card" in your student portal</li>
                  <li>
                    You will be redirected to our secure payment gateway
                  </li>
                  <li>
                    Enter your credit card information:
                    <ul className="list-disc ml-6 mt-1">
                      <li>Card number</li>
                      <li>Name on card</li>
                      <li>Expiration date</li>
                      <li>CVV (security code)</li>
                    </ul>
                  </li>
                  <li>Verify the payment amount</li>
                  <li>Click "Pay Now" to complete the transaction</li>
                  <li>Save the transaction receipt for your records</li>
                </ol>

                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-700 mb-2">Payment Terms:</h4>
                  <ul className="list-disc ml-5 text-sm text-blue-600 space-y-1">
                    <li>All major credit cards are accepted</li>
                    <li>3% convenience fee applies to all credit card transactions</li>
                    <li>Installment options available for select banks (3, 6, or 12 months)</li>
                    <li>Minimum transaction amount: ₱1,000</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Common Important Reminders for all payment methods */}
          <div className="mt-6 space-y-3">
            <h3 className="font-bold">Important Reminders:</h3>
            <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
              <li>
                Always keep your proof of payment until it reflects in your account
              </li>
              <li>
                Make sure to include your correct student information in the payment reference
              </li>
              <li>
                Payments may take 24-48 hours to be reflected in the school's system
              </li>
              <li>
                For card payments, ensure you're using a secure internet connection
              </li>
              <li>
                Contact the Finance Office if payment is not reflected after 48 hours
              </li>
            </ol>
          </div>
        </Tabs>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground mt-4 flex flex-col items-start space-y-2">
        <p>For payment-related concerns, please contact our Finance Office:</p>
        <ul className="list-disc ml-5">
          <li>Email: uno-r@university.edu.ph</li>
          <li>Phone: (02) 8123-4567</li>
          <li>Office Hours: Monday to Friday, 8:00 AM - 5:00 PM</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default PaymentInstructions;