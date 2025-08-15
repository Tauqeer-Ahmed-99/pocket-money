"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const PaymentProcessError = () => {
  const searchParams = useSearchParams();

  const txnStatus = searchParams.get("txnStatus");
  const message = searchParams.get("message");

  return (
    <div>
      <h1>Payment Process Error</h1>
      <p>Status: {txnStatus}</p>
      <p>Message: {message}</p>
    </div>
  );
};

export default PaymentProcessError;
