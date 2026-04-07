import { FetchPlaceDetailsDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';
import PlaceDetailPage from '@/features/place-details/ClientCityDetail';

export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const slugParam = decodeURIComponent(slug);

  console.log("Fetching data for slug:", slugParam);

  const placeDetailData = await graphqlClient.request(FetchPlaceDetailsDocument, {
    slug: slugParam,
  });

  console.log("placeDetailData (Server):", placeDetailData);

  return <PlaceDetailPage data={placeDetailData} />;
}