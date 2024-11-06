import Link from "next/link";

import { cn } from "../../../lib/utils";
import { buttonVariants } from "../../../components/ui/button";
import { SignupForm } from "../../../components/signup";
import Image from "next/image";
import { Icons } from "@/components/icons";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Home
        </>
      </Link>
      <Link
        href="/auth/login"
        className={cn(
          buttonVariants({ variant: "default" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center items-center justify-center">
          <Image src={"../logo.svg"} alt="logo" width={75} height={75} />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials below to create your account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
