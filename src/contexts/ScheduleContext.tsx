import { useCallback, useEffect } from "react";
import { createContext, useState } from "react";
import { scheduleStorage } from "@/storage/schedule";

export type ScheduleContextDataProps = {
  schedule: string[];
  isLoadingStorageSchedule: boolean;
  toggleClassOnSchedule: (classId: string) => void;
};

type ScheduleContextProviderProps = {
  children: React.ReactNode;
};

export const ScheduleContext = createContext({} as ScheduleContextDataProps);

export const ScheduleContextProvider = ({
  children,
}: ScheduleContextProviderProps) => {
  const [schedule, setSchedule] = useState<string[]>([]);
  const [isLoadingStorageSchedule, setIsLoadingStorageSchedule] =
    useState(true);

  const loadScheduleData = useCallback(async () => {
    try {
      const schedule = await scheduleStorage.get();

      if (!!schedule) setSchedule(schedule);
    } catch (err) {
      throw err;
    } finally {
      setIsLoadingStorageSchedule(false);
    }
  }, []);

  const toggleClassOnSchedule = useCallback(
    (classId: string) => {
      if (schedule.includes(classId))
        setSchedule((state) => state.filter((c) => c !== classId));
      else setSchedule((state) => [...state, classId]);
    },
    [schedule]
  );

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  useEffect(() => {
    scheduleStorage.save(schedule);
  }, [schedule]);

  return (
    <ScheduleContext.Provider
      value={{
        schedule,
        isLoadingStorageSchedule,
        toggleClassOnSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
