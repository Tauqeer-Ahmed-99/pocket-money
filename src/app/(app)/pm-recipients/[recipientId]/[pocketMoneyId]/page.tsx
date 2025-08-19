import { Stat } from "@/app/stat";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Heading, Subheading } from "@/components/heading";
import { Link } from "@/components/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import PocketMoneysService from "@/services/pocket-moneys";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import React from "react";

const PocketMoney = async ({
  params,
}: {
  params: Promise<{ recipientId: string; pocketMoneyId: string }>;
}) => {
  const { recipientId, pocketMoneyId } = await params;

  const [recipient, transactions] = await Promise.all([
    PocketMoneysService.getRecipient(recipientId, pocketMoneyId),
    PocketMoneysService.getTransactions(pocketMoneyId),
  ]);

  const pocketMoney = recipient?.pocketMoneys[0];

  return (
    <>
      {/* <div>PocketMoney ID: {pocketMoneyId}</div> */}
      <div className="max-lg:hidden">
        <Link
          href={`/pm-recipients/${recipientId}`}
          className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Pocket Moneys - {recipient?.firstname} {recipient?.lastname}
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Heading>
                {recipient?.firstname} {recipient?.lastname} -{" "}
                {pocketMoney?.startDate.toDateString()} to{" "}
                {pocketMoney?.endDate.toDateString()}
              </Heading>
            </div>
            <div className="mt-2 text-sm/6 text-zinc-500">
              Started at {recipient?.createdAt?.toDateString()}
            </div>
          </div>
        </div>
        {/* <div className="flex gap-4">
          <Button outline>Edit</Button>
          <Button>View</Button>
        </div> */}
      </div>
      <Subheading className="mt-12">Pocket Moneys</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Sr. No.</TableHeader>
            <TableHeader>Installment Date</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
            <TableHeader className="text-center">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((txn, index) => (
            <TableRow
              key={txn.transactionId}
              href={`/pm-recipients/${recipientId}/${pocketMoneyId}/${txn.transactionId}`}
              // title={`Order #${order.id}`}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{txn.createdAt?.toDateString()}</TableCell>
              <TableCell className="text-right">INR {txn.amount}</TableCell>
              <TableCell className="text-center">
                <Badge color={txn.finalStatus === "success" ? "lime" : "zinc"}>
                  {(txn.finalStatus?.charAt(0).toUpperCase() ??
                    txn.status.charAt(0).toUpperCase()) +
                    (txn.finalStatus?.slice(1) ?? txn.status.slice(1))}
                  {/* {txn.finalStatus?.charAt(0).toUpperCase() ??
                    txn.status?.charAt(0)} + 
                  (txn.finalStatus?.slice(1) ?? "ending")} */}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PocketMoney;
