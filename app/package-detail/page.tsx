import Home from '@/features/home/Home';
import PackageDetail from '@/features/package-details/PackageDetail';
import { FetchPackageDetailDocument} from '@/generated/graphql';
import { graphqlClient } from '@/services/client';
import {useSearchParams} from 'next/navigation'
export const revalidate = 60;

export default async function Page({searchParams}: any) {
    // const searchParams = useSearchParams();
    const slug = searchParams?.slug;
    console.log('PackageDetail slug:', slug);
    const data = await graphqlClient.request(FetchPackageDetailDocument, {slug: slug as string});

  return <PackageDetail data={data} />;
}