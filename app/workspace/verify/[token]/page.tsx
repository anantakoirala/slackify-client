"use client";
import React, { useEffect, useState } from "react";
import OtpInput from "@/components/OtpInput";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { restApi } from "@/api";

type Props = {};

const Page = (props: Props) => {
  const { token } = useParams();
  console.log("type", typeof token);
  const route = useRouter();
  const [otp, setOtp] = useState<string>("");

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const onSubmit = () => {
    console.log("otp", otp);
  };

  useEffect(() => {
    if (typeof token === "string") {
      setOtp(token);
    } else if (Array.isArray(token)) {
      setOtp(token.join(""));
    }
  }, [token]);

  const formattedToken =
    typeof token === "string"
      ? token
      : Array.isArray(token)
      ? token.join("")
      : "";

  useEffect(() => {
    console.log("ot", otp.length);
    if (otp.length === 6) {
      restApi
        .post(
          "api/v1/workspace/w-verify",
          {
            loginVerificationCode: otp,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          route.push("/");
        })
        .catch((error) => console.log("error"));
    }
  }, [otp]);

  return (
    <div className="flex w-full h-screen items-center justify-center bg-background">
      <form onSubmit={onSubmit}>
        <OtpInput
          length={6}
          onChange={handleOtpChange}
          defaultValue={formattedToken}
        />
      </form>
    </div>
  );
};

export default Page;
