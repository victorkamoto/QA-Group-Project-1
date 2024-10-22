import * as React from "react";

import { cn } from "../lib/utils";
import { Icons } from "./icons";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Image
            src={"logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="pl-4 ml-12"
          />
          <p className="text-center text-sm leading-loose md:text-left">
            The source code is available on{" "}
            <a
              href={"https://github.com/victorkamoto/QA-Group-Project-1"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
