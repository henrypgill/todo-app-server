import { createDummyTodos } from "./dummyData";

export interface ToDoData {
  id: number;
  title: string;
  description: string;
  status: string;
  created: Date; //format dd-mm-yy
  due: Date; //format dd-mm-yy
}

export interface ServerToDoData {
  id: number;
  title: string;
  description: string;
  status: string;
  created: number;
  due: number;
}

export type DbItem = ServerToDoData;
export type DbItemWithId = DbItem;

const db: DbItemWithId[] = [];

/** Variable to keep incrementing id of database items */
let idCounter = 0;

/**
 * Adds in some dummy database items to the database
 *
 * @param n - the number of items to generate
 * @returns the created items
 */
export function addDummyDbItems(): DbItemWithId[] {
  const createdSignatures: DbItemWithId[] = createDummyTodos(idCounter);
  idCounter = createdSignatures[createdSignatures.length - 1].id;
  createdSignatures.forEach((sig) => addDbItem(sig));
  return createdSignatures;
}

/**
 * Adds in a single item to the database
 *
 * @param data - the item data to insert in
 * @returns the item added (with a newly created id)
 */
export const addDbItem = (data: DbItemWithId): DbItemWithId => {
  const newEntry: DbItemWithId = {
    ...data,
  };
  db.push(newEntry);
  return newEntry;
};

export const getNextIdCounter = () => {
  return idCounter + 1;
};

/**
 * Deletes a database item with the given id
 *
 * @param id - the id of the database item to delete
 * @returns the deleted database item (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteDbItemById = (id: number): DbItemWithId | "not found" => {
  const idxToDeleteAt = findIndexOfDbItemById(id);
  if (typeof idxToDeleteAt === "number") {
    const itemToDelete = getDbItemById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return itemToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database item with a given id
 *
 * @param id - the id of the database item to locate the index of
 * @returns the index of the matching database item,
 *  otherwise the string `"not found"`
 */
const findIndexOfDbItemById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx !== -1) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

/**
 * Find all database items
 * @returns all database items from the database
 */
export const getAllDbItems = (): DbItemWithId[] => {
  return db;
};

/**
 * Locates a database item by a given id
 *
 * @param id - the id of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getDbItemById = (id: number): DbItemWithId | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Applies a partial update to a database item for a given id
 *  based on the passed data
 *
 * @param id - the id of the database item to update
 * @param newData - the new data to overwrite
 * @returns the updated database item (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateDbItemById = (
  id: number,
  newData: Partial<DbItem>
): DbItemWithId | "not found" => {
  const idxOfEntry = findIndexOfDbItemById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
