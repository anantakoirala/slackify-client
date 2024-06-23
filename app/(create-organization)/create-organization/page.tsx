"use client";
import { AuthContext } from "@/ContextProvider/AuthProvider";
import { restApi } from "@/api";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const formSchema = z.object({
  organization_name: z
    .string()
    .min(2, { message: "minimum 2 character is required" }),
});

type formSchemaType = z.infer<typeof formSchema>;

const Page = (props: Props) => {
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: formSchemaType) => {
    restApi
      .post("/api/v1/workspace/create", {
        organization_name: data.organization_name,
      })
      .then((res) => {
        console.log("res", res.data.workspace._id);

        route.push(`/coworkers/${res.data.workspace._id}`);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="w-full  text-white flex flex-col  ">
      <span className="text-xs mb-6">Step 1 of 3</span>
      <span className="text-3xl font-extrabold mb-1">
        Whats the name of your <br />
        company or team?
      </span>
      <span className="text-xs mb-6">
        This will be the name of your Slack workspace &mdash; choose something
        that your team will recognize.
      </span>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <span className="text-xs mb-1">
          Name <span className="text-red-700">*</span>
        </span>
        <input
          {...register("organization_name")}
          type="text"
          className=" w-full sm:w-[50%] px-3 py-2 border focus:ring-1 focus-visible:ring-ring rounded-md outline-none  bg-card text-muted-foreground placeholder:text-sm"
          placeholder="Ex: Acme Marketing or Acme Co"
        />
        {errors.organization_name && (
          <span className="text-red-500">
            {errors.organization_name.message}
          </span>
        )}

        <button
          className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
          type="submit"
        >
          Next
        </button>
      </form>
    </div>
    // <div className="">ananta</div>
  );
};

export default Page;
