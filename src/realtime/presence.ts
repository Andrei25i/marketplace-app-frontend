import { usePresenceStore } from "@/store/usePresenceStore";
import { socket } from "./socket";

const MAX_IDS_PER_REQUEST = 50;

const subscriberCount = new Map<string, number>();

const requestSubscribe = (userIds: string[]) => {
  if (userIds.length === 0 || !socket.connected) return;

  for (let i = 0; i < userIds.length; i += MAX_IDS_PER_REQUEST) {
    const chunk = userIds.slice(i, i + MAX_IDS_PER_REQUEST);

    socket.emit("presence:subscribe", { userIds: chunk }, (response) => {
      if (response.ok) usePresenceStore.getState().setMany(response.data);
    });
  }
};

export const subscribePresence = (userIds: string[]) => {
  const added: string[] = [];

  for (const id of userIds) {
    const count = subscriberCount.get(id) ?? 0;
    subscriberCount.set(id, count + 1);
    if (count === 0) added.push(id);
  }

  requestSubscribe(added);
};

export const unsubscribePresence = (userIds: string[]) => {
  const removed: string[] = [];

  for (const id of userIds) {
    const count = subscriberCount.get(id) ?? 0;
    if (count <= 1) {
      subscriberCount.delete(id);
      if (count === 1) removed.push(id);
    } else {
      subscriberCount.set(id, count - 1);
    }
  }

  if (removed.length > 0 && socket.connected) {
    socket.emit("presence:unsubscribe", { userIds: removed });
  }
};

export const resubscribePresence = () => {
  requestSubscribe([...subscriberCount.keys()]);
};
