import { UpdatePasswordForm } from "@/components/forms/update-password";
import { useTranslations } from "next-intl";

export default function SettingsAppearancePage() {
  const i18n = useTranslations("Login");
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{i18n("UpdatedPassword")}</h3>
      </div>
      <UpdatePasswordForm />
    </div>
  );
}
