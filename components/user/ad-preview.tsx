import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AdPreview } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
export function AdPreview({ adPreview }: { adPreview: AdPreview }) {
  return (
    <Link href="">
      <Card className="w-auto border-0 p-0 text-center flex  flex-col justify-content-center items-center">
        <CardContent className="p-0">
          <Image
            key={adPreview?.id}
            src={adPreview?.cover_url!}
            height={300}
            width={150}
            alt={adPreview?.cover_url!}
          />
        </CardContent>
        <CardFooter className="flex flex-col p-0 pt-1 gap-0 m-0 text-wrap max-w-36">
          <p className=" font-semibold">{adPreview?.book_title}</p>
          <p className="text-sm text-muted-foreground">
            {adPreview?.book_author}
          </p>
          <p className="font-semibold ">$ {adPreview?.price}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
