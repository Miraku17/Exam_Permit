"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchFee from "@/components/searchFee/searchFee";
import TuitionData from "@/components/tuitionData/tuitionData";
import axios from "axios";
import { useSession } from "next-auth/react";
import PaymentVerificationTable from "@/components/admin/paymentVerification/paymentVerification";
import { StudentTuition } from "@/models/studentTuition";

interface PaymentHistory {
  transactionId: string;
  fullName: string;
  mobileNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  proofOfPaymentUrl: string;
}

interface ApiResponse {
  success: boolean;
  data: PaymentHistory[];
  error?: string;
}

interface StudentTuitionData {
  userId: string;
  semesters: Array<{
    semester: number;
    terms: Array<{
      term: string;
      dueAmount: number;
      paid: number;
      balance: number;
    }>;
    totalPayments: number;
    remainingBalance: number;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
  });

  const [tuitionData, setTuitionData] = useState<Object[]>([]);
  const [studentTuition, setStudentTuition] =
    useState<StudentTuitionData | null>(null);
  const [error, setError] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState("");

  useEffect(() => {
    console.log("Current session:", session);
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch payment history
        const paymentResponse = await axios.get<ApiResponse>(
          "/api/payments/history"
        );

        // Fetch student tuition if user ID exists
        let tuitionResponse = null;
        if (session?.user?._id) {
          try {
            tuitionResponse = await axios.get<StudentTuitionData>(
              `/api/student-tuition?userId=${session?.user?._id}`
            );
            if (tuitionResponse) {
              console.log("Tuition response data", tuitionResponse.data);
              setStudentTuition(tuitionResponse.data);
            }
          } catch (tuitionError) {
            console.error("Error fetching tuition:", tuitionError);
            // Don't set error here to allow payment history to still show
          }
        }

        if (paymentResponse.data.success && paymentResponse.data.data) {
          setPaymentHistory(paymentResponse.data.data);
          setError("");
        } else {
          setError(paymentResponse.data.error || "Failed to load payments");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session?.user?._id]);

  const handleAcceptPayment = async (transactionId: string) => {
    console.log("Transaction ID", transactionId);
    try {
      const response = await axios.post<ApiResponse>(
        `/api/payments/${transactionId}/accept`,
        { session },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setPaymentHistory((payments) =>
          payments.map((payment) =>
            payment.transactionId === transactionId
              ? { ...payment, status: "accepted" }
              : payment
          )
        );
        setError("");
      } else {
        setError(response.data.error || "Failed to accept payment");
      }
    } catch (err) {
      console.error("Error accepting payment:", err);
      setError("Failed to accept payment");
    }
  };

  const handleRejectPayment = async (transactionId: string) => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/payments/${transactionId}/reject`
      );

      if (response.data.success) {
        setPaymentHistory((payments) =>
          payments.map((payment) =>
            payment.transactionId === transactionId
              ? { ...payment, status: "rejected" }
              : payment
          )
        );
        setError("");
      } else {
        setError(response.data.error || "Failed to reject payment");
      }
    } catch (err) {
      console.error("Error rejecting payment:", err);
      setError("Failed to reject payment");
    }
  };

  const getCourseCode = (courseString: string) => {
    const regex = /\(([^)]+)\)/;
    const match = courseString?.match(regex);
    return match ? match[1] : null;
  };

  const handleSearch = async (term: string, year: string) => {
    setSelectedTerm(term);
    const courseCode = getCourseCode(session?.user?.course);
    try {
      const response = await axios.get(
        `/api/tuition/?courseCode=${courseCode}&term=${term}&year=${year}`
      );
      setTuitionData(response.data);
    } catch (error) {
      setError("No tuition data for this selection");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (session?.user?.role === "admin") {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Payment Verifications</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <PaymentVerificationTable
            payments={paymentHistory}
            onAccept={handleAcceptPayment}
            onReject={handleRejectPayment}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-12 p-4">
      <SearchFee
        handleSearch={handleSearch}
        error={error}
        setError={setError}
      />
      <TuitionData
        data={tuitionData}
        studentTuition={studentTuition}
        selectedTerm={selectedTerm}
      />
      {/* <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <PaymentVerificationTable
            payments={paymentHistory}
            onAccept={handleAcceptPayment}
            onReject={handleRejectPayment}
          />
        )}
      </div> */}
    </div>
  );
}
