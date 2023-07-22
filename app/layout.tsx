import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { hiddenNavbarRoutes } from "@/lib/costants";
import { headers } from "next/headers";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Woel",
  description: "Woel sell and buy",
};

export default function RootLayout({
  children,
  isNavbarHidden,
}: {
  children: React.ReactNode;
  isNavbarHidden: boolean;
}) {
  return (
    <html lang="en">
      <body className=" px-24">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {!isNavbarHidden && <Navbar />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
export async function getServerSideProps() {
  const headersList = headers();
  const fullUrl = headersList.get("referer") || "";
  const currentPagePath = fullUrl
    .split(process.env.APP_DOMAIN!)
    .slice(-1)
    .pop();
  const isNavbarHidden = hiddenNavbarRoutes.includes(currentPagePath!);

  return {
    props: {
      isNavbarHidden: isNavbarHidden,
    },
  };
}
