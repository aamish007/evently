"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL
);

// 👇 THIS is the missing piece
function useClerkAuthForConvex() {
  return useAuth({ template: "convex" });
}

export function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithClerk
      client={convex}
      useAuth={useClerkAuthForConvex}
    >
      {children}
    </ConvexProviderWithClerk>
  );
}
