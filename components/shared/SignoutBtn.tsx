"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignoutBtn() {
  return (
    <Button
      type="button"
      variant="ghost"
      className="!bg-transparent hover:!bg-secondary/80 rounded-full border-0 shadow-none"
      onClick={() => signOut({ redirectTo: "/" })}
    >
      <LogOut />
    </Button>
  );
}
