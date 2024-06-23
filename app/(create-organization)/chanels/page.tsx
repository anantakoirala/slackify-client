"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const formSchema = z.object({
  organization_name: z
    .string()
    .min(2, { message: "minimum 3 character is required" }),
});

const Page = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="w-full  text-white flex flex-col  ">
      <span className="text-xs mb-6">Step 1 of 3</span>
      <span className="text-3xl font-extrabold mb-6">
        Whats your team working on <br /> right now?
      </span>

      <form className="flex flex-col">
        <input
          type="text"
          className=" w-full sm:w-[50%] px-3 py-2 border focus:ring-1 focus-visible:ring-ring rounded-md outline-none  bg-card text-muted-foreground placeholder:text-sm"
          placeholder="This could be anything: a project, campaign, event, or the deal you're trying to close."
        />

        <button className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
          Next
        </button>
      </form>
    </div>
    // <div className="">ananta</div>
  );
};

export default Page;
