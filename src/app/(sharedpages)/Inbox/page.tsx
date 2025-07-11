"use client";

import { useEffect, useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

import { Loader2 } from "lucide-react";

type Material = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Material[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Add welcome message manually
  const user = { name: "John Doe" }; // Replace with actual user logic

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

      if (Array.isArray(data)) {
        setMessages([welcomeMessage, ...data]);
      } else {
        console.error("Expected array, got:", data);
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
}, []);


  const markAsRead = async (id: string) => {
    if (id === "default-welcome") return;

    await fetch("/api/materials/Inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialId: id }),
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === id ? { ...msg, read: true } : msg
      )
    );
  };

  const handleOpen = (id: string) => {
    setSelectedId(id);
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.read) markAsRead(id);
  };

  if (loading)
    return (
      <div className="p-6">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (messages.length === 0)
    return <div className="p-6">No messages.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Inbox</h1>

      {messages.map((msg) => (
        <Drawer key={msg._id}>
          <DrawerTrigger asChild>
            <div
              onClick={() => handleOpen(msg._id)}
              className={`cursor-pointer border p-4 rounded-md shadow-sm flex justify-between items-center ${
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
