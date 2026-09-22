"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Inbox,
  Clock,
  Mail,
  MailOpen,
} from "lucide-react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/reusable/PageHeader";

type Material = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export default function InboxPage() {
  const { data: session } = useSession();

  const user = {
    id: session?.user.id,
    name: session?.user.name,
  };
  const READ_STORAGE_KEY = `readMessages_${user.id}`;

  const [messages, setMessages] = useState<Material[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  const getReadMessages = useCallback((): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(READ_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [READ_STORAGE_KEY]);

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
  }, [getReadMessages, user.name]);

  const markAsRead = (id: string) => {
    if (id === "default-welcome") return;

    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
    );

    const readIds = getReadMessages();
    if (!readIds.includes(id)) {
      saveReadMessages([...readIds, id]);
      window.dispatchEvent(new Event("messageRead"));
    }
  };

  const handleOpen = (msg: Material) => {
    setSelectedMsg(msg);
    if (!msg.read) markAsRead(msg._id);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2" style={{ color: "var(--ax-muted)" }}>
          <div className="h-5 w-5 animate-spin rounded-full border-2" style={{ borderColor: "var(--ax-border)", borderTopColor: "var(--ax-purple)" }} />
          Loading inbox...
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Inbox"
        description={`${unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}`}
        icon={<Inbox className="size-5" />}
      />

      {messages.length === 0 ? (
        <div className="ax-card flex flex-col items-center gap-3 py-20">
          <div className="grid size-14 place-items-center rounded-2xl" style={{ backgroundColor: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
            <Mail className="size-7" />
          </div>
          <p className="text-[15px] font-medium" style={{ color: "var(--ax-text)" }}>No messages</p>
          <p className="text-sm" style={{ color: "var(--ax-muted)" }}>Your inbox is empty</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {messages.map((msg) => (
            <button
              key={msg._id}
              onClick={() => handleOpen(msg)}
              className="ax-card flex w-full items-center gap-4 p-4 text-left transition-all hover:shadow-md"
              style={!msg.read ? { borderLeft: "3px solid var(--ax-purple)", borderColor: "var(--ax-purple)" } : {}}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                style={msg.read ? { backgroundColor: "var(--ax-surface-soft)", color: "var(--ax-faint)" } : { backgroundColor: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
                {msg.read ? <MailOpen className="size-5" /> : <Mail className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-[15px]"
                    style={msg.read ? { fontWeight: 500, color: "var(--ax-muted)" } : { fontWeight: 600, color: "var(--ax-text)" }}>
                    {msg.title}
                  </h3>
                  {!msg.read && (
                    <span className="inline-flex size-2 shrink-0 rounded-full" style={{ backgroundColor: "var(--ax-purple)" }} />
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm" style={{ color: "var(--ax-muted)" }}>
                  {msg.content}
                </p>
              </div>
              <div className="hidden shrink-0 items-center gap-1.5 text-xs sm:flex" style={{ color: "var(--ax-faint)" }}>
                <Clock className="size-3.5" />
                {new Date(msg.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={!!selectedMsg} onOpenChange={(o) => !o && setSelectedMsg(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl" style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface)" }}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl" style={{ backgroundColor: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
                {selectedMsg?.read ? <MailOpen className="size-5" /> : <Mail className="size-5" />}
              </div>
              <div>
                <DialogTitle className="text-lg" style={{ color: "var(--ax-text)" }}>
                  {selectedMsg?.title}
                </DialogTitle>
                <DialogDescription className="text-xs" style={{ color: "var(--ax-muted)" }}>
                  {selectedMsg && format(new Date(selectedMsg.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto rounded-xl p-4 text-sm leading-relaxed" style={{ backgroundColor: "var(--ax-surface-soft)", color: "var(--ax-text)" }}>
            {selectedMsg?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
