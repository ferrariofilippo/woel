import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAdvertisments } from "./user-ads";
import { UserReviews } from "./user-reviews";

export function ProfilePageContent({ username }: { username: string }) {
  return (
    <Tabs
      defaultValue="advertisments"
      className="justify-center flex items-center flex-col w-screen gap-2"
    >
      <TabsList className="grid grid-cols-2 max-w-xl">
        <TabsTrigger value="advertisments">Advertisments</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
