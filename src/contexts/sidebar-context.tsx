import { createContextId } from "@builder.io/qwik";

export interface SidebarContextState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isAuthenticated: boolean;
  userData: any;
}

export const SidebarContext =
  createContextId<SidebarContextState>("sidebar-context");
