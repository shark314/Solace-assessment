"use client";

import { useEffect, useState, useCallback, ChangeEvent } from "react";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        console.log("Fetching advocates...");
        const response = await fetch("/api/advocates");
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data || []);
        setFilteredAdvocates(jsonResponse.data || []);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      }
    };

    fetchAdvocates();
  }, []);

  const handleSearch = useCallback(
    (term: string) => {
      const lowercasedTerm = term.toLowerCase();
      const filtered = advocates.filter((advocate) =>
        [advocate.firstName, advocate.lastName, advocate.city, advocate.degree]
          .some((field) => field.toLowerCase().includes(lowercasedTerm)) ||
        advocate.specialties.some((specialty) => specialty.toLowerCase().includes(lowercasedTerm)) ||
        advocate.yearsOfExperience.toString().includes(lowercasedTerm) || advocate.phoneNumber.toString().includes(lowercasedTerm)
      );

      setFilteredAdvocates(filtered);
    },
    [advocates]
  );

  const debouncedSearch = useCallback(
    debounce((term: string) => handleSearch(term), 300),
    [handleSearch]
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Solace Advocates</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <p className="text-gray-700 mb-2">Search</p>
        <p className="text-sm text-gray-500 mb-4">
          Searching for: <span className="font-semibold">{searchTerm}</span>
        </p>
        <div className="flex items-center space-x-4 mb-6">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={onChange}
            placeholder="Search advocates..."
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={onClick}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">First Name</th>
              <th className="py-3 px-4 text-left">Last Name</th>
              <th className="py-3 px-4 text-left">City</th>
              <th className="py-3 px-4 text-left">Degree</th>
              <th className="py-3 px-4 text-left">Specialties</th>
              <th className="py-3 px-4 text-left">Years of Experience</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-blue-100 transition-colors`}
              >
                <td className="py-3 px-4">{advocate.firstName}</td>
                <td className="py-3 px-4">{advocate.lastName}</td>
                <td className="py-3 px-4">{advocate.city}</td>
                <td className="py-3 px-4">{advocate.degree}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {advocate.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">{advocate.yearsOfExperience}</td>
                <td className="py-3 px-4">{advocate.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// Debounce function to reduce input lag
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
