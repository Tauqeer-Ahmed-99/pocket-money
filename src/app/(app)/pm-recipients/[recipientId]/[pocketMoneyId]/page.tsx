import React from "react";

const PocketMoney = async ({
  params,
}: {
  params: Promise<{ recipientId: string; pocketMoneyId: string }>;
}) => {
  const { recipientId, pocketMoneyId } = await params;

  return <div>PocketMoney ID: {pocketMoneyId}</div>;
};

export default PocketMoney;
