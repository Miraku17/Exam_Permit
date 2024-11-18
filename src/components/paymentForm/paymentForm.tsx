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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PaymentForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const resetForm = () => {
    // Reset form fields
    if (formRef.current) {
      formRef.current.reset();
    }

    // Reset all states
    setSelectedFile(null);
    setValidationErrors([]);
    setPaymentMethod("GCash");
    setSubmitError(null);
    
    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const form = formRef.current;
    if (!form) return errors;

    const requiredFields = {
      mobileNumber: "Mobile Number",
      referenceNumber: "Reference Number",
      amount: "Amount",
    };

    Object.entries(requiredFields).forEach(([fieldId, fieldName]) => {
      const element = form.elements.namedItem(fieldId) as HTMLInputElement;
      const value = element?.value?.trim() ?? "";
      if (!value) {
        errors.push(`${fieldName} is required`);
      }
    });

    const mobileElement = form.elements.namedItem("mobileNumber") as HTMLInputElement;
    const mobileValue = mobileElement?.value?.trim() ?? "";
    if (mobileValue && !/^\d{11}$/.test(mobileValue)) {
      errors.push("Mobile number must be 11 digits");
    }

    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;
    const amountValue = amountElement?.value?.trim() ?? "";
    if (amountValue) {
      const amount = parseFloat(amountValue);
      if (isNaN(amount) || amount <= 0) {
        errors.push("Amount must be a positive number");
      }
    }

    if (!selectedFile) {
      errors.push("Please upload proof of payment");
    } else {
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        errors.push("File size must be less than 5MB");
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
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
        
        formData.set("fullName", session?.user?.fullname || '');
        formData.set("email", session?.user?.email || '');
        formData.set("studentId", session?.user?._id || '');


        if (selectedFile) {
          formData.set("proofOfPayment", selectedFile);
        }

        formData.set("paymentMethod", paymentMethod);

        const response = await fetch("/api/payments", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit payment");
        }

        resetForm();
        setShowSuccessModal(true);
      } catch (error: any) {
        setSubmitError(error.message || "Failed to submit payment. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/history');
  };

  return (
    <>
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
            <div className="space-y-2">
              <Label htmlFor="fullName">FULL NAME</Label>
              <Input
                id="fullName"
                name="fullName"
                value={session?.user?.fullname || ''}
                className="w-full bg-gray-50"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">EMAIL ADDRESS</Label>
              <Input
                id="email"
                name="email"
                value={session?.user?.email || ''}
                className="w-full bg-gray-50"
                readOnly
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
                maxLength={11}
              />
            </div>

            <div className="pt-4">
              <h2 className="text-lg font-semibold mb-4">
                Please enter correct payment details:
              </h2>

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
                    type="number"
                    step="0.01"
                    min="0"
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
                  accept=".jpg,.jpeg,.png,"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Accepted file types: JPG, PNG (max 5MB)
              </p>
            </div>

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

            <div className="mt-8 space-y-3">
              <h3 className="font-bold">Important Reminders:</h3>
              <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-muted-foreground">
                <li>
                  Correct Information: Your personal details are automatically filled from your account.
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

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Payment Submitted Successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Your payment has been submitted and is now under review. You will receive a confirmation once it has been processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessClose} className="w-full">
              Continue to History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentForm;