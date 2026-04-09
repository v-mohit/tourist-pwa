import HeroSection from "./components/HeroSection";
import StatsBar from "./components/StatsBar";
import TabsBar from "./components/TabsBar";
import TopDestinations from "./components/TopDestinations";
import PackagesSection from "./components/PackagesSection";
import FeaturesSection from "./components/FeaturesSection";
import TopMonuments from "./components/TopMonuments";
import WildlifeSection from "./components/WildlifeSection";
import MuseumsSection from "./components/MuseumsSection";
import HomeClient from "./HomeClient";
import HotelSection from "../hotels/hotelSection";

type HomeProps = {
  data: any;
  topPackageData: any;
  cityData: any;
  categoryCountsData: any;
};

export default function Home({ data, topPackageData, cityData, categoryCountsData }: HomeProps) {
  const sections = data?.home?.data?.attributes?.home || [];

  const monuments = sections.find(
    (s: any) => s.__typename === "ComponentHomeMonuments",
  );

  const wildlife = sections.find(
    (s: any) => s.__typename === "ComponentHomeWildLife",
  );

  const museums = sections.find(
    (s: any) => s.__typename === "ComponentHomeMuseum",
  );

  return (
    <div className="w-full">
      <HeroSection />
      <StatsBar categoryCountsData={categoryCountsData} />
      <TabsBar />
      <TopDestinations
        cities={cityData?.cities}
        destination={cityData?.destination}
      />
      <PackagesSection data={topPackageData} />
      <TopMonuments data={monuments} />
      <WildlifeSection data={wildlife} />
      <MuseumsSection data={museums} />
      <HotelSection />
      <FeaturesSection />
      <HomeClient />
    </div>
  );
}
