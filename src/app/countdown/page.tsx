"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-blue-50 to-blue-100">
      
    </main>
  );
}
