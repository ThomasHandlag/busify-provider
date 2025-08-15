/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const useWebSocket = ({
  url,
  topic,
  onMessage,
}: {
  url: string;
  topic: string;
  onMessage: (message: any) => void;
}) => {
  useEffect(() => {
    // Make sure the topic is provided before trying to connect
    if (!topic) return;

    const socket = new SockJS(url);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame: any) => {
      console.log("Connected: " + frame);
      stompClient.subscribe(topic, (message: any) => {
        const newNotification = JSON.parse(message.body);
        console.log("Received message:", newNotification);
        onMessage(newNotification);
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [url, topic, onMessage]); // The effect re-runs if the topic changes
};
