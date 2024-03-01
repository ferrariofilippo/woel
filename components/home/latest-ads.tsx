import { JoinedAd } from "@/types/joined-ad";
import { getTranslations } from "next-intl/server";
import { AdvertisementDisplay } from "../ui/advertisement-display";

export interface LatestAdsProps {
  ads: JoinedAd[] | null;
  userId: string;
}

export async function LatestAds({ ads, userId }: LatestAdsProps) {
  const t = await getTranslations("LatestAds");
  return (
    <>
      <h3 className="font-semibold text-2xl -mb-3">{t("TitleWhatsNew")}</h3>
      <div className="flex sm:flex-row flex-col flex-wrap">
        {ads?.map((ad) => (
          <AdvertisementDisplay ad={ad} userId={userId} key={ad.id} />
        ))}
      </div>
    </>
  );
}
