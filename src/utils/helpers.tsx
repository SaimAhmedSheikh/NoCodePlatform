import { v4 as uuidv4 } from "uuid";

export const createCustomId = (preId?: string | undefined) => {
  return `${preId ?? ""}${uuidv4()}`;
};
