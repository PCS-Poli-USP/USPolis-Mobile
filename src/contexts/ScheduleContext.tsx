import Toast from 'react-native-toast-message';
import { useCallback, useEffect } from "react";
import { createContext, useState } from "react";
import { scheduleStorage } from "@/storage/schedule";

export type ScheduleContextDataProps = {
  schedule: number[];
  isLoadingStorageSchedule: boolean;
  toggleClassOnSchedule: (classId: number) => void;
};

type ScheduleContextProviderProps = {
  children: React.ReactNode;
};

export const ScheduleContext = createContext({} as ScheduleContextDataProps);

export const ScheduleContextProvider = ({
  children,
}: ScheduleContextProviderProps) => {
  const [schedule, setSchedule] = useState<number[]>([]);
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
    (classId: number) => {
      if (schedule.includes(classId)) {
        Toast.show({
          type: 'info',
          text1: 'Removida!',
          text2: 'Disciplina removida do seu horário.'
        });
        setSchedule((state) => state.filter((c) => c !== classId));
      } else {
        Toast.show({
          type: 'info',
          text1: 'Adicionada!',
          text2: 'Disciplina adicionada ao seu horário.'
        });
        setSchedule((state) => [...state, classId]);
      }
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
