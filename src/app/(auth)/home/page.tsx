// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SearchFee from "@/components/searchFee/searchFee";
import TuitionData from "@/components/tuitionData/tuitionData";
export default function DashboardPage() {
  return (
    <div className="flex  flex-col justify-center gap-12">
        <SearchFee />
        <TuitionData />

    </div>
  );
}
