import Link from "next/link";
import { MainNav } from "../../components/main-nav";
import { UserAccountNav } from "../../components/user-account-nav";
import { navConfig } from "../../config/nav";
import { Button } from "../../components/ui/button";
import { SiteFooter } from "../../components/site-footer";

interface CoreLayoutProps {
  children: React.ReactNode;
}

export default async function CoreLayout({ children }: CoreLayoutProps) {
  const session = {
    user: {
      name: "",
      email: "",
      avatar: "",
    },
  };
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={navConfig.mainNav} />
          {session && (
            <UserAccountNav
              user={{
                name: session?.user?.name,
                avatar: session?.user?.avatar,
                email: session?.user?.email,
              }}
            />
          )}
          {!session && (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant={"outline"}>
                  <span>Log in</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant={"default"}>
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="container flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
