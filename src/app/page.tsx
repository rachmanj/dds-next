import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h1>Hello World</h1>
        <p>This is a test</p>
        {/* Modal and button logic using shadcn modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="lg">
              Click me
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to the jungle</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              {/* Optionally, you can add a close button or actions here */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
