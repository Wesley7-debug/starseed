'use client';
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getSavedUser, removeUserFromSaved } from "@/lib/SavedUser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/reusable/PageHeader";

interface SavedUser {
  name: string;
  RegNo: string;
  avatarUrl?: string;
}

export default function SwitchProfile() {
  const [deleteUser, setDeleteUser] = useState(false);
  const [userToRemove, setUserToRemove] = useState<SavedUser | null>(null);
  const [users, setUsers] = useState<SavedUser[]>([]);

  const router = useRouter();

  useEffect(() => {
    setUsers(getSavedUser());
  }, []);

  const handleSwitch = (reg: string) => {
    router.push(`/Login?reg=${reg}`);
  };

  const handleDeleteModal = (user: SavedUser) => {
    setUserToRemove(user);
    setDeleteUser(true);
  };

  const handleRemoveUser = () => {
    if (userToRemove) {
      removeUserFromSaved(userToRemove.RegNo);
      setUsers(getSavedUser());
      setDeleteUser(false);
      setUserToRemove(null);
    }
  };

  const handleCancel = () => {
    setDeleteUser(false);
    setUserToRemove(null);
  };

  const handleAddUser = () => {
    router.push("/Login");
  };

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Switch Profile"
        description="Choose an account or add a new one"
        icon={<Users className="size-5" />}
      />

      <div className="ax-card p-5 space-y-3">
        {users.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#f0ebff] text-[#8c6be8]">
              <Users className="size-7" />
            </div>
            <p className="text-[15px] font-medium text-[#1f2130]">No saved profiles</p>
            <p className="text-sm text-[#777489]">Add a profile to quickly switch accounts</p>
          </div>
        )}

        {users.map((u) => (
          <div
            key={u.RegNo}
            className="flex w-full items-center gap-3 rounded-xl bg-[#faf8ff] p-3 transition-all hover:bg-[#f0ebff] cursor-pointer"
          >
            <Image
              width={40}
              height={40}
              alt={u.name}
              src={u.avatarUrl || "/images/logo.png"}
              className="size-10 rounded-full object-cover"
            />

            <div
              onClick={() => handleSwitch(u.RegNo)}
              className="flex min-w-0 flex-1 flex-col"
            >
              <h3 className="truncate text-sm font-semibold text-[#1f2130]">{u.name}</h3>
              <p className="truncate text-xs text-[#777489]">{u.RegNo}</p>
            </div>

            <button
              onClick={() => handleDeleteModal(u)}
              className="grid size-8 place-items-center rounded-lg text-[#aaa6b5] transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <XCircle className="size-4" />
            </button>
          </div>
        ))}

        {deleteUser && userToRemove && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-sm text-[#1f2130]">
              Remove <span className="font-semibold">{userToRemove.name}</span> from saved profiles?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl border-[#e8e3ee] text-[#1f2130]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveUser}
                className="rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      {users.length < 7 && (
        <button
          onClick={handleAddUser}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8e3ee] bg-[#faf8ff] py-3.5 text-sm font-medium text-[#777489] transition-all hover:border-[#8c6be8]/40 hover:text-[#8c6be8]"
        >
          <PlusCircle className="size-4" />
          Add Profile
        </button>
      )}
    </div>
  );
}
