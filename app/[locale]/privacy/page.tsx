import MdPageLayout from "@/components/mdPagelayout";

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="md:px-0 sm:px-12 px-6 sm:mx-auto mx-0 xl:w-1/2 md:w-2/3 my-8">
      <MdPageLayout locale={locale} />
    </div>
  );
}
