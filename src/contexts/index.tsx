import { AuthContextProvider } from "./AuthContext";
import { ScheduleContextProvider } from "./ScheduleContext";

type ContextsProps = {
  children: React.ReactNode;
};

export const Contexts = ({ children }: ContextsProps) => {
  return (
    <AuthContextProvider>
      <ScheduleContextProvider>{children}</ScheduleContextProvider>
    </AuthContextProvider>
  );
};
