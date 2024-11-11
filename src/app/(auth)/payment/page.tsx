import React from "react";
import PaymentInstructions from "@/components/Instructions/PaymentInstructions";
import PaymentForm from "@/components/paymentForm/paymentForm";

const Page = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-8 ">
      <PaymentInstructions />
      <PaymentForm />
    </div>
  );
};

export default Page;