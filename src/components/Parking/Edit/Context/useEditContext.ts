import { useContext } from "react";
import { EditContext } from "./EditContext";

export const useEditContext = () => {
  const ctx = useContext(EditContext);
  if (!ctx)
    throw new Error("useEditContext must be used inside EditContextProvider");
  return ctx;
};
