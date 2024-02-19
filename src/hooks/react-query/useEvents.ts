import { IEvent } from "@/dtos/events";
import api from "@/services/api";
import { useQuery } from "react-query";

export const useEvents = () => {
  const query = useQuery(
    ["events"],
    async () => {
      const response = await api
        .get<IEvent[]>("/institutional-events")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log("Erro: ", error);
          return [];
        });
    },
    {
      keepPreviousData: true,
    }
  );

  return query;
};
