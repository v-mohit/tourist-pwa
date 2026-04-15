import TouristAttraction from "@/features/tourist-attraction/TouristAttraction";
import { FetchTouristAttractionDocument } from "@/generated/graphql";
import { graphqlClient } from "@/services/client";

export const revalidate = 60;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const params = await searchParams;

  const categoryIdParam = params?.categoryId;
  const categoryId = Array.isArray(categoryIdParam)
    ? categoryIdParam[0]
    : categoryIdParam;

  const touristAttractionData = await graphqlClient.request(
    FetchTouristAttractionDocument,
    {
      id: categoryId || undefined,
      sortBy: ["name:asc"],
      searchKey: "",
      cityName: "",
    },
  );

  return <TouristAttraction data={touristAttractionData} />;
}
