"use client";
import React, { useState, useRef } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ValidationErrors {
  [key: string]: string;
}

const PaymentForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const form = formRef.current;
    if (!form) return errors;

    const requiredFields = {
      givenName: "Given Name",
      familyName: "Family Name",
      mobileNumber: "Mobile Number",
      email: "Email Address",
      referenceNumber: "Reference Number",
      amount: "Amount",
    };

    // Check required fields
    Object.entries(requiredFields).forEach(([fieldId, fieldName]) => {
      const element = form.elements.namedItem(fieldId) as HTMLInputElement;
      const value = element?.value?.trim() ?? "";
      if (!value) {
        errors.push(`${fieldName} is required`);
      }
    });

    // Validate email format
    const emailElement = form.elements.namedItem("email") as HTMLInputElement;
    const emailValue = emailElement?.value?.trim() ?? "";
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.push("Please enter a valid email address");
    }

    // Validate mobile number (must be 11 digits)
    const mobileElement = form.elements.namedItem(
      "mobileNumber"
    ) as HTMLInputElement;
    const mobileValue = mobileElement?.value?.trim() ?? "";
    if (mobileValue && !/^\d{11}$/.test(mobileValue)) {
      errors.push("Mobile number must be 11 digits");
    }

    // Validate amount (must be a positive number)
    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;
    const amountValue = amountElement?.value?.trim() ?? "";
    if (amountValue) {
      const amount = parseFloat(amountValue);
      if (isNaN(amount) || amount <= 0) {
        errors.push("Amount must be a positive number");
      }
    }

    // Validate file upload
    if (!selectedFile) {
      errors.push("Please upload proof of payment");
    } else {
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedFile.size > maxSize) {
        errors.push("File size must be less than 5MB");
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        errors.push("File must be JPEG, PNG, or PDF");
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setValidationErrors(errors);
    setSubmitError(null);

    if (errors.length === 0) {
      setIsSubmitting(true);
      try {
        const formData = new FormData(formRef.current!);

        // Log all FormData entries
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, {
              name: value.name,
              type: value.type,
              size: value.size,
            });
          } else {
            console.log(`${key}:`, value);
          }
        }

        console.log("Amount:", formData.get("amount"));
        console.log("Type of Amount:", typeof formData.get("amount"));

        // Add file to FormData if selected
        if (selectedFile) {
          formData.set("proofOfPayment", selectedFile);
        }

        // Add payment method
        formData.set("paymentMethod", paymentMethod);

        const response = await fetch("/api/payments", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        console.log("Data", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit payment");
        }

        // Show success toast
        toast({
          title: "Payment Success!",
          description: "Your Payment is now under review.",
        });
        // Redirect to success page
        // router.push("/payment/success");
      } catch (error: any) {
        setSubmitError(
          error.message || "Failed to submit payment. Please try again."
        );
        toast({
          title: "Error submitting payment. Please try again!",
          description: `${error.message}`,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="w-full lg:w-[650px] mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-primaryBlue">
          Submit Payment Form
        </CardTitle>
        <CardDescription>
          Please enter the student's correct information
        </CardDescription>
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

        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
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

          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">MOBILE NUMBER</Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              placeholder="Mobile Number"
              className="w-full"
              maxLength={11}
            />
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
              Make sure to enter the correct email address to be able to receive
              the receipt
            </p>
          </div>

          <div className="pt-4">
            <h2 className="text-lg font-semibold mb-4">
              Please enter correct payment details:
            </h2>

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
                <Label htmlFor="amount">AMOUNT</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number" // This makes it a number input
                  step="0.01" // Allows 2 decimal places
                  min="0" // Prevents negative numbers
                  placeholder="Enter amount"
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
                    <SelectItem value="GCash">GCash</SelectItem>
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
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "No File Chosen"}
              </span>
              <Input
                id="file-upload"
                name="proofOfPayment"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Accepted file types: JPG, PNG, PDF (max 5MB)
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>

          {/* Important Reminders */}
          <div className="mt-8 space-y-3">
            <h3 className="font-bold">Important Reminders:</h3>
            <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
              <li>
                Correct Information: Enter accurate personal details (name,
                email, etc.) as this will be used for verification.
              </li>
              <li>
                Active Email: Ensure the email address is correct to receive a
                receipt and further communication.
              </li>
              <li>
                Payment Details: Double-check the amount, reference number and
                select the correct payment gateway.
              </li>
              <li>
                Proof of Payment: Upload a clear image or PDF as proof of
                payment.
              </li>
              <li>
                Submit Confirmation: Review all details before submitting to
                avoid processing delays.
              </li>
            </ol>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
