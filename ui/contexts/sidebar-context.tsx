"use client";

import React, { createContext, useState, useContext } from "react";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  hasUpdate: boolean;
  setHasUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  collapsed: false,
  setCollapsed: () => {},
  hasUpdate: false,
  setHasUpdate: () => {},
});

import { ReactNode } from "react";

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, hasUpdate, setHasUpdate }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
