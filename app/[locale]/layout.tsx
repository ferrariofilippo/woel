import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { NavbarWrapper } from "@/components/layout/navbar/navbar-wrapper";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import * as changeCase from "change-case";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className="max-w-screen m-0 p-0 overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen">
              <NavbarWrapper>
                <Navbar />
              </NavbarWrapper>
              {children}
            </div>
            <Toaster />
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

const locales = ["en", "it"];
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Common" });
  const headersList = headers();
  const currentPath = headersList.get("pathname")?.split("/").slice(1).pop()!;
  if (currentPath !== locale) {
    return {
      title: t(changeCase.pascalCase(currentPath)),
    };
  }
  return { title: "Woel" };
}
