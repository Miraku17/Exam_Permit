'use client'
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRef } from "react";

const PaymentForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const formRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const validateForm = () => {
    const errors = [];
    const form = formRef.current;

    // Required fields
    const requiredFields = {
      givenName: "Given Name",
      familyName: "Family Name",
      studentId: "Student ID Number",
      mobileNumber: "Mobile Number",
      email: "Email Address",
      referenceNumber: "Reference Number"
    };

    // Check each required field
    Object.entries(requiredFields).forEach(([fieldId, fieldName]) => {
      const value = form[fieldId].value.trim();
      if (!value) {
        errors.push(`${fieldName} is required`);
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.value && !emailRegex.test(form.email.value)) {
      errors.push("Please enter a valid email address");
    }

    // File upload validation
    if (!selectedFile) {
      errors.push("Please upload proof of payment");
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length === 0) {
      // Process the form submission
      console.log("Form submitted successfully");
      // Add your form submission logic here
    }
  };

  return (
    <Card className="w-full lg:w-[650px]">
      <CardHeader>
        <CardTitle className="text-2xl">Submit Payment Form</CardTitle>
        <CardDescription>Please enter the student's correct information</CardDescription>
      </CardHeader>
      <CardContent>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="givenName">GIVEN NAME</Label>
              <Input
                id="givenName"
                name="givenName"
                placeholder="Given Name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyName">FAMILY NAME</Label>
              <Input
                id="familyName"
                name="familyName"
                placeholder="Family Name"
                className="w-full"
              />
            </div>
          </div>

          {/* Student ID and Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">STUDENT ID NUMBER</Label>
              <Input
                id="studentId"
                name="studentId"
                placeholder="Student ID Number"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">MOBILE NUMBER</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="Mobile Number"
                className="w-full"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email">EMAIL ADDRESS</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full"
            />
            <p className="text-destructive text-sm">
              Make sure to enter the correct email address to be able to receive the receipt
            </p>
          </div>

          <div className="pt-4">
            <h2 className="text-lg font-semibold mb-4">Please enter correct payment details:</h2>

            {/* Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">REFERENCE NUMBER</Label>
                <Input
                  id="referenceNumber"
                  name="referenceNumber"
                  placeholder="Reference Number"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentGateway">PAYMENT GATEWAY</Label>
                <Select 
                  defaultValue={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gcash">GCash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="proofOfPayment">UPLOAD PROOF OF PAYMENT *</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : 'No File Chosen'}
              </span>
              <Input
                id="file-upload"
                name="proofOfPayment"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit
          </Button>

          {/* Important Reminders */}
          <div className="mt-8 space-y-3">
            <h3 className="font-bold">Important Reminders:</h3>
            <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
              <li>
                Correct Information: Enter accurate personal details (name, student
                ID, email, etc.) as this will be used for verification.
              </li>
              <li>
                Active Email: Ensure the email address is correct to receive a receipt
                and further communication.
              </li>
              <li>
                Payment Details: Double-check the reference number and select the
                correct payment gateway.
              </li>
              <li>
                Proof of Payment: Upload a clear image or PDF as proof of payment.
              </li>
              <li>
                Submit Confirmation: Review all details before submitting to avoid
                processing delays.
              </li>
            </ol>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;