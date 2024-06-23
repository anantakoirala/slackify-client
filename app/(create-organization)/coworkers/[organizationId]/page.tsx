"use client";
import { restApi } from "@/api";
import TagInput from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const { organizationId } = useParams();
  const [email, setEmail] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (tags.length === 0) {
      console.log("orgaId", organizationId);
      setError("please add some coworkers");
      return;
    }
    if (organizationId) {
      restApi
        .put(`/api/v1/workspace/${organizationId}`, { data: tags })
        .then((res) => console.log(res));
    }
  };

  return (
    <div className="w-full  text-white flex flex-col  ">
      <span className="text-xs mb-6">Step 2 of 3</span>
      <span className="text-3xl font-extrabold mb-6">
        Who else is on the <br /> team?
      </span>

      <div className="flex flex-col">
        <div className=" w-full sm:w-[50%]">
          <TagInput users={[]} tags={tags} setTags={setTags} />
        </div>
        {error && <span className="text-red-700">{error}</span>}
        <div className="flex flex-row gap-2">
          <button
            onClick={onSubmit}
            className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
            type="button"
          >
            Next
          </button>
          <Button
            variant={"outline"}
            className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium  disabled:pointer-events-none disabled:opacity-50  text-muted-foreground  px-4 py-2"
            type="button"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
