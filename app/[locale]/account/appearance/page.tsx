import { AppearanceForm } from "@/components/forms/appearance";
import LocaleSwitcher from "@/components/profile/locale-switcher";
import { Separator } from "@/components/ui/separator";
import * as changeCase from "change-case";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
export default function SettingsAppearancePage() {
  const i18nCommon = useTranslations("Common");
  const i18n = useTranslations("Appearance");
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{i18nCommon("Appearance")}</h3>
        <p className="text-sm text-muted-foreground">{i18n("Customize")}</p>
      </div>
      <Separator className="my-4" />
      <AppearanceForm />
      <div>
        <p className="text-sm font-medium">{i18nCommon("Language")}</p>
        <p className="text-sm text-muted-foreground">{i18n("Customize")} </p>
      </div>
      <LocaleSwitcher />
    </div>
  );
}
