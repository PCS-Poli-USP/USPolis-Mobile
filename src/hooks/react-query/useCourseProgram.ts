import { ICourse, ICourseProgram } from "@/dtos/courses";
import api from "@/services/api";
import { useQuery } from "react-query";

interface CourseProgramProps {
  program: string
  period: string
}

export const useCourseProgram = (props: CourseProgramProps) => {
  const query = useQuery(["course-program"], async () => {
    const response = await api.get<ICourseProgram[]>(`/programs/classes?program=${props.program}&period=${props.period}`)
    return response.data
  }, {
    enabled: !!props.program && !!props.period
  });

  return query;
}