import { FetchPlaceDetailsDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';
import PlaceDetailPage from '@/features/place-details/ClientCityDetail';

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugParam = decodeURIComponent(slug);

  const placeDetailData = await graphqlClient.request(FetchPlaceDetailsDocument, {
    slug: slugParam,
  });

  return <PlaceDetailPage data={placeDetailData} />;
}