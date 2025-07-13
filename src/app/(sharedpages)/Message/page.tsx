"use client";

import { useEffect, useState } from "react";
import CreateMaterial from "./CreateMaterial";

type Material = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string;
};

export default function Messages() {
  const [messages, setMessages] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/materials");
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);
      } catch  {
        setError( "Something went wrong fetching materials");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Loading sent messages...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
if (messages.length === 0) return <p>No messages sent yet.</p>;

  return (

    <>
    <div className="mb-6">
        <CreateMaterial/>
    </div>
       <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sent Messages</h2>
      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg._id} className="border rounded p-4">
            <h3 className="text-lg font-medium">{msg.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Sent: {new Date(msg.createdAt).toLocaleString()} <br />
              Expires: {new Date(msg.expiresAt).toLocaleDateString()}
            </p>
            <p>{msg.content}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
 
  );
}
