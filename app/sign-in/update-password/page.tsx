import { UpdatePasswordForm } from "@/components/profile/update-password-form";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Update your password</h3>
      </div>
      <UpdatePasswordForm />
    </div>
  );
}
