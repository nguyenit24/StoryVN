"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  resource: string,
  action: string,
  FallbackComponent?: React.ComponentType
) {
  return function WithPermissionComponent(props: P) {
    const { hasPermission, isLoading } = useAuth();

    if (isLoading) {
      return null;
    }

    if (!hasPermission(resource, action)) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
