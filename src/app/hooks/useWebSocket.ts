/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Stomp, CompatClient } from "@stomp/stompjs";

interface UseWebSocketReturn {
  sendMessage: (destination: string, body: any, headers?: any) => void;
  isConnected: boolean;
  disconnect: () => void;
  subscribe: (topic: string, callback: (message: any) => void) => void;
  unsubscribe: (topic: string) => void;
}

export const useWebSocket = ({
  url,
  topic,
  onMessage,
}: {
  url: string;
  topic?: string;
  onMessage?: (message: any) => void;
}): UseWebSocketReturn => {
  const stompClientRef = useRef<CompatClient | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback((destination: string, body: any, headers: any = {}) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send(destination, headers, JSON.stringify(body));
      console.log(`Message sent to ${destination}:`, body);
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }, []);

  const subscribe = useCallback((subscribeTopic: string, callback: (message: any) => void) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      // Unsubscribe if already subscribed to this topic
      if (subscriptionsRef.current.has(subscribeTopic)) {
        subscriptionsRef.current.get(subscribeTopic).unsubscribe();
      }

      const subscription = stompClientRef.current.subscribe(subscribeTopic, (message: any) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log(`Received message from ${subscribeTopic}:`, parsedMessage);
          callback(parsedMessage);
        } catch (error) {
          console.error("Error parsing message:", error);
          callback(message.body);
        }
      });

      subscriptionsRef.current.set(subscribeTopic, subscription);
      console.log(`Subscribed to topic: ${subscribeTopic}`);
    } else {
      console.warn("WebSocket is not connected. Cannot subscribe to topic.");
    }
  }, []);

  const unsubscribe = useCallback((unsubscribeTopic: string) => {
    if (subscriptionsRef.current.has(unsubscribeTopic)) {
      subscriptionsRef.current.get(unsubscribeTopic).unsubscribe();
      subscriptionsRef.current.delete(unsubscribeTopic);
      console.log(`Unsubscribed from topic: ${unsubscribeTopic}`);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      // Clear all subscriptions
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();
      
      stompClientRef.current.disconnect();
      setIsConnected(false);
      console.log("WebSocket disconnected");
    }
  }, []);

  useEffect(() => {
    const socket = new SockJS(url);
    const stompClient = Stomp.over(socket);
    const currentSubscriptions = subscriptionsRef.current;

    // Disable debug logging (optional)
    stompClient.debug = () => {};

    stompClient.connect(
      {},
      (frame: any) => {
        console.log("Connected: " + frame);
        setIsConnected(true);
        stompClientRef.current = stompClient;
      },
      (error: any) => {
        console.error("Connection error: ", error);
        setIsConnected(false);
      }
    );

    return () => {
      if (stompClient.connected) {
        // Clear all subscriptions
        currentSubscriptions.forEach((subscription) => {
          subscription.unsubscribe();
        });
        currentSubscriptions.clear();
        
        stompClient.disconnect();
        setIsConnected(false);
      }
    };
  }, [url]);

  // Auto-subscribe to initial topic when connected
  useEffect(() => {
    if (topic && onMessage && isConnected && stompClientRef.current) {
      subscribe(topic, onMessage);
    }
  }, [topic, onMessage, isConnected, subscribe]);

  return {
    sendMessage,
    isConnected,
    disconnect,
    subscribe,
    unsubscribe,
  };
};
