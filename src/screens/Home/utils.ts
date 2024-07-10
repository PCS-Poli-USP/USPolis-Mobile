import { IClass } from '@/dtos'
import { ICourse } from '@/dtos/courses'
import { replaceSpecialCharacters } from '@/utils/string'

interface GetFilteredClassesProps {
  classes: IClass[]
  nameFilter: string
  buildingFilter: string
}
interface GetFilteredCoursesProps {
  courses: ICourse[]
  nameFilter: string
  buildingFilter: string
}

export const getFilteredClasses = ({
  classes,
  nameFilter,
  buildingFilter,
}: GetFilteredClassesProps) => {
  if (!classes) return []

  let classesFiltered = [...classes]
  if (nameFilter) {
    classesFiltered = classesFiltered?.filter(
      (c) =>
        replaceSpecialCharacters(c.subject_name.toLowerCase()).includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ) ||
        replaceSpecialCharacters((c.professor[0] || '').toLowerCase()).includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ) ||
        replaceSpecialCharacters(c.subject_code.toLowerCase()).includes(
          replaceSpecialCharacters(nameFilter.toLowerCase()),
        ),
    )
  }

  if (buildingFilter) {
    classesFiltered = classesFiltered?.filter((c) => {
      const classesInBuilding = c.schedules.filter(
        (s) => s.building === buildingFilter,
      )
      return !!classesInBuilding.length
    })
  }

  return classesFiltered.sort((a, b) => {
    const aDate = new Date(a.start_date)
    const bDate = new Date(b.end_date)

    return aDate.getTime() - bDate.getTime()
  })
}

export const getFilteredCourses = ({
  courses,
  nameFilter,
  buildingFilter,
}: GetFilteredCoursesProps) => {
  if (!courses) return []

  let coursesFiltered = [...courses]

  if (nameFilter || buildingFilter) {
    const correctBuilding =
      buildingFilter === 'Biênio' ? 'Ciclo Básico' : buildingFilter

    coursesFiltered = coursesFiltered?.filter((c) => {
      return (
        (nameFilter &&
          replaceSpecialCharacters(c.program.toLowerCase()).includes(
            replaceSpecialCharacters(nameFilter.toLowerCase()),
          )) ||
        (correctBuilding &&
          replaceSpecialCharacters(c.program.toLowerCase()).includes(
            replaceSpecialCharacters(correctBuilding.toLowerCase()),
          ))
      )
    })
  }

  return coursesFiltered
}
