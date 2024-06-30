import React, { SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = {
  huddleDialogOpen: boolean;
  setHuddleDialogOpen: React.Dispatch<SetStateAction<boolean>>;
};

const HuddleDialog = ({ huddleDialogOpen, setHuddleDialogOpen }: Props) => {
  return (
    <Dialog open={huddleDialogOpen} onOpenChange={setHuddleDialogOpen} modal>
      <DialogContent className="w-full max-w-6xl">
        <DialogHeader>
          <DialogTitle className="mb-2 text-primary">
            Are you absolutely sure?
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HuddleDialog;
