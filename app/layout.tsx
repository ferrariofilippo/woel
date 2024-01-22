import { Navbar } from "@/components/layout/navbar";
import { NavbarWrapper } from "@/components/layout/navbar/navbar-wrapper";
import { ThemeProvider } from "@/components/layout/theme-provider";

import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "@/lib/api/auth";
import "./globals.css";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Woel",
  description: "Woel sell and buy",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className="max-w-screen m-0 p-0 overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavbarWrapper>
            <Navbar session={session.data.session} />
          </NavbarWrapper>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
