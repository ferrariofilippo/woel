import { ProfileForm } from "@/components/profile/profile-form";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/api/auth";
import { getSchoolSpecializations, getSchools } from "@/lib/api/schools";
import { getUserByID } from "@/lib/api/user";
import { UserData } from "@/types/api";
import { User } from "@supabase/supabase-js";
export default async function SettingsProfilePage() {
  const user: User = await getSessionUser();
  const profile: UserData = await getUserByID(user.id);
  const schools = await getSchools();
  const profileSpecializations = await getSchoolSpecializations(
    profile.school_id!
  );
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground"></p>
      </div>
      <Separator className="my-4" />
      <ProfileForm
        profile={profile}
        schools={schools}
        specializations={profileSpecializations}
      />
    </div>
  );
}
