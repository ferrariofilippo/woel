import { getUserAds } from "@/lib/api/ads";
import { AdPreview } from "./ad-preview";

export async function UserAdvertisments({ username }: { username: string }) {
  const userAds = await getUserAds(username);
  return (
    <div className="flex flex-row gap-5 flex-wrap max-w-4xl justify-center xl:justify-start">
      {userAds.map((adPreview: any) => {
        return <AdPreview key={adPreview.id} adPreview={adPreview} />;
      })}
    </div>
  );
}
