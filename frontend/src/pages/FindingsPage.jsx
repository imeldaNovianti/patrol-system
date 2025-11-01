import React, { useState } from "react";
import NavBar from "../components/NavBar";
import FindingForm from "../components/FindingForm";
import FindingsTable from "../components/FindingsTable";

export default function FindingsPage() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(prev => !prev);

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Findings Page</h1>
        <FindingForm onSuccess={handleRefresh} />
        <FindingsTable refresh={refresh} />
      </div>
    </div>
  );
}
