import TouristAttraction from '@/features/tourist-attraction/TouristAttraction';
import { FetchTouristAttractionDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';

export const revalidate = 60;

export default async function Page({ searchParams }: { searchParams: { categoryId?: string } }) {
  const categoryId = searchParams.categoryId;
  
  const touristAttractionData = await graphqlClient.request(
    FetchTouristAttractionDocument,
    {
      id: categoryId || undefined,
      sortBy: ["name:asc"],
      searchKey: "",
      cityName: "",
    }
  );

  return <TouristAttraction data={touristAttractionData} />;
}