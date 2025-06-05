import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the notification data interface
export interface NotificationData {
  screen?: string;
  productId?: number | string;
  marketId?: number | string;
  [key: string]: any; // Allow for any additional data
}

interface NotificationContextType {
  pendingCount: number;
  setPendingCount: (count: number) => void;
  lastNotification: NotificationData | null;
  setLastNotification: (data: NotificationData | null) => void;
  handleNotificationData: (data: NotificationData) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  pendingCount: 0,
  setPendingCount: () => {},
  lastNotification: null,
  setLastNotification: () => {},
  handleNotificationData: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [lastNotification, setLastNotification] =
    useState<NotificationData | null>(null);

  // Utility function to process incoming notification data
  const handleNotificationData = (data: NotificationData) => {
    // Increment pending count
    setPendingCount((prevCount) => prevCount + 1);
    // Store the notification data
    setLastNotification(data);
  };

  return (
    <NotificationContext.Provider
      value={{
        pendingCount,
        setPendingCount,
        lastNotification,
        setLastNotification,
        handleNotificationData,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
