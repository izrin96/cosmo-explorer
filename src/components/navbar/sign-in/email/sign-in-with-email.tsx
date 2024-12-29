import React, { useState } from "react";
import SendEmailForm from "./send-email";
import ExchangeTokenForm from "./exchange-token";

type SignInState = "sending-email" | "exchanging-token";

export default function SignInWithEmail({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<SignInState>("sending-email");
  const [payload, setPayload] = useState({
    transactionId: crypto.randomUUID(),
    email: "",
    pendingToken: "",
  });

  function onEmailSent(email: string, pendingToken: string) {
    setPayload((prev) => ({
      ...prev,
      email,
      pendingToken,
    }));
    setStep("exchanging-token");
  }

  switch (step) {
    case "sending-email":
      return <SendEmailForm payload={payload} onComplete={onEmailSent} />;
    case "exchanging-token":
      return (
        <ExchangeTokenForm
          payload={payload}
          onBack={() => setStep("sending-email")}
          onComplete={onClose}
        />
      );
  }
}
