"use client";

import { Modal, TextField, Form, Button, Note } from "@/components/ui";
import React, { useState, useTransition } from "react";
import { sendRamperEmail } from "./actions";
import { EmailSignInPayload } from "./common";

type Props = {
  payload: EmailSignInPayload;
  onComplete: (email: string, pendingToken: string) => void;
};

export default function SendEmailForm({ payload, onComplete }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<{}>();

  async function submit(form: FormData) {
    startTransition(async () => {
      const result = await sendRamperEmail(form);

      switch (result.status) {
        case "error":
          setError(result.error);
          setValidationErrors(result.validationErrors);
          break;
        case "success":
          onComplete(result.data.email, result.data.pendingToken);
          break;
      }
    });
  }

  return (
    <Form
      validationErrors={validationErrors}
      onSubmit={(e) => {
        e.preventDefault();
        submit(new FormData(e.currentTarget));
      }}
    >
      <Modal.Body className="flex flex-col gap-3">
        {error && <Note intent="danger">{error}</Note>}
        <div className="text-sm">
          Enter your COSMO email address to request a sign-in email.
        </div>
        <input
          type="hidden"
          name="transactionId"
          value={payload.transactionId}
        />
        <TextField
          isRequired
          autoFocus
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close>Cancel</Modal.Close>
        <Button type="submit" isPending={isPending}>
          Send Email
        </Button>
      </Modal.Footer>
    </Form>
  );
}
