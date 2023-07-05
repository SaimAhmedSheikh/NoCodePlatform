import { v4 as uuidv4 } from "uuid";

export const createCustomId = (preId?: string | undefined) => {
  return `${preId ?? ""}${uuidv4()}`;
};

export const extractFieldValue = (key: string, classNames: string) => {
  const splittedClasses: string[] = classNames.split(" ");
  let selectedClass = "";
  splittedClasses.forEach((className) => {
    if (className.includes(key)) {
      selectedClass = className;
    }
  });
  if (selectedClass !== "") {
    return selectedClass.split("-")[1];
  }
  return selectedClass;
};
