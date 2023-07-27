import { JoinedAd } from "@/types/joined-ad";
import { AdvertisementDisplay } from "../ui/advertisement-display";

export interface LatestAdsProps {
  ads: JoinedAd[] | null
}

export function LatestAds({ ads }: LatestAdsProps) {  
  return (
    <div
      className=""
    >
      <h3
        className="font-semibold text-2xl"
      >
        Ultimi:
      </h3>
      <div
        className=""
      >
        {ads?.map((ad) => 
          <AdvertisementDisplay
            ad={ad}
            key={ad.id} 
          />
        )}
      </div>
    </div>
  )
}
