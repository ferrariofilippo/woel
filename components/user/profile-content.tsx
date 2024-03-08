import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { UserAdvertisments } from "./user-ads";
import { UserReviews } from "./user-reviews";

export function ProfilePageContent({ username }: { username: string }) {
  const i18nCommon = useTranslations("Common");
  return (
    <Tabs
      defaultValue="advertisments"
      className="justify-center flex items-center flex-col w-screen gap-2"
    >
      <TabsList className="grid grid-cols-2 max-w-xl">
        <TabsTrigger value="advertisments">
          {i18nCommon("Advertisments")}
        </TabsTrigger>
        <TabsTrigger value="reviews">{i18nCommon("Reviews")}</TabsTrigger>
      </TabsList>
      <TabsContent value="advertisments">
        <UserAdvertisments username={username} />
      </TabsContent>
      <TabsContent value="reviews">
        <UserReviews username={username} />
      </TabsContent>
    </Tabs>
  );
}
