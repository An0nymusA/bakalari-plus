import React, { useState, useContext, createContext } from "react";

// Step 1: Create the context
const TableContext = createContext({
  cols: {} as Record<number, number>,
});

// Modified Provider Component
export const TableProvider = ({
  children,
  cols,
}: {
  children: React.ReactNode;
  cols: Record<number, number>;
}) => {
  return (
    <TableContext.Provider value={{ cols: cols }}>
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
