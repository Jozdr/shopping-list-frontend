
import * as mock from "./listApi.mock";
import * as real from "./listApi.real";

const USE_MOCKS =
  process.env.REACT_APP_USE_MOCKS === "true" || true; 

const impl = USE_MOCKS ? mock : real;

export const getLists = impl.getLists;
export const getListById = impl.getListById;
export const createList = impl.createList;
export const deleteList = impl.deleteList;
