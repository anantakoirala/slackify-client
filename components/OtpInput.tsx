"use client";
import React, { ChangeEvent, ClipboardEvent, useRef, useState } from "react";

type Props = {
  length: number;
  onChange: (otp: string) => void;
  defaultValue?: string;
};

const OtpInput = ({ length, onChange, defaultValue = "" }: Props) => {
  const [otp, setOtp] = useState<string[]>(
    defaultValue
      .split("")
      .slice(0, length)
      .concat(new Array(length).fill(""))
      .slice(0, length)
  );
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const handleChange = (element: HTMLInputElement, index: number) => {
    // const value = element.value.replace(/\D/g, ""); // Remove any non-digit characters
    const value = element.value;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
      onChange(newOtp.join(""));
    }
  };
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasteData = e.clipboardData.getData("text").split("");
    if (pasteData.length === length) {
      const newOtp = pasteData.slice(0, length);
      setOtp(newOtp);
      newOtp.forEach((val, index) => {
        if (inputsRef.current[index]) {
          inputsRef.current[index].value = val;
        }
      });
      onChange(newOtp.join(""));
    }
    e.preventDefault();
  };
  return (
    <div
      onPaste={handlePaste}
      className="flex items-center justify-center bg-green"
    >
      {otp.map((_, index) => (
        <input
          key={index}
          type="text"
          placeholder=""
          maxLength={1}
          value={otp[index]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target, index)
          }
          ref={(el) => {
            if (el) inputsRef.current[index] = el;
          }}
          className="w-20 h-20 border-2 text-center focus:ring-4 focus-visible:ring-ring m-1 rounded-xl outline-none  bg-card text-muted-foreground "
        />
      ))}
    </div>
  );
};

export default OtpInput;
