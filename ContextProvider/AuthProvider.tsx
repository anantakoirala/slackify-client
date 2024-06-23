"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createContext } from "react";
import { useRouter } from "next/navigation";
import { restApi } from "@/api";

type AuthContextValue = {
  name: string;
  email: string;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthContextValue>();
  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => !prev);
      try {
        const response = await restApi.get("/api/v1/auth/me");
        setAuthenticatedUser(response.data);
        setLoading(false);
        // Handle the response data
      } catch (error: any) {
        if (error?.response?.status === 401) {
          setLoading(false);
          router.push("/login");
        }
        // Handle the error
      }
    };

    fetchData();
  }, [router]);

  const contextValue = useMemo(() => authenticatedUser, [authenticatedUser]);
  console.log("AuthProvider re-rendered");
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {authenticatedUser && (
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export default React.memo(AuthProvider);
