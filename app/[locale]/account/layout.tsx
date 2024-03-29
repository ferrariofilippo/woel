import { SidebarNav } from "@/components/profile/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { profileSidebarNavItems } from "@/lib/costants";
import { useTranslations } from "next-intl";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const i18n = useTranslations("SettingsLayout");

  return (
    <>
      <div className="space-y-6 p-10 pb-16 md:block ">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            {i18n("AccountSettings")}
          </h2>
          <p className="text-muted-foreground">{i18n("ManagePreferences")}</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={profileSidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
