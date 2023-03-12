import { IClass } from "@/dtos";
import { replaceSpecialCharacters } from "@/utils/string";

interface GetFilteredClassesProps {
  classes: IClass[]
  nameFilter: string
  buildingFilter: string

}

export const getFilteredClasses = ({ classes, nameFilter, buildingFilter }: GetFilteredClassesProps) => {
  if (!classes) return [];

    let classesFiltered = [...classes];
    if (nameFilter) {
      classesFiltered = classesFiltered?.filter(
        (c) =>
          replaceSpecialCharacters(c.subject_name.toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase())
          ) ||
          replaceSpecialCharacters((c.professor || "").toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase())
          ) ||
          replaceSpecialCharacters(c.subject_code.toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase())
          )
      );
    }

    if (buildingFilter) {
      classesFiltered = classesFiltered?.filter((c) => {
        const classesInBuilding = c.schedule.filter(
          (s) => s.building === buildingFilter
        );
        return !!classesInBuilding.length;
      });
    }

    return classesFiltered.sort((a, b) => {
      const aDate = new Date(a.start_period);
      const bDate = new Date(b.start_period);

      return aDate.getTime() - bDate.getTime();
    });
}