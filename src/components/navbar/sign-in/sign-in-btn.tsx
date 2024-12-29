"use client";

import { Button, Note, Modal } from "@/components/ui";
import React, { useState } from "react";
import SignInWithEmail from "./email/sign-in-with-email";

export default function SignInButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Sign In</Button>
      <Modal.Content
        isOpen={open}
        onOpenChange={setOpen}
        shouldCloseOnInteractOutside={() => false}
      >
        <Modal.Header>
          <Modal.Title>Sign In</Modal.Title>
          <Modal.Description>
            <div className="py-2"></div>
            <Note intent="info">
              Please note that this sign-in is a work in progress. Currently, no
              features benefit from signing in.
            </Note>
          </Modal.Description>
        </Modal.Header>

        <SignInWithEmail onClose={() => setOpen(false)} />
      </Modal.Content>
    </>
  );
}
