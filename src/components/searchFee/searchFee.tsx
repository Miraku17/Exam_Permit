import React, { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchFee = ({handleSearch, error, setError}: any) => {
  const [term, setTerm] = useState<String>('Select Term');
  const [year, setYear] = useState<String>('Select Year');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    handleSearch(term, year);
  };

  const handleTermChange = (selectedTerm: string) => {
    setTerm(selectedTerm);
    setError('')
  };
  const handleYearChange = (selectedYear: string) => {
    setYear(selectedYear);
    setError('')
  };
  
  return (
    <Card className="bg-gray-100">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="text-primaryBlue font-semibold flex items-center gap-2 text-xl">
              <Search size={20} />
              SEARCH TUITION FEE ASSESSMENT
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Term</label>
                <Select
                  onValueChange={handleTermChange}
                  value={term}
                  defaultValue="Select Term"
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Term" disabled>
                      Select Term
                    </SelectItem>
                    <SelectItem value="1st">1st Sem</SelectItem>
                    <SelectItem value="2nd">2nd Sem</SelectItem>
                    {/* <SelectItem value="midyear">Midyear</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Year</label>
                <Select
                  onValueChange={handleYearChange}
                  value={year}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Year" disabled>
                      Select Year
                    </SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-blue-900 hover:bg-blue-800"
                disabled={term === 'Select Term' || year === 'Select Year'} 
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
        <div>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFee;