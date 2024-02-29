import { IEvent } from "@/dtos/events";
import api from "@/services/api";
import { useQuery } from "react-query";

export const useEvents = () => {
  const query = useQuery(
    ["events"],
    async () => {
      try {
        const response = await api.get<IEvent[]>("/institutional-events");
        return response.data;
      } catch {
        return [];
      }
    },
    {
      keepPreviousData: true,
    }
  );

  return query;
};
