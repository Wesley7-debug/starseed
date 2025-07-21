// export function markMessageAsRead(messageId: string) {
//   const key = "readMessagesTeacher";
//   try {
//     const stored = localStorage.getItem(key);
//     const readIds = stored ? JSON.parse(stored) : [];

//     if (!readIds.includes(messageId)) {
//       readIds.push(messageId);
//       localStorage.setItem(key, JSON.stringify(readIds));
//       // Notify Sidebar to update
//       window.dispatchEvent(new Event("messageRead"));
//     }
//   } catch (error) {
//     console.error("Failed to mark message as read", error);
//   }
// }
