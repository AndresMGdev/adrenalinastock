'use client'

import UserTable from "@/components/UsersTable";
import Welcome from "@/components/Welcome";
import { useEffect, useState } from "react";

export default function Home() {

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = typeof window !== "undefined" ? localStorage.getItem('authUser') : false;
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <main>

      {
        !userData ? <Welcome /> : <UserTable />
      }

    </main>
  );
}
