'use client'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getSavedUser, removeUserFromSaved } from "../../../libs/SavedUser";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SavedUser {
  name: string;
  RegNo: string;
  avatarUrl?: string;
}

export default function SwitchProfile() {
  const [deleteUser, setDeleteUser] = useState(false);
  const [userToRemove, setUserToRemove] = useState<SavedUser | null>(null);
  const [users, setUsers] = useState<SavedUser[]>([

  ]);

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
    <section className="w-screen h-screen flex justify-center items-center overflow-hidden">
      <Card className="w-full max-w-4xl p-2">
        <CardHeader className="text-start">
          <CardTitle>Switch User</CardTitle>
          <CardDescription>Choose your account or login</CardDescription>
        </CardHeader>
        <CardContent className="px-3 w-full">
          {users.map((u) => (
            <div
              key={u.RegNo}
              className="flex w-full items-center shadow-md mb-2 cursor-pointer relative"
            >
              <Image
                width={10}
                height={10}
                alt={u.name}
                src={u.avatarUrl || "/images/logo.png"}
                className="w-10 h-10 rounded-full mr-3"
              />

              <div
                onClick={() => handleSwitch(u.RegNo)}
                className="flex flex-col flex-grow gap-0.5"
              >
                <h1 className="font-semibold">{u.name}</h1>
                <p className="text-sm">{u.RegNo}</p>
              </div>

              <div
                onClick={() => handleDeleteModal(u)}
                className="ml-auto p-1 rounded-full"
              >
                <XCircle />
              </div>
            </div>
          ))}

          {deleteUser && userToRemove && (
            <Card className="flex flex-col justify-center items-center w-full mt-4">
              <CardContent>
                <h1>Are you sure you want to delete {userToRemove.name}?</h1>
              </CardContent>
              <CardFooter className="flex flex-row w-full gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex justify-center "
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveUser}
                  className="flex justify-center "
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          {users.length < 7 && (
            <Button
              onClick={handleAddUser}
              className="flex justify-center w-full"
            >
              <PlusCircle /> Add Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
