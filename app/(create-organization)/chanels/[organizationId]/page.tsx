"use client";
import { restApi } from "@/api";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const formSchema = z.object({
  chanel_name: z
    .string()
    .min(2, { message: "Minimum 3 characters are required" }),
});

const Page = (props: Props) => {
  const route = useRouter();
  const { organizationId } = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chanel_name: "",
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmitChanelName = (data: z.infer<typeof formSchema>) => {
    restApi
      .post("/api/v1/channel/create", {
        name: data.chanel_name,
        organisationId: organizationId,
      })
      .then((res) => {
        route.push(`/s/${organizationId}`);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);
  return (
    <div className="w-full  text-white flex flex-col  ">
      <span className="text-xs mb-6">Step 1 of 3</span>
      <span className="text-3xl font-extrabold mb-6">
        Whats your team working on <br /> right now?
      </span>

      <input
        type="text"
        className=" w-full sm:w-[50%] px-3 py-2 border focus:ring-1 focus-visible:ring-ring rounded-md outline-none  bg-card text-muted-foreground placeholder:text-sm"
        placeholder="This could be anything: a project, campaign, event, or the deal you're trying to close."
        {...register("chanel_name", { required: true })}
      />
      {errors && errors?.chanel_name && (
        <span className="text-red-600">{errors?.chanel_name?.message}</span>
      )}

      <div className="flex flex-row gap-2">
        <button
          className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
          type="button"
          onClick={handleSubmit(onSubmitChanelName)}
        >
          Next
        </button>

        <Button
          variant={"outline"}
          className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium  disabled:pointer-events-none disabled:opacity-50  text-muted-foreground  px-4 py-2"
          type="button"
          onClick={() => route.push(`/s/${organizationId}`)}
        >
          Skip
        </Button>
      </div>
    </div>
    // <div className="">ananta</div>
  );
};

export default Page;
