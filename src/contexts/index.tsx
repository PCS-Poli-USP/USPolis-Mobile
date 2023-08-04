import { AnalyticsContextProvider } from "./AnalyticsContext";
import { AuthContextProvider } from "./AuthContext";
import { ScheduleContextProvider } from "./ScheduleContext";

type ContextsProps = {
  children: React.ReactNode;
};

export const Contexts = ({ children }: ContextsProps) => {
  return (
    <AuthContextProvider>
      <AnalyticsContextProvider>
        <ScheduleContextProvider>{children}</ScheduleContextProvider>
      </AnalyticsContextProvider>
    </AuthContextProvider>
  );
};
