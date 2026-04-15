import { FetchCityDetailsDocument } from '@/generated/graphql';
import { graphqlClient } from '@/services/client';
import CityDetails from '@/features/city-details/CityDetails';

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugParam = decodeURIComponent(slug);

  const cityDetailData = await graphqlClient.request(FetchCityDetailsDocument, {
    slug: slugParam,
  });

  return <CityDetails cityDetailData={cityDetailData} />;
}