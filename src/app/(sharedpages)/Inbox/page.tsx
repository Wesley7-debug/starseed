"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Loader2, ArrowLeft } from "lucide-react";

type Material = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
};

const user = {
  id: "teacher123",
  role: "teacher",
  name: "John Doe",
};

export default function InboxPage() {
  const router = useRouter();
  const READ_STORAGE_KEY = `readMessages_${user.id}`;

  const [messages, setMessages] = useState<Material[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getReadMessages = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(READ_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveReadMessages = (ids: string[]) => {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(ids));
  };

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/materials/Inbox");
        const data = await res.json();

        const welcomeMessage: Material = {
          _id: "default-welcome",
          title: "Welcome",
          content: `Welcome ${user.name}, this is the official website of Immaculate Star Seed Academy.`,
          createdAt: new Date().toISOString(),
          read: true,
        };

        const readIds = getReadMessages();

        if (Array.isArray(data)) {
          const mapped = data.map((msg: Material) => ({
            ...msg,
            read: readIds.includes(msg._id),
          }));
          setMessages([welcomeMessage, ...mapped]);
        } else {
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Inbox fetch error:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [READ_STORAGE_KEY]);

  const markAsRead = (id: string) => {
    if (id === "default-welcome") return;

    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
    );

    const readIds = getReadMessages();
    if (!readIds.includes(id)) {
      saveReadMessages([...readIds, id]);

      // Notify sidebar to update the badge
      window.dispatchEvent(new Event("messageRead"));
    }
  };

  const handleOpen = (id: string) => {
    setSelectedId(id);
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.read) markAsRead(id);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) return <div className="p-6">No messages.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      {/* Go Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Inbox</h1>

      {messages.map((msg) => (
        <Drawer key={msg._id}>
          <DrawerTrigger asChild>
            <div
              onClick={() => handleOpen(msg._id)}
              className={`cursor-pointer border p-4 rounded-md shadow-sm flex justify-between items-center transition ${
                msg.read ? "bg-white" : "bg-blue-100"
              }`}
            >
              <div>
                <h3 className="font-medium text-md">{msg.title}</h3>
                <p className="text-sm text-muted-foreground truncate max-w-xs">
                  {msg.content}
                </p>
              </div>

              {!msg.read && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                  1
                </span>
              )}
            </div>
          </DrawerTrigger>

          <DrawerContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">{msg.title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {msg.content}
            </p>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
