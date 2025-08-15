import Link from "next/link";

export default function SetupProfileBanner({
  onProfilePage,
}: {
  onProfilePage?: boolean;
}) {
  return (
    <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-orange-300 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pr-3.5 sm:pl-4 dark:bg-orange-800 dark:inset-ring dark:inset-ring-orange-200/30 my-4">
      <p className="text-sm/6 text-black dark:text-white">
        <strong className="font-semibold">Setup Profile</strong>
        <svg
          viewBox="0 0 2 2"
          aria-hidden="true"
          className="mx-2 inline size-0.5 fill-current"
        >
          <circle r={1} cx={1} cy={1} />
        </svg>
        To add recipients and schedule pocket money transfers, please complete
        your profile.
      </p>
      {!onProfilePage && (
        <Link
          href="/settings"
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-white/10 dark:inset-ring-white/20 dark:hover:bg-white/15 dark:focus-visible:outline-white"
        >
          Setup now <span aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </div>
  );
}
