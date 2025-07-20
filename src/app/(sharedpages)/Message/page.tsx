"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateMaterial from "./CreateMaterial";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

import { UpdateMaterialModal } from "./UpdateMaterial";
import { DeleteMaterialModal } from "./DeletMaterial";

type Material = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string;
};

export default function Messages() {
  const router = useRouter();
  const [messages, setMessages] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/materials");
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data);
    } catch {
      setError("Something went wrong fetching materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading)
    return (
      <div className="flex justify-center py-12 text-muted-foreground">
        Loading sent messages...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-red-600">
        <AlertTriangle className="w-10 h-10" />
        <p>{error}</p>
      </div>
    );

 
 return (
  <div className="max-w-4xl mx-auto p-6">
    <Button
      variant="ghost"
      className="mb-6 flex items-center gap-2"
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-4 h-4" /> Go Back
    </Button>

    <CreateMaterial />

    <h2 className="text-3xl font-bold my-8 text-center">Sent Messages</h2>

    {messages.length === 0 ? (
      <p className="text-center py-12 text-muted-foreground">
        No messages sent yet.
      </p>
    ) : (
      <ul className="space-y-4">
        {messages.map((msg) => {
          const isOpen = openId === msg._id;
          return (
            <li key={msg._id} className="border rounded-lg shadow-sm bg-white">
              <Button
                onClick={() => toggleOpen(msg._id)}
                className="flex justify-between items-center w-full p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-t-lg"
                aria-expanded={isOpen}
              >
                <h3 className="text-lg font-semibold">{msg.title}</h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-indigo-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-indigo-500" />
                )}
              </Button>

              {isOpen && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Sent:</strong>{" "}
                    {new Date(msg.createdAt).toLocaleString()} <br />
                    <strong>Expires:</strong>{" "}
                    {new Date(msg.expiresAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>

                  <div className="pt-3 flex gap-3">
                    <UpdateMaterialModal
                      material={msg}
                      onUpdated={fetchMessages}
                    />
                    <DeleteMaterialModal
                      materialId={msg._id}
                      onDeleted={(deletedId) =>
                        setMessages((prev) =>
                          prev.filter((m) => m._id !== deletedId)
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);


}
