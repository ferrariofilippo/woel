"use client";
import { Form } from "@/components/ui/form";
import { ReactNode } from "react";

export default function WoelForm({
  sumbit,
  form,
  children,
}: {
  sumbit: any;
  form: any;
  children: ReactNode;
}) {
  return (
    <Form {...form}>
      <form onSubmit={sumbit} className="space-y-8">
        {children}
      </form>
    </Form>
  );
}
