import { Button, Modal, Note, Form } from "@/components/ui";
import React, { useState, useTransition } from "react";
import { EmailSignInPayload } from "./common";
import { exchangeRamperToken } from "./actions";
import { useWallet } from "@/hooks/use-wallet";

type Props = {
  payload: EmailSignInPayload;
  onBack: () => void;
  onComplete: () => void;
};

export default function ExchangeTokenForm({
  payload,
  onBack,
  onComplete,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<{}>();
  const { connect, connectStatus } = useWallet();

  async function submit(form: FormData) {
    startTransition(async () => {
      const result = await exchangeRamperToken(form);
      switch (result.status) {
        case "error":
          setError(result.error);
          setValidationErrors(result.validationErrors);
          break;
        case "success":
          // todo: mutate without using react-query
          connect(result.data, {
            onSuccess: () => onComplete(),
          });
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
        <input
          type="hidden"
          name="transactionId"
          value={payload.transactionId}
        />
        <input type="hidden" name="email" value={payload.email} />
        <input type="hidden" name="pendingToken" value={payload.pendingToken} />
        <div className="text-sm">
          A COSMO login email has been sent to your email address. Click{" "}
          <span className="font-semibold">confirm from a different device</span>{" "}
          in the email, then come back here and click Continue button.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="outline" onPress={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          isPending={isPending || connectStatus === "pending"}
        >
          Continue
        </Button>
      </Modal.Footer>
    </Form>
  );
}
