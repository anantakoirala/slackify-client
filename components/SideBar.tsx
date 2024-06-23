"use client";
import {
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Disc2,
  ExternalLink,
  LayoutGrid,
  LayoutList,
  LogOut,
  MonitorPlay,
  Plus,
  ScanSearch,
  SendToBack,
  Settings2,
  Truck,
  User,
  UserSquare,
  UserSquare2,
  Users2,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "./ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { restApi } from "@/api";
import { WorkspaceContext } from "@/ContextProvider/WorkSpaceProvider";
import TagInput from "./TagInput";
import { useCreateChannelMutation } from "@/redux/api/channel/channelApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSendInvitationMutation } from "@/redux/workspace/workspaceApi";

type Props = {
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  showSideBar: boolean;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Minimum 2 charaters required" }),
});

const SideBar = ({ showSideBar }: Props) => {
  const { id } = useParams();
  const [openMenu, setOpenMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [createChannel, { isSuccess, isError, error, data }] =
    useCreateChannelMutation();

  const [
    sendInvitation,
    {
      isSuccess: sendInvitationSuccess,
      isError: sendInviatationIsError,
      error: sendInvitationError,
    },
  ] = useSendInvitationMutation();

  const { name, channels, coWorkers } = useSelector(
    (state: RootState) => state.workspace
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    createChannel({ name: data.name, organisationId: id });
  };

  const onAddMember = (e: any) => {
    e.preventDefault();
    sendInvitation({ id: id, data: tags });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success("channel created");
      setOpen(false);
    }
    if (sendInvitationSuccess) {
      toast.success("Invitation Sent");
      setOpenMemberDialog(false);
    }

    if (sendInvitationError) {
      if ("data" in sendInvitationError) {
        const errorData = sendInvitationError as any;
        toast.error(errorData.data.message);
      }
      setOpenMemberDialog(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
      setOpen(false);
    }
  }, [isSuccess, error, sendInvitationSuccess, sendInvitationError]);

  return (
    <div
      className={`${
        showSideBar
          ? "sm:block mt-20 sm:mt-0  bg-background space-y-6 w-64 min-h-screen dark:text-slate-100  text-slate-800  fixed left-0 top-0 bottom-0 shadow-md overflow-y-scroll"
          : "hidden mt-20 sm:mt-0 sm:block bg-background space-y-6 w-64 min-h-screen dark:text-slate-100  text-slate-800  fixed left-0 top-0 bottom-0 shadow-md border-r-2 border-r-secondary-foreground"
      }`}
    >
      <div className="h-16 flex flex-col items-center justify-between px-2 ">
        <Link href={"/"} className="h-10 mb-5">
          <h3 className="font-bold text-4xl text-slate-800 dark:text-slate-50 px-3 text-foreground pt-[6px]">
            Ecommerce
          </h3>
        </Link>
        <Separator className="bg-border h-[1px]" />
      </div>
      <div className=" flex flex-col ">
        <Dialog open={open} onOpenChange={setOpen} modal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-2 text-primary">
                Are you absolutely sure?
              </DialogTitle>
              <Form {...form}>
                <form
                  className="flex flex-col items-center mb-2 w-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full mb-3 ">
                        <FormControl>
                          <Input
                            placeholder="project statusThis could be anything: a project, campaign, event, or the deal you're trying to close."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openMemberDialog}
          onOpenChange={setOpenMemberDialog}
          modal
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-2 text-primary">
                Invite people to {name}
              </DialogTitle>
              <div className="w-full flex flex-col">
                {coWorkers && (
                  <TagInput users={[]} tags={tags} setTags={setTags} />
                )}
                <button
                  onClick={onAddMember}
                  className="w-20 mt-6 h-12 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2"
                  type="button"
                >
                  Submit
                </button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between space-x-3 px-6 py-2 text-primary">
          <Link href={""} className={""}>
            <span>Chanels</span>
          </Link>
          <Plus
            onClick={() => setOpen((prev) => !prev)}
            className="w-5 h-5 rounded-sm bg-card"
          />
        </div>
        <div className="px-2 flex flex-col gap-1">
          {channels &&
            channels.map((channel, index) => (
              <Link
                key={index}
                href={"/"}
                className="flex items-center  px-4 text-sm text-primary rounded-md bg-card/80 gap-1 "
              >
                #<span className="line-clamp-1">{channel.name}</span>
              </Link>
            ))}
        </div>
      </div>
      <div className="px-2 h-[1px]">
        <Separator className="bg-border" />
      </div>

      <div className=" flex flex-col mt-14">
        <Link
          href={""}
          className={`flex items-center justify-between space-x-3 px-6 py-2 text-primary `}
        >
          <span>Direct Message</span>
          <Plus
            className="w-5 h-5 rounded-sm bg-card"
            onClick={() => setOpenMemberDialog((prev) => !prev)}
          />
        </Link>
        <div className="px-2 flex flex-col gap-1">
          {coWorkers &&
            coWorkers.map((coworker, index) => (
              <Link
                key={index}
                href={"/"}
                className="flex items-center  px-4 text-sm text-primary rounded-md bg-card/80 gap-1 "
              >
                #<span>{coworker.username}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
