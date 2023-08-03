import { JoinedAd } from "@/types/joined-ad";
import { AdvertisementDisplay } from "../ui/advertisement-display";

export interface LatestAdsProps {
  ads: JoinedAd[] | null,
  userId: string
}

export function LatestAds({ ads, userId }: LatestAdsProps) {  
  return (
    <>
      <h3
        className="font-semibold text-2xl mb-3"
      >
        Novità:
      </h3>
      <div
        className="flex sm:flex-row flex-col flex-wrap"
      >
        {ads?.map((ad) => 
          <AdvertisementDisplay
            ad={ad}
            userId={userId}
            key={ad.id} 
          />
        )}
      </div>
    </>
  )
}
