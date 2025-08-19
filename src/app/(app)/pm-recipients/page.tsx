import AddRecipient from "@/components/add-recipient";
import { Badge } from "@/components/badge";
import { Divider } from "@/components/divider";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/dropdown";
import { Heading } from "@/components/heading";
import { Input, InputGroup } from "@/components/input";
import { Link } from "@/components/link";
import { Select } from "@/components/select";
import SetupProfileBanner from "@/components/setup-profile-banner";
import { Text } from "@/components/text";
import { getEvents } from "@/data";
import UsersService from "@/services/users";
import { currentUser } from "@clerk/nextjs/server";
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PM Recipients",
};

export default async function Events() {
  let events = await getEvents();

  const user = await currentUser();

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const userProfile = await UsersService.getUserWithPMRecipients(user.id);

  const isProfileNotSetup = !Boolean(userProfile);

  return (
    <>
      <Heading>Pocket Money Recipients</Heading>
      {isProfileNotSetup && <SetupProfileBanner />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search recipients&hellip;" />
              </InputGroup>
            </div>
            <div>
              <Select name="sort_by">
                <option value="name">Sort by name</option>
                <option value="date">Sort by date</option>
                <option value="status">Sort by status</option>
              </Select>
            </div>
          </div>
        </div>
        <AddRecipient />
      </div>

      {isProfileNotSetup && (
        <Text>
          Please set up your profile to manage your Pocket Money recipients.
        </Text>
      )}

      <ul className="mt-10">
        {userProfile?.userPocketMoneyRecipients.map((recipient, index) => (
          <li key={recipient.recipientId}>
            <Divider soft={index > 0} />
            <div className="flex items-center justify-between">
              <div key={recipient.recipientId} className="flex gap-6 py-6">
                <div className="space-y-1.5">
                  <div className="text-base/6 font-semibold">
                    <Link href={`/pm-recipients/${recipient.recipientId}`}>
                      {recipient.recipient.firstname}{" "}
                      {recipient.recipient.lastname}
                    </Link>
                  </div>
                  <div className="text-xs/6 text-zinc-500">
                    Started at {recipient.recipient.createdAt?.toDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* <Badge
                  className="max-sm:hidden"
                  color={event.status === "On Sale" ? "lime" : "zinc"}
                >
                  {event.status}
                </Badge> */}
                <Dropdown>
                  <DropdownButton plain aria-label="More options">
                    <EllipsisVerticalIcon />
                  </DropdownButton>
                  <DropdownMenu anchor="bottom end">
                    <DropdownItem
                      href={`/pm-recipients/${recipient.recipientId}`}
                    >
                      View
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
