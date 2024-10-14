import React from "react";
import { AnalyticsContextProvider } from "./AnalyticsContext";
import { GAuthContextProvider } from "./AuthContext";
import { ScheduleContextProvider } from "./ScheduleContext";

type ContextsProps = {
  children: React.ReactNode;
};

export const Contexts = ({ children }: ContextsProps) => {
  return (
    <GAuthContextProvider>
      <AnalyticsContextProvider>
        <ScheduleContextProvider>{children}</ScheduleContextProvider>
      </AnalyticsContextProvider>
    </GAuthContextProvider>
  );
};
