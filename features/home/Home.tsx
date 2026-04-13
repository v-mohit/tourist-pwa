import { Suspense } from "react";
import { useMemo } from "react";
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
import JkkSection from "./components/JkkSection";
import HotelSection from "../hotels/hotelSection";
import ParkSection from "./components/ParkSection";
import TouristStats from "./components/TouristStats";
import LightSoundShow from "./components/Light&SoundShow";
import Cafeteria from "./components/Cafeteria";
import AsiSection from "./components/AsiSection";

interface HomeProps {
  data?: any;
  cityData?: any;
  topPackageData?: any;
  categoryCountsData?: any;
  upcomingEventsData?: any;
  JkkplaceDetailsData?: any;
  departmentData?: any;
}

export default function Home({
  data,
  cityData,
  topPackageData,
  categoryCountsData,
  upcomingEventsData,
  JkkplaceDetailsData,
  departmentData,
}: HomeProps) {
  const sections = data?.home?.data?.attributes?.home || [];
  const updatedDepartmentData = departmentData?.departments?.data?.find(
  (dept: any) =>
    dept?.attributes?.Name === "Archaeological Survey of India"
)?.attributes;

  const sectionMap = useMemo(() => {
    return sections.reduce((acc: any, section: any) => {
      acc[section.__typename] = section;
      return acc;
    }, {});
  }, [sections]);

  const { cities, destination } = cityData || {};

  return (
    <div className="w-full">
      <HeroSection />
      <StatsBar categoryCountsData={categoryCountsData} />
      <TabsBar />
      <Suspense fallback={<div>Loading...</div>}>
        <TopDestinations cities={cities} destination={destination} />
      </Suspense>
      <PackagesSection data={topPackageData} />
      <TopMonuments data={sectionMap["ComponentHomeMonuments"]} />
      <WildlifeSection data={sectionMap["ComponentHomeWildLife"]} />
      <MuseumsSection data={sectionMap["ComponentHomeMuseum"]} />
      <LightSoundShow data={sectionMap["ComponentHomeLightAndSoundShow"]} />
      <Cafeteria data={sectionMap["ComponentHomeCafeteria"]} />
      <JkkSection
        JkkplaceDetailsData={JkkplaceDetailsData}
        upcomingEventsData={upcomingEventsData}
      />
      <HotelSection />
      <ParkSection data={sectionMap["ComponentHomeParks"]} />
      <TouristStats />
      <AsiSection  data={updatedDepartmentData}/>
      <FeaturesSection />
      <HomeClient />
    </div>
  );
}
