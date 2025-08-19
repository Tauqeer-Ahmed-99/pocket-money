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
import { getEvent, getEventOrders } from "@/data";
import RecipientsService from "@/services/recipients";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recipientId: string }>;
}): Promise<Metadata> {
  let { recipientId } = await params;
  let event = await getEvent(recipientId);

  return {
    title: event?.name,
  };
}

export default async function Event({
  params,
}: {
  params: Promise<{ recipientId: string }>;
}) {
  const { recipientId } = await params;

  const recipient = await RecipientsService.getRecipient(recipientId);

  const event = await getEvent("1000");

  return (
    <>
      {/* <div>Recipient ID: {recipientId}</div> */}
      <div className="max-lg:hidden">
        <Link
          href="/pm-recipients"
          className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          PM Recipients
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Heading>
                {recipient?.firstname} {recipient?.lastname}
              </Heading>
              <Badge color={event.status === "On Sale" ? "lime" : "zinc"}>
                {event.status}
              </Badge>
            </div>
            <div className="mt-2 text-sm/6 text-zinc-500">
              Started at {recipient?.createdAt?.toDateString()}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button outline>Edit</Button>
          <Button>View</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <Stat
          title="Total revenue"
          value={event.totalRevenue}
          change={event.totalRevenueChange}
        />
        <Stat
          title="Tickets sold"
          value={`${event.ticketsSold}/${event.ticketsAvailable}`}
          change={event.ticketsSoldChange}
        />
        <Stat
          title="Pageviews"
          value={event.pageViews}
          change={event.pageViewsChange}
        />
      </div>
      <Subheading className="mt-12">Pocket Moneys</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Sr. No.</TableHeader>
            <TableHeader>Start Date</TableHeader>
            <TableHeader>End Date</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
            <TableHeader className="text-center">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipient?.pocketMoneys.map((pm, index) => (
            <TableRow
              key={pm.pocketMoneyId}
              href={`/pm-recipients/${recipientId}/${pm.pocketMoneyId}`}
              // title={`Order #${order.id}`}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{pm.startDate.toDateString()}</TableCell>
              <TableCell>{pm.endDate.toDateString()}</TableCell>
              <TableCell className="text-right">INR {pm.amount}</TableCell>
              <TableCell className="text-center">
                <Badge color={pm.status === "active" ? "lime" : "zinc"}>
                  {pm.status.charAt(0).toUpperCase() + pm.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
