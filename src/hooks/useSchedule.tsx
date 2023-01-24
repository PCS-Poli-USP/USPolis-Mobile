import { ScheduleContext } from "@/contexts/ScheduleContext";
import { useContext } from "react";

export const useSchedule = () => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error("useSchedule must be used within an AuthProvider");
  }

  return context;
};
