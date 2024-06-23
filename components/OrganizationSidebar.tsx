import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const OrganizationSidebar = (props: Props) => {
  return (
    <div className="hidden sm:block  bg-background  w-64 pt-8 px-1 dark:text-slate-100 shadow-md text-white  ">
      <div className="flex flex-row items-center h-15 w-full ">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col flex-1 gap-1">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full " />
        </div>
      </div>
    </div>
  );
};

export default OrganizationSidebar;
