"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchFee from "@/components/searchFee/searchFee";
import TuitionData from "@/components/tuitionData/tuitionData";
import axios from "axios";
import { useSession } from "next-auth/react";
import PaymentVerificationTable from "@/components/admin/paymentVerification/paymentVerification";

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

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
  });

  const [tuitionData, setTuitionData] = useState<Object[]>([]);
  const [error, setError] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        const endpoint =
          session?.user?.role === "admin"
            ? "/api/payments"
            : "/api/payments/history";
        const response = await axios.get<ApiResponse>(endpoint);

        if (response.data.success && response.data.data) {
          setPaymentHistory(response.data.data);
          setError("");
        } else {
          setError(response.data.error || "Failed to load payments");
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchPaymentHistory();
    }
  }, [status, session?.user?.role]);

  const handleAcceptPayment = async (transactionId: string) => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/payments/${transactionId}/accept`
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

    if (match) {
      return match[1];
    }

    return null;
  };

  const handleSearch = async (term: string, year: string) => {
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
    <div className="flex flex-col justify-center gap-12">
      <SearchFee
        handleSearch={handleSearch}
        error={error}
        setError={setError}
      />
      <TuitionData data={tuitionData} />

      <div className="mt-8">
        {/* <h2 className="text-xl font-semibold mb-4">Payment History</h2> */}
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
      </div>
    </div>
  );
}
