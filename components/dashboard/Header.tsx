import {
  useAddMembersToChannelMutation,
  useGetChannelUserMutation,
} from "@/redux/channel/channelApi";
import { RootState } from "@/redux/store";
import { Headphones, UserPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Select, { MultiValue, ActionMeta } from "react-select";
import { useNewChatMutation } from "@/redux/chat/chatApi";
import {
  setDrawerOpen,
  setHuddleOn,
  setHuddleShow,
  setHuddleUserId,
  setHuddleUserName,
} from "@/redux/misc/miscSlice";
import { FaBars } from "react-icons/fa";

type Props = {};

interface Option {
  value: string;
  label: string;
}

const Header = (props: Props) => {
  const [type, setType] = useState("");
  const dispatch = useDispatch();
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOptions, setSelectedOptions] =
    useState<MultiValue<Option> | null>(null);

  const [tags, setTags] = useState<string[]>([]);

  const { id, typeid } = useParams();

  const route = useRouter();

  const { name: chatName, members } = useSelector(
    (state: RootState) => state.chat
  );

  const { huddleOn, huddleUserId, drawerOpen } = useSelector(
    (state: RootState) => state.misc
  );

  const { membersNotInchannel } = useSelector(
    (state: RootState) => state.channel
  );

  const [getChannelUsers] = useGetChannelUserMutation();
  const [createNewChat] = useNewChatMutation();

  const handleToggleChange = (e: any) => {
    setIsChecked(e.target.checked);
    dispatch(setHuddleOn(e.target.checked));
    if (type === "user" && huddleUserId === "") {
      dispatch(setHuddleUserId(typeid));
      dispatch(setHuddleUserName(chatName));
    }
    if (e.target.checked === false) {
      dispatch(setHuddleUserId(""));
      dispatch(setHuddleShow(false));
      dispatch(setHuddleUserName(""));
    }
  };

  const options: Option[] = membersNotInchannel.map((user) => ({
    value: user._id,
    label: `${user.username} (${user.email})`,
  }));

  const {
    name,
    channels,
    coWorkers,
    _id: organizationId,
  } = useSelector((state: RootState) => state.workspace);

  const [addMembersToChannel, { isError, isLoading, error, isSuccess }] =
    useAddMembersToChannelMutation();

  const onAddMember = async (e: any) => {
    e.preventDefault();
    const response = await addMembersToChannel({
      organizationId: id,
      tags: selectedOptions,
      channelId: typeid,
    });
    setOpenMemberDialog(false);
    getChannelUsers({
      channelId: typeid,
      organisationId: id,
    });
    const response1 = await createNewChat({
      _id: typeid,
      type,
      organizationId: id,
    });
    setSelectedOptions(null);
  };

  const handleChange = (selected: MultiValue<Option>) => {
    setSelectedOptions(selected);
  };

  const toogleSidebar = () => {
    console.log("hello");
    dispatch(setDrawerOpen(!drawerOpen));
  };

  useEffect(() => {
    if (typeid === undefined) {
      localStorage.setItem("type", "");
    } else {
      const type = localStorage.getItem("type");
      if (type === "channel") {
        setType("channel");
      }
      if (type === "user") {
        setType("user");
      }
    }
  }, [setType, id, typeid]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Invitation Sent");
      setOpenMemberDialog(false);
      setTags([]);
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
      setOpenMemberDialog(false);
      setTags([]);
    }
  }, [error, isSuccess]);

  return (
    <div className=" text-white bg-background h-16 flex flex-row items-center px-2 fixed w-full sm:w-[calc(100vw-256px)] z-10 justify-between border-b-[0.1px] border-b-border">
      <Dialog open={openMemberDialog} onOpenChange={setOpenMemberDialog} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2 text-primary">
              Invite people to {chatName}
            </DialogTitle>
            <div className="w-full flex flex-col">
              <Select
                isMulti
                value={selectedOptions}
                onChange={handleChange}
                options={options}
                placeholder="Select your favorite flavors..."
              />
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
      <div className="block sm:hidden">
        <FaBars onClick={toogleSidebar} />
      </div>

      <div>{chatName}</div>
      {type === "channel" && (
        <div className="flex flex-row gap-2 items-center border px-2 py-1 border-primary rounded-sm">
          {members && (
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {members.slice(0, 3).map((member, index) => (
                <div
                  className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"
                  key={index}
                ></div>
              ))}

              {members.length > 3 && (
                <a
                  className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +{members.slice(3).length}
                </a>
              )}
            </div>
          )}
          <div
            className="flex w-7 h-7 bg-primary items-center justify-center rounded-md text-center"
            onClick={() => setOpenMemberDialog((prev) => !prev)}
          >
            <UserPlus size={"20px"} className="text-black" />
          </div>
        </div>
      )}
      {type === "user" && (huddleUserId === "" || huddleUserId === typeid) && (
        <label className="flex cursor-pointer select-none items-center">
          <div className="relative">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleToggleChange}
              className="sr-only"
            />
            <div
              className={`block h-8 w-14 rounded-full transition ${
                isChecked ? "bg-red-800" : " bg-green-600"
              }`}
            ></div>
            <div
              className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 transition ${
                isChecked ? "transform translate-x-full" : ""
              }`}
            >
              {isChecked ? (
                <span className="active text-center">
                  <Headphones className="w-4 h-4" />
                </span>
              ) : (
                <span className="inactive text-center">
                  <Headphones className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>
        </label>
      )}
    </div>
  );
};

export default Header;
