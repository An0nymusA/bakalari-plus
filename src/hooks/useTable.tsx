import React, { createContext, useContext } from "react";

import { isToday } from "@utils/utils";

interface TableSharedProps {
  cols: Record<number, number>;
  activeDay: number | null;
  activeHour: number | null;
}

interface TableContextProps extends TableSharedProps {
  isActive: (hour: number, day: number, dayDate: string) => boolean;
}

interface TableProviderProps extends TableSharedProps {
  children: React.ReactNode;
  type: "actual" | "permanent";
}

const TableContext = createContext<TableContextProps>({
  cols: {},
  activeDay: null,
  activeHour: null,
  isActive: () => false,
});

// Modified Provider Component
export const TableProvider = ({
  children,
  cols,
  activeDay,
  activeHour,
  type,
}: TableProviderProps) => {
  const isActive = (hour: number, day: number, dayDate: string) => {
    return (
      type === "actual" &&
      activeDay === day &&
      activeHour === hour &&
      isToday(dayDate)
    );
  };

  return (
    <TableContext.Provider value={{ cols, activeDay, activeHour, isActive }}>
      {children}
    </TableContext.Provider>
  );
};

// Custom hook for easier access
export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};
