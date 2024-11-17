"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SearchFee from "@/components/searchFee/searchFee";
import TuitionData from "@/components/tuitionData/tuitionData";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const {data:session, status} = useSession({
    required: true,
  });

  const [tuitionData, setTuitionData] = useState<Object[]>([]);
  const [error, setError] = useState('');


  // useEffect(()=>{}, [session])
  const getCourseCode = (courseString: String) => {
      const regex = /\(([^)]+)\)/; 
      const match = courseString.match(regex);

      if (match) {
          return match[1];
      }

      return null;
  }

  const handleSearch = async (term, year) => {
    const courseCode = getCourseCode(session?.user?.course);
    try {
      const response = await axios.get(`/api/tuition/?courseCode=${courseCode}&term=${term}&year=${year}`);

      setTuitionData(response.data);
      console.log(tuitionData);
    } catch (error) {
      setError('No tuition data for this selection');
    }
  }

  return (
    <div className="flex  flex-col justify-center gap-12">
        <SearchFee
          handleSearch={handleSearch}
          error={error}
          setError={setError}
        />
        <TuitionData data={tuitionData}/>
        {/* {tuitionData && <TuitionData data={tuitionData}/>} */}

    </div>
  );
}
