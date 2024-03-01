import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Woel",
  description: "Woel sell and buy",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
