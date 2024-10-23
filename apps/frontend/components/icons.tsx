import {
  ArrowRight,
  ChevronLeft,
  Laptop,
  Loader2,
  Moon,
  SunMedium,
  LucideProps,
  LayoutDashboard,
  FolderKanban,
  User,
  type Icon as LucideIcon,
  Settings,
  X,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  arrowRight: ArrowRight,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  teams: User,
  settings: Settings,
  close: X,
  hamburger: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-menu"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  user: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-user"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  // logo: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (

  // ),
};
