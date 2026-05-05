import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import HeroSection from "./components/HeroSection";
import StatsBar from "./components/StatsBar";
import TabsBar from "./components/TabsBar";
import TopDestinations from "./components/TopDestinations";
import Departments from "./components/Departments";

const PackagesSection = dynamic(() => import("./components/PackagesSection"), {
  loading: () => <div className="min-h-[420px] bg-[#f8f3e8] animate-pulse" />,
});
const FeaturesSection = dynamic(() => import("./components/FeaturesSection"), {
  loading: () => <div className="min-h-[240px] bg-[#f8f3e8] animate-pulse" />,
});
const TopMonuments = dynamic(() => import("./components/TopMonuments"), {
  loading: () => <div className="min-h-[340px] bg-[#f8f3e8] animate-pulse" />,
});
const WildlifeSection = dynamic(() => import("./components/WildlifeSection"), {
  loading: () => <div className="min-h-[340px] bg-[#f8f3e8] animate-pulse" />,
});
const MuseumsSection = dynamic(() => import("./components/MuseumsSection"), {
  loading: () => <div className="min-h-[340px] bg-[#f8f3e8] animate-pulse" />,
});
const HomeClient = dynamic(() => import("./HomeClient"), {
  loading: () => <div className="min-h-[280px] bg-[#f8f3e8] animate-pulse" />,
});
const JkkSection = dynamic(() => import("./components/JkkSection"), {
  loading: () => <div className="min-h-[260px] bg-[#f8f3e8] animate-pulse" />,
});
const HotelSection = dynamic(() => import("../hotels/hotelSection"), {
  loading: () => <div className="min-h-[260px] bg-[#f8f3e8] animate-pulse" />,
});
const ParkSection = dynamic(() => import("./components/ParkSection"), {
  loading: () => <div className="min-h-[240px] bg-[#f8f3e8] animate-pulse" />,
});
const TouristStats = dynamic(() => import("./components/TouristStats"), {
  loading: () => <div className="min-h-[240px] bg-[#f8f3e8] animate-pulse" />,
});
const LightSoundShow = dynamic(() => import("./components/Light&SoundShow"), {
  loading: () => <div className="min-h-[320px] bg-[#f8f3e8] animate-pulse" />,
});
const Cafeteria = dynamic(() => import("./components/Cafeteria"), {
  loading: () => <div className="min-h-[260px] bg-[#f8f3e8] animate-pulse" />,
});
const AsiSection = dynamic(() => import("./components/AsiSection"), {
  loading: () => <div className="min-h-[260px] bg-[#f8f3e8] animate-pulse" />,
});
const MobileSection = dynamic(() => import("./components/MobileSection"), {
  loading: () => <div className="min-h-[260px] bg-[#f8f3e8] animate-pulse" />,
});
const FeedbackSection = dynamic(() => import("./components/FeedbackSection"), {
  loading: () => <div className="min-h-[260px] bg-[#f8f3e8] animate-pulse" />,
});



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
    (dept: any) => dept?.attributes?.Name === "Archaeological Survey of India",
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
      <HeroSection data={sectionMap["ComponentHomeSlider"]} />
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
      <AsiSection data={updatedDepartmentData} />
      <ParkSection data={sectionMap["ComponentHomeParks"]} />
      <HotelSection />
      <TouristStats />
      <MobileSection />
      <FeedbackSection />
      <FeaturesSection />
      <Departments data={departmentData} />
      <HomeClient />
    </div>
  );
}
