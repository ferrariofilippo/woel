import { ProfileForm } from "@/components/forms/profile";
import { getSessionUser } from "@/lib/api/auth";
import { getSchoolSpecializations, getSchools } from "@/lib/api/schools";
import { getUserByID } from "@/lib/api/user";
import { UserData } from "@/types/api";
import { User } from "@supabase/supabase-js";
export default async function CompleteProfilePage() {
  const user: User = await getSessionUser();
  const profile: UserData = await getUserByID(user.id);
  const schools = await getSchools();
  const profileSpecializations = await getSchoolSpecializations(
    profile.school_id!
  );
  return (
    <div className="flex py-4 justify-center items-center min-w-min	 ">
      <ProfileForm
        profile={profile}
        schools={schools}
        specializations={profileSpecializations ?? []}
        redirectOnSumbit={true}
      />
    </div>
  );
}
