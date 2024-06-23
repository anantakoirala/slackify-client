"use client";
import React, { useEffect, useState } from "react";
import OtpInput from "@/components/OtpInput";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const route = useRouter();
  const [otp, setOtp] = useState<string>("");

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const onSubmit = () => {
    console.log("otp", otp);
  };

  useEffect(() => {
    console.log("ot", otp.length);
    if (otp.length === 6) {
      axios
        .post(
          "http://localhost:7000/api/v1/auth/verify",
          {
            loginVerificationCode: otp,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          route.push("/");
        })
        .catch((error) => console.log("error", error.response.data.data));
    }
  }, [otp]);

  return (
    <div className="flex w-full h-screen items-center justify-center bg-background">
      <form onSubmit={onSubmit}>
        <OtpInput length={6} onChange={handleOtpChange} />
      </form>
    </div>
  );
};

export default Page;
