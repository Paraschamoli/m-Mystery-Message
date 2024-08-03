"use client";

import { Session } from "inspector";
import { SessionProvider } from "next-auth/react";
import { Component } from "react";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
