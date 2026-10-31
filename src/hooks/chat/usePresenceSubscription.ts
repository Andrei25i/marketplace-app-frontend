import { subscribePresence, unsubscribePresence } from "@/realtime/presence";
import { useEffect } from "react";

const usePresenceSubscription = (userIds: string[]) => {
  const key = [...new Set(userIds)].sort().join(",");

  useEffect(() => {
    if (!key) return;

    const ids = key.split(",");
    subscribePresence(ids);
    return () => unsubscribePresence(ids);
  }, [key]);
};

export default usePresenceSubscription;
