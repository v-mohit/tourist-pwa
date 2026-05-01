/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ActPolicyAndSchemeContentDynamicZoneInput: { input: any; output: any; }
  AllMediaContentDynamicZoneInput: { input: any; output: any; }
  AllPackageContentDynamicZoneInput: { input: any; output: any; }
  BestTimeContentDynamicZoneInput: { input: any; output: any; }
  CityDetailContentDynamicZoneInput: { input: any; output: any; }
  ContactUsContentDynamicZoneInput: { input: any; output: any; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  DestinationContentDynamicZoneInput: { input: any; output: any; }
  EmployeeCornerContentDynamicZoneInput: { input: any; output: any; }
  ExploreAllContentDynamicZoneInput: { input: any; output: any; }
  ExploreContentDynamicZoneInput: { input: any; output: any; }
  FilmShootingContentDynamicZoneInput: { input: any; output: any; }
  FilmistanContentDynamicZoneInput: { input: any; output: any; }
  ForeignTouristContentDynamicZoneInput: { input: any; output: any; }
  HeritagePropertyContentDynamicZoneInput: { input: any; output: any; }
  HomeHomeDynamicZoneInput: { input: any; output: any; }
  HowToGetThereContentDynamicZoneInput: { input: any; output: any; }
  IhmsAndFciContentDynamicZoneInput: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: { input: any; output: any; }
  LuxuryOnWheelContentDynamicZoneInput: { input: any; output: any; }
  PlaceDetailContentDynamicZoneInput: { input: any; output: any; }
  RajasthanTravelGuideContentDynamicZoneInput: { input: any; output: any; }
  RegistrationForTravelAgencyContentDynamicZoneInput: { input: any; output: any; }
  SeeAllPlaceContentDynamicZoneInput: { input: any; output: any; }
  SuggestedItinerieContentDynamicZoneInput: { input: any; output: any; }
  TravelDairyContentDynamicZoneInput: { input: any; output: any; }
  TravelDeskBannerDynamicZoneInput: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type ActPolicyAndScheme = {
  __typename?: 'ActPolicyAndScheme';
  content?: Maybe<Array<Maybe<ActPolicyAndSchemeContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ActPolicyAndSchemeContentDynamicZone = ComponentCommonPolicyCard | ComponentFilmistanBanner | Error;

export type ActPolicyAndSchemeEntity = {
  __typename?: 'ActPolicyAndSchemeEntity';
  attributes?: Maybe<ActPolicyAndScheme>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ActPolicyAndSchemeEntityResponse = {
  __typename?: 'ActPolicyAndSchemeEntityResponse';
  data?: Maybe<ActPolicyAndSchemeEntity>;
};

export type ActPolicyAndSchemeInput = {
  content?: InputMaybe<Array<Scalars['ActPolicyAndSchemeContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Activity = {
  __typename?: 'Activity';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<UploadFileRelationResponseCollection>;
  link?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ActivityImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ActivityEntity = {
  __typename?: 'ActivityEntity';
  attributes?: Maybe<Activity>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ActivityEntityResponse = {
  __typename?: 'ActivityEntityResponse';
  data?: Maybe<ActivityEntity>;
};

export type ActivityEntityResponseCollection = {
  __typename?: 'ActivityEntityResponseCollection';
  data: Array<ActivityEntity>;
  meta: ResponseCollectionMeta;
};

export type ActivityFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ActivityFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ActivityFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ActivityFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  link?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ActivityRelationResponseCollection = {
  __typename?: 'ActivityRelationResponseCollection';
  data: Array<ActivityEntity>;
};

export type Adventure = {
  __typename?: 'Adventure';
  city?: Maybe<CityEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  image?: Maybe<UploadFileRelationResponseCollection>;
  name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Long']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type AdventureImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type AdventureEntity = {
  __typename?: 'AdventureEntity';
  attributes?: Maybe<Adventure>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type AdventureEntityResponse = {
  __typename?: 'AdventureEntityResponse';
  data?: Maybe<AdventureEntity>;
};

export type AdventureEntityResponseCollection = {
  __typename?: 'AdventureEntityResponseCollection';
  data: Array<AdventureEntity>;
  meta: ResponseCollectionMeta;
};

export type AdventureFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<AdventureFiltersInput>>>;
  city?: InputMaybe<CityFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  details?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<AdventureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<AdventureFiltersInput>>>;
  popularity?: InputMaybe<LongFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type AdventureInput = {
  city?: InputMaybe<Scalars['ID']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  popularity?: InputMaybe<Scalars['Long']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AdventureListBanner = {
  __typename?: 'AdventureListBanner';
  banner?: Maybe<ComponentCommonBanner>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AdventureListBannerEntity = {
  __typename?: 'AdventureListBannerEntity';
  attributes?: Maybe<AdventureListBanner>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type AdventureListBannerEntityResponse = {
  __typename?: 'AdventureListBannerEntityResponse';
  data?: Maybe<AdventureListBannerEntity>;
};

export type AdventureListBannerInput = {
  banner?: InputMaybe<ComponentCommonBannerInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AllMedia = {
  __typename?: 'AllMedia';
  content?: Maybe<Array<Maybe<AllMediaContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AllMediaContentDynamicZone = ComponentCommonPolicyCard | ComponentFilmistanBanner | ComponentHomeDiscoverBeautifulPlace | ComponentMediaEvents | ComponentMediaGallery | ComponentMediaPrintAds | ComponentMediaVideo | Error;

export type AllMediaEntity = {
  __typename?: 'AllMediaEntity';
  attributes?: Maybe<AllMedia>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type AllMediaEntityResponse = {
  __typename?: 'AllMediaEntityResponse';
  data?: Maybe<AllMediaEntity>;
};

export type AllMediaInput = {
  content?: InputMaybe<Array<Scalars['AllMediaContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AllPackage = {
  __typename?: 'AllPackage';
  content?: Maybe<Array<Maybe<AllPackageContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AllPackageContentDynamicZone = ComponentFilmistanBanner | ComponentPackagePackage | Error;

export type AllPackageEntity = {
  __typename?: 'AllPackageEntity';
  attributes?: Maybe<AllPackage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type AllPackageEntityResponse = {
  __typename?: 'AllPackageEntityResponse';
  data?: Maybe<AllPackageEntity>;
};

export type AllPackageInput = {
  content?: InputMaybe<Array<Scalars['AllPackageContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type BestTime = {
  __typename?: 'BestTime';
  content?: Maybe<Array<Maybe<BestTimeContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  header?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type BestTimeContentDynamicZone = ComponentBestTimeBestTimeDetails | ComponentBestTimeWeatherCondition | Error;

export type BestTimeEntity = {
  __typename?: 'BestTimeEntity';
  attributes?: Maybe<BestTime>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type BestTimeEntityResponse = {
  __typename?: 'BestTimeEntityResponse';
  data?: Maybe<BestTimeEntity>;
};

export type BestTimeInput = {
  content?: InputMaybe<Array<Scalars['BestTimeContentDynamicZoneInput']['input']>>;
  header?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  contains?: InputMaybe<Scalars['Boolean']['input']>;
  containsi?: InputMaybe<Scalars['Boolean']['input']>;
  endsWith?: InputMaybe<Scalars['Boolean']['input']>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  eqi?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Boolean']['input']>;
  gte?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  lt?: InputMaybe<Scalars['Boolean']['input']>;
  lte?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
  nei?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars['Boolean']['input']>;
  notContainsi?: InputMaybe<Scalars['Boolean']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  startsWith?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Category = {
  __typename?: 'Category';
  Name?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  icon: UploadFileEntityResponse;
  places?: Maybe<PlaceRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type CategoryPlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CategoryEntity = {
  __typename?: 'CategoryEntity';
  attributes?: Maybe<Category>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type CategoryEntityResponse = {
  __typename?: 'CategoryEntityResponse';
  data?: Maybe<CategoryEntity>;
};

export type CategoryEntityResponseCollection = {
  __typename?: 'CategoryEntityResponseCollection';
  data: Array<CategoryEntity>;
  meta: ResponseCollectionMeta;
};

export type CategoryFiltersInput = {
  Name?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<CategoryFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CategoryInput = {
  Name?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['ID']['input']>;
  places?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CategoryRelationResponseCollection = {
  __typename?: 'CategoryRelationResponseCollection';
  data: Array<CategoryEntity>;
};

export type City = {
  __typename?: 'City';
  activities?: Maybe<ActivityRelationResponseCollection>;
  cityDetail?: Maybe<CityDetailEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  festivalsAndFairs?: Maybe<FestivalsAndFairRelationResponseCollection>;
  howToReachHere?: Maybe<ComponentCommonMap>;
  image?: Maybe<UploadFileEntityResponse>;
  name: Scalars['String']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  places?: Maybe<PlaceRelationResponseCollection>;
  popularity: Scalars['Long']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type CityActivitiesArgs = {
  filters?: InputMaybe<ActivityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type CityFestivalsAndFairsArgs = {
  filters?: InputMaybe<FestivalsAndFairFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type CityPlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CityDetail = {
  __typename?: 'CityDetail';
  city?: Maybe<CityEntityResponse>;
  content?: Maybe<Array<Maybe<CityDetailContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CityDetailContentDynamicZone = ComponentCityDetailActivities | ComponentCityDetailCitiesToVisit | ComponentCityDetailCombine | ComponentCityDetailFairs | ComponentCityDetailHeader | ComponentCityDetailHowToReachThere | ComponentCityDetailPlaces | ComponentCityDetailVisit | Error;

export type CityDetailEntity = {
  __typename?: 'CityDetailEntity';
  attributes?: Maybe<CityDetail>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type CityDetailEntityResponse = {
  __typename?: 'CityDetailEntityResponse';
  data?: Maybe<CityDetailEntity>;
};

export type CityDetailEntityResponseCollection = {
  __typename?: 'CityDetailEntityResponseCollection';
  data: Array<CityDetailEntity>;
  meta: ResponseCollectionMeta;
};

export type CityDetailFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CityDetailFiltersInput>>>;
  city?: InputMaybe<CityFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<CityDetailFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CityDetailFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CityDetailInput = {
  city?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Array<Scalars['CityDetailContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CityEntity = {
  __typename?: 'CityEntity';
  attributes?: Maybe<City>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type CityEntityResponse = {
  __typename?: 'CityEntityResponse';
  data?: Maybe<CityEntity>;
};

export type CityEntityResponseCollection = {
  __typename?: 'CityEntityResponseCollection';
  data: Array<CityEntity>;
  meta: ResponseCollectionMeta;
};

export type CityFiltersInput = {
  activities?: InputMaybe<ActivityFiltersInput>;
  and?: InputMaybe<Array<InputMaybe<CityFiltersInput>>>;
  cityDetail?: InputMaybe<CityDetailFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  festivalsAndFairs?: InputMaybe<FestivalsAndFairFiltersInput>;
  howToReachHere?: InputMaybe<ComponentCommonMapFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  nickname?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CityFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CityFiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
  popularity?: InputMaybe<LongFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CityInput = {
  activities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  cityDetail?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  festivalsAndFairs?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  howToReachHere?: InputMaybe<ComponentCommonMapInput>;
  image?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  places?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  popularity?: InputMaybe<Scalars['Long']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CityRelationResponseCollection = {
  __typename?: 'CityRelationResponseCollection';
  data: Array<CityEntity>;
};

export type ComponentBestTimeBestTimeDetails = {
  __typename?: 'ComponentBestTimeBestTimeDetails';
  align?: Maybe<Enum_Componentbesttimebesttimedetails_Align>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
};

export type ComponentBestTimeWeatherCondition = {
  __typename?: 'ComponentBestTimeWeatherCondition';
  content?: Maybe<Array<Maybe<ComponentCommonCard>>>;
  header?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};


export type ComponentBestTimeWeatherConditionContentArgs = {
  filters?: InputMaybe<ComponentCommonCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCityDetailActivities = {
  __typename?: 'ComponentCityDetailActivities';
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<UploadFileEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentCityDetailCard = {
  __typename?: 'ComponentCityDetailCard';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  title: Scalars['String']['output'];
};

export type ComponentCityDetailCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCityDetailCardFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCityDetailCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCityDetailCardFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentCityDetailCitiesDistance = {
  __typename?: 'ComponentCityDetailCitiesDistance';
  city?: Maybe<CityEntityResponse>;
  distance?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentCityDetailCitiesDistanceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCityDetailCitiesDistanceFiltersInput>>>;
  city?: InputMaybe<CityFiltersInput>;
  distance?: InputMaybe<IntFilterInput>;
  not?: InputMaybe<ComponentCityDetailCitiesDistanceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCityDetailCitiesDistanceFiltersInput>>>;
};

export type ComponentCityDetailCitiesToVisit = {
  __typename?: 'ComponentCityDetailCitiesToVisit';
  cities?: Maybe<Array<Maybe<ComponentCityDetailCitiesDistance>>>;
  id: Scalars['ID']['output'];
};


export type ComponentCityDetailCitiesToVisitCitiesArgs = {
  filters?: InputMaybe<ComponentCityDetailCitiesDistanceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCityDetailCityDescription = {
  __typename?: 'ComponentCityDetailCityDescription';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  nickname: Scalars['String']['output'];
  subtitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ComponentCityDetailCombine = {
  __typename?: 'ComponentCityDetailCombine';
  description?: Maybe<Scalars['String']['output']>;
  highlightedText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  places?: Maybe<PlaceRelationResponseCollection>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentCityDetailCombinePlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCityDetailFairs = {
  __typename?: 'ComponentCityDetailFairs';
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<UploadFileEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentCityDetailHeader = {
  __typename?: 'ComponentCityDetailHeader';
  id: Scalars['ID']['output'];
  imageText?: Maybe<Scalars['String']['output']>;
};

export type ComponentCityDetailHowToReachThere = {
  __typename?: 'ComponentCityDetailHowToReachThere';
  id: Scalars['ID']['output'];
};

export type ComponentCityDetailPlaces = {
  __typename?: 'ComponentCityDetailPlaces';
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<UploadFileEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentCityDetailPlacesToVisit = {
  __typename?: 'ComponentCityDetailPlacesToVisit';
  Description?: Maybe<Scalars['String']['output']>;
  Icon?: Maybe<UploadFileEntityResponse>;
  id: Scalars['ID']['output'];
  places?: Maybe<Array<Maybe<ComponentCityDetailCard>>>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentCityDetailPlacesToVisitPlacesArgs = {
  filters?: InputMaybe<ComponentCityDetailCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCityDetailVisit = {
  __typename?: 'ComponentCityDetailVisit';
  id: Scalars['ID']['output'];
};

export type ComponentCommonBanner = {
  __typename?: 'ComponentCommonBanner';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileRelationResponseCollection>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentCommonBannerImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCommonBannerInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentCommonCard = {
  __typename?: 'ComponentCommonCard';
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  location?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  weather?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonCardFiltersInput>>>;
  location?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonCardFiltersInput>>>;
  temperature?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  weather?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonCategoryPlace = {
  __typename?: 'ComponentCommonCategoryPlace';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  places?: Maybe<PlaceRelationResponseCollection>;
};


export type ComponentCommonCategoryPlacePlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCommonCategoryPlaceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonCategoryPlaceFiltersInput>>>;
  category?: InputMaybe<CategoryFiltersInput>;
  not?: InputMaybe<ComponentCommonCategoryPlaceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonCategoryPlaceFiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
};

export type ComponentCommonCityPlace = {
  __typename?: 'ComponentCommonCityPlace';
  city?: Maybe<CityEntityResponse>;
  id: Scalars['ID']['output'];
  places?: Maybe<PlaceRelationResponseCollection>;
};


export type ComponentCommonCityPlacePlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCommonCityPlaceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonCityPlaceFiltersInput>>>;
  city?: InputMaybe<CityFiltersInput>;
  not?: InputMaybe<ComponentCommonCityPlaceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonCityPlaceFiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
};

export type ComponentCommonDiscoverPlaceCard = {
  __typename?: 'ComponentCommonDiscoverPlaceCard';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  place?: Maybe<PlaceEntityResponse>;
  title?: Maybe<Scalars['String']['output']>;
  video?: Maybe<UploadFileEntityResponse>;
};

export type ComponentCommonDiscoverPlaceCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonDiscoverPlaceCardFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonDiscoverPlaceCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonDiscoverPlaceCardFiltersInput>>>;
  place?: InputMaybe<PlaceFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonFilmCard = {
  __typename?: 'ComponentCommonFilmCard';
  bannerImage?: Maybe<UploadFileEntityResponse>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonHowToGetThere = {
  __typename?: 'ComponentCommonHowToGetThere';
  align?: Maybe<Enum_Componentcommonhowtogetthere_Align>;
  bookLink: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  title: Scalars['String']['output'];
};

export type ComponentCommonLeaderCard = {
  __typename?: 'ComponentCommonLeaderCard';
  designation?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonLeaderCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonLeaderCardFiltersInput>>>;
  designation?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonLeaderCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonLeaderCardFiltersInput>>>;
};

export type ComponentCommonMap = {
  __typename?: 'ComponentCommonMap';
  carRoute?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mapImage?: Maybe<UploadFileEntityResponse>;
  planeRoute?: Maybe<Scalars['String']['output']>;
  trainRoute?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonMapFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonMapFiltersInput>>>;
  carRoute?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonMapFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonMapFiltersInput>>>;
  planeRoute?: InputMaybe<StringFilterInput>;
  trainRoute?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonMapInput = {
  carRoute?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  mapImage?: InputMaybe<Scalars['ID']['input']>;
  planeRoute?: InputMaybe<Scalars['String']['input']>;
  trainRoute?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentCommonNamevalue = {
  __typename?: 'ComponentCommonNamevalue';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonPermissions = {
  __typename?: 'ComponentCommonPermissions';
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonPermissionsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonPermissionsFiltersInput>>>;
  link?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonPermissionsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonPermissionsFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonPermissionsInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentCommonPolicyCard = {
  __typename?: 'ComponentCommonPolicyCard';
  content?: Maybe<Array<Maybe<ComponentCommonPermissions>>>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Enum_Componentcommonpolicycard_Type>;
};


export type ComponentCommonPolicyCardContentArgs = {
  filters?: InputMaybe<ComponentCommonPermissionsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentCommonPolicyCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonPolicyCardFiltersInput>>>;
  content?: InputMaybe<ComponentCommonPermissionsFiltersInput>;
  not?: InputMaybe<ComponentCommonPolicyCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonPolicyCardFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
  type?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonPopularPackageCard = {
  __typename?: 'ComponentCommonPopularPackageCard';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  rating?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentCommonSliderCard = {
  __typename?: 'ComponentCommonSliderCard';
  id: Scalars['ID']['output'];
  image: UploadFileEntityResponse;
  slideDescription: Scalars['String']['output'];
  slideTitle: Scalars['String']['output'];
};

export type ComponentCommonSliderCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonSliderCardFiltersInput>>>;
  not?: InputMaybe<ComponentCommonSliderCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonSliderCardFiltersInput>>>;
  slideDescription?: InputMaybe<StringFilterInput>;
  slideTitle?: InputMaybe<StringFilterInput>;
};

export type ComponentCommonVideoCard = {
  __typename?: 'ComponentCommonVideoCard';
  id: Scalars['ID']['output'];
  thumbnail?: Maybe<UploadFileEntityResponse>;
  video: UploadFileEntityResponse;
};

export type ComponentCommonVideoCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonVideoCardFiltersInput>>>;
  not?: InputMaybe<ComponentCommonVideoCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonVideoCardFiltersInput>>>;
};

export type ComponentCommonWildLifeCard = {
  __typename?: 'ComponentCommonWildLifeCard';
  id: Scalars['ID']['output'];
  place?: Maybe<PlaceEntityResponse>;
};

export type ComponentContactusContactEntry = {
  __typename?: 'ComponentContactusContactEntry';
  content?: Maybe<Array<Maybe<ComponentContactusMaindetails>>>;
  header?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};


export type ComponentContactusContactEntryContentArgs = {
  filters?: InputMaybe<ComponentContactusMaindetailsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentContactusMaindetails = {
  __typename?: 'ComponentContactusMaindetails';
  details?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Enum_Componentcontactusmaindetails_Type>;
};

export type ComponentContactusMaindetailsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentContactusMaindetailsFiltersInput>>>;
  details?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentContactusMaindetailsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentContactusMaindetailsFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
  type?: InputMaybe<StringFilterInput>;
};

export type ComponentDairyBlogs = {
  __typename?: 'ComponentDairyBlogs';
  Info?: Maybe<Array<Maybe<ComponentDairyInfo>>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentDairyBlogsInfoArgs = {
  filters?: InputMaybe<ComponentDairyInfoFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentDairyDairy = {
  __typename?: 'ComponentDairyDairy';
  date?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileRelationResponseCollection>;
  locations?: Maybe<PlaceRelationResponseCollection>;
  name?: Maybe<Scalars['String']['output']>;
};


export type ComponentDairyDairyImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ComponentDairyDairyLocationsArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentDairyInfo = {
  __typename?: 'ComponentDairyInfo';
  date?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileRelationResponseCollection>;
  link?: Maybe<Scalars['String']['output']>;
  locations?: Maybe<PlaceRelationResponseCollection>;
  name?: Maybe<Scalars['String']['output']>;
};


export type ComponentDairyInfoImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ComponentDairyInfoLocationsArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentDairyInfoFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentDairyInfoFiltersInput>>>;
  date?: InputMaybe<DateFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  locations?: InputMaybe<PlaceFiltersInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentDairyInfoFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentDairyInfoFiltersInput>>>;
};

export type ComponentDestinationDestContent = {
  __typename?: 'ComponentDestinationDestContent';
  Link?: Maybe<Scalars['String']['output']>;
  Title?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  places?: Maybe<PlaceRelationResponseCollection>;
};


export type ComponentDestinationDestContentPlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentDestinationDestHeader = {
  __typename?: 'ComponentDestinationDestHeader';
  id: Scalars['ID']['output'];
  image: UploadFileEntityResponse;
  title1: Scalars['String']['output'];
  title2: Scalars['String']['output'];
  title3: Scalars['String']['output'];
};

export type ComponentEmployeeCornerDetails = {
  __typename?: 'ComponentEmployeeCornerDetails';
  content?: Maybe<Array<Maybe<ComponentForeignInfo>>>;
  id: Scalars['ID']['output'];
};


export type ComponentEmployeeCornerDetailsContentArgs = {
  filters?: InputMaybe<ComponentForeignInfoFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentExploreExplore1 = {
  __typename?: 'ComponentExploreExplore1';
  category?: Maybe<CategoryEntityResponse>;
  cities?: Maybe<CityRelationResponseCollection>;
  id: Scalars['ID']['output'];
  places?: Maybe<PlaceRelationResponseCollection>;
};


export type ComponentExploreExplore1CitiesArgs = {
  filters?: InputMaybe<CityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ComponentExploreExplore1PlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentExploreExplore1FiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentExploreExplore1FiltersInput>>>;
  category?: InputMaybe<CategoryFiltersInput>;
  cities?: InputMaybe<CityFiltersInput>;
  not?: InputMaybe<ComponentExploreExplore1FiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentExploreExplore1FiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
};

export type ComponentExploreExplore2 = {
  __typename?: 'ComponentExploreExplore2';
  content?: Maybe<Array<Maybe<ComponentExploreExplore1>>>;
  id: Scalars['ID']['output'];
};


export type ComponentExploreExplore2ContentArgs = {
  filters?: InputMaybe<ComponentExploreExplore1FiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentExploreHeaderCity = {
  __typename?: 'ComponentExploreHeaderCity';
  cities?: Maybe<CityRelationResponseCollection>;
  cityHeader?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};


export type ComponentExploreHeaderCityCitiesArgs = {
  filters?: InputMaybe<CityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentExploreHeaderPlace = {
  __typename?: 'ComponentExploreHeaderPlace';
  id: Scalars['ID']['output'];
  placeHeader?: Maybe<Scalars['String']['output']>;
  places?: Maybe<PlaceRelationResponseCollection>;
};


export type ComponentExploreHeaderPlacePlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentFilmistanBanner = {
  __typename?: 'ComponentFilmistanBanner';
  bannerDetails?: Maybe<Scalars['String']['output']>;
  bannerDetails2?: Maybe<Scalars['String']['output']>;
  bannerImage?: Maybe<UploadFileEntityResponse>;
  bannerTitle?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentFilmistanFilm = {
  __typename?: 'ComponentFilmistanFilm';
  films?: Maybe<FilmRelationResponseCollection>;
  header?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};


export type ComponentFilmistanFilmFilmsArgs = {
  filters?: InputMaybe<FilmFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentFilmistanLocation = {
  __typename?: 'ComponentFilmistanLocation';
  cities?: Maybe<CityRelationResponseCollection>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentFilmistanLocationCitiesArgs = {
  filters?: InputMaybe<CityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentFilmistanPermissions = {
  __typename?: 'ComponentFilmistanPermissions';
  content?: Maybe<Array<Maybe<ComponentCommonPolicyCard>>>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentFilmistanPermissionsContentArgs = {
  filters?: InputMaybe<ComponentCommonPolicyCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentForeignInfo = {
  __typename?: 'ComponentForeignInfo';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentForeignInfoFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentForeignInfoFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentForeignInfoFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentForeignInfoFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentGuideTravelGuide = {
  __typename?: 'ComponentGuideTravelGuide';
  id: Scalars['ID']['output'];
  travel_guides?: Maybe<TravelGuideRelationResponseCollection>;
};


export type ComponentGuideTravelGuideTravel_GuidesArgs = {
  filters?: InputMaybe<TravelGuideFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentHeritagePropertyAddEntry = {
  __typename?: 'ComponentHeritagePropertyAddEntry';
  content?: Maybe<Array<Maybe<ComponentCommonCityPlace>>>;
  id: Scalars['ID']['output'];
};


export type ComponentHeritagePropertyAddEntryContentArgs = {
  filters?: InputMaybe<ComponentCommonCityPlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentHomeCafeteria = {
  __typename?: 'ComponentHomeCafeteria';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomeDiscoverBeautifulPlace = {
  __typename?: 'ComponentHomeDiscoverBeautifulPlace';
  content?: Maybe<Array<Maybe<ComponentCommonDiscoverPlaceCard>>>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentHomeDiscoverBeautifulPlaceContentArgs = {
  filters?: InputMaybe<ComponentCommonDiscoverPlaceCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentHomeDiscoverPlace = {
  __typename?: 'ComponentHomeDiscoverPlace';
  CityName?: Maybe<Scalars['String']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
};

export type ComponentHomeDiscoverRealBeauty = {
  __typename?: 'ComponentHomeDiscoverRealBeauty';
  description?: Maybe<Scalars['String']['output']>;
  headerTitle?: Maybe<Scalars['String']['output']>;
  highlightedText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomeLeader = {
  __typename?: 'ComponentHomeLeader';
  content?: Maybe<Array<Maybe<ComponentCommonLeaderCard>>>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentHomeLeaderContentArgs = {
  filters?: InputMaybe<ComponentCommonLeaderCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentHomeLightAndSoundShow = {
  __typename?: 'ComponentHomeLightAndSoundShow';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomeMonuments = {
  __typename?: 'ComponentHomeMonuments';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomeMuseum = {
  __typename?: 'ComponentHomeMuseum';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomeParks = {
  __typename?: 'ComponentHomeParks';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomePlace = {
  __typename?: 'ComponentHomePlace';
  Description?: Maybe<Scalars['String']['output']>;
  ImageUrls?: Maybe<Scalars['String']['output']>;
  SubText?: Maybe<Scalars['String']['output']>;
  Title?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentHomePlaces = {
  __typename?: 'ComponentHomePlaces';
  Category?: Maybe<Array<Maybe<ComponentCommonCategoryPlace>>>;
  Name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};


export type ComponentHomePlacesCategoryArgs = {
  filters?: InputMaybe<ComponentCommonCategoryPlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentHomeSlider = {
  __typename?: 'ComponentHomeSlider';
  Title?: Maybe<Scalars['String']['output']>;
  card?: Maybe<Array<Maybe<ComponentCommonSliderCard>>>;
  highlightedText?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  video?: Maybe<UploadFileEntityResponse>;
};


export type ComponentHomeSliderCardArgs = {
  filters?: InputMaybe<ComponentCommonSliderCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentHomeVenue = {
  __typename?: 'ComponentHomeVenue';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentHomeWildLife = {
  __typename?: 'ComponentHomeWildLife';
  category?: Maybe<CategoryEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentLuxuryFacilities = {
  __typename?: 'ComponentLuxuryFacilities';
  Details?: Maybe<Scalars['String']['output']>;
  Title?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentLuxuryFacilitiesFiltersInput = {
  Details?: InputMaybe<StringFilterInput>;
  Title?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<ComponentLuxuryFacilitiesFiltersInput>>>;
  not?: InputMaybe<ComponentLuxuryFacilitiesFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentLuxuryFacilitiesFiltersInput>>>;
};

export type ComponentLuxuryFacilitiesInput = {
  Details?: InputMaybe<Scalars['String']['input']>;
  Title?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type ComponentLuxuryOnWheelDetail = {
  __typename?: 'ComponentLuxuryOnWheelDetail';
  facilities?: Maybe<ComponentLuxuryFacilities>;
  id: Scalars['ID']['output'];
  wheels?: Maybe<ComponentLuxuryOnWheels>;
};

export type ComponentLuxuryOnWheelDetailFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentLuxuryOnWheelDetailFiltersInput>>>;
  facilities?: InputMaybe<ComponentLuxuryFacilitiesFiltersInput>;
  not?: InputMaybe<ComponentLuxuryOnWheelDetailFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentLuxuryOnWheelDetailFiltersInput>>>;
  wheels?: InputMaybe<ComponentLuxuryOnWheelsFiltersInput>;
};

export type ComponentLuxuryOnWheelDetailInput = {
  facilities?: InputMaybe<ComponentLuxuryFacilitiesInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  wheels?: InputMaybe<ComponentLuxuryOnWheelsInput>;
};

export type ComponentLuxuryOnWheels = {
  __typename?: 'ComponentLuxuryOnWheels';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileRelationResponseCollection>;
  link?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  title2?: Maybe<Scalars['String']['output']>;
};


export type ComponentLuxuryOnWheelsImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentLuxuryOnWheelsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentLuxuryOnWheelsFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentLuxuryOnWheelsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentLuxuryOnWheelsFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
  title2?: InputMaybe<StringFilterInput>;
};

export type ComponentLuxuryOnWheelsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title2?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentMediaEvents = {
  __typename?: 'ComponentMediaEvents';
  events?: Maybe<EventRelationResponseCollection>;
  id: Scalars['ID']['output'];
};


export type ComponentMediaEventsEventsArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentMediaGallery = {
  __typename?: 'ComponentMediaGallery';
  galleries?: Maybe<GalleryRelationResponseCollection>;
  id: Scalars['ID']['output'];
};


export type ComponentMediaGalleryGalleriesArgs = {
  filters?: InputMaybe<GalleryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentMediaPrintAds = {
  __typename?: 'ComponentMediaPrintAds';
  id: Scalars['ID']['output'];
  print_ads?: Maybe<PrintAdRelationResponseCollection>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentMediaPrintAdsPrint_AdsArgs = {
  filters?: InputMaybe<PrintAdFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentMediaVideo = {
  __typename?: 'ComponentMediaVideo';
  content?: Maybe<Array<Maybe<ComponentCommonVideoCard>>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentMediaVideoContentArgs = {
  filters?: InputMaybe<ComponentCommonVideoCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentMoreActivityMoreActivity = {
  __typename?: 'ComponentMoreActivityMoreActivity';
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ComponentMoreActivityMoreActivityFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentMoreActivityMoreActivityFiltersInput>>>;
  link?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentMoreActivityMoreActivityFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentMoreActivityMoreActivityFiltersInput>>>;
};

export type ComponentMoreActivityMoreActivityInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentPackagePackage = {
  __typename?: 'ComponentPackagePackage';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  packages?: Maybe<PackageRelationResponseCollection>;
  title?: Maybe<Scalars['String']['output']>;
  totalPackage?: Maybe<Scalars['String']['output']>;
};


export type ComponentPackagePackagePackagesArgs = {
  filters?: InputMaybe<PackageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPackagePackagePlaces = {
  __typename?: 'ComponentPackagePackagePlaces';
  id: Scalars['ID']['output'];
  places?: Maybe<PlaceRelationResponseCollection>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentPackagePackagePlacesPlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPackagePackagePlacesFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPackagePackagePlacesFiltersInput>>>;
  not?: InputMaybe<ComponentPackagePackagePlacesFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPackagePackagePlacesFiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPackagePackagePlacesInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  places?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentPlaceDetail3DVideo = {
  __typename?: 'ComponentPlaceDetail3DVideo';
  id: Scalars['ID']['output'];
  threeDvideo?: Maybe<UploadFileRelationResponseCollection>;
};


export type ComponentPlaceDetail3DVideoThreeDvideoArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailCard = {
  __typename?: 'ComponentPlaceDetailCard';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailCardFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailCardFiltersInput>>>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailCardFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailCardFiltersInput>>>;
  value?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailCategory = {
  __typename?: 'ComponentPlaceDetailCategory';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  places?: Maybe<Array<Maybe<ComponentPlaceDetailPlace>>>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailCategoryPlacesArgs = {
  filters?: InputMaybe<ComponentPlaceDetailPlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailCategoryFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailCategoryFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailCategoryFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailCategoryFiltersInput>>>;
  places?: InputMaybe<ComponentPlaceDetailPlaceFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  places?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailPlaceInput>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentPlaceDetailContent = {
  __typename?: 'ComponentPlaceDetailContent';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailContentFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailContentFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailContentFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailContentFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailDescription = {
  __typename?: 'ComponentPlaceDetailDescription';
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailDpCat = {
  __typename?: 'ComponentPlaceDetailDpCat';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  places?: Maybe<Array<Maybe<ComponentPlaceDetailDynamicpricePlace>>>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailDpCatPlacesArgs = {
  filters?: InputMaybe<ComponentPlaceDetailDynamicpricePlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailDpCatFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailDpCatFiltersInput>>>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailDpCatFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailDpCatFiltersInput>>>;
  places?: InputMaybe<ComponentPlaceDetailDynamicpricePlaceFiltersInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailDynamicprice = {
  __typename?: 'ComponentPlaceDetailDynamicprice';
  cats?: Maybe<Array<Maybe<ComponentPlaceDetailDpCat>>>;
  id: Scalars['ID']['output'];
};


export type ComponentPlaceDetailDynamicpriceCatsArgs = {
  filters?: InputMaybe<ComponentPlaceDetailDpCatFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailDynamicpricePlace = {
  __typename?: 'ComponentPlaceDetailDynamicpricePlace';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priceType?: Maybe<Scalars['String']['output']>;
  prices?: Maybe<Array<Maybe<ComponentPlaceDetailDynamicpricePrice>>>;
  remark?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailDynamicpricePlacePricesArgs = {
  filters?: InputMaybe<ComponentPlaceDetailDynamicpricePriceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailDynamicpricePlaceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailDynamicpricePlaceFiltersInput>>>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailDynamicpricePlaceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailDynamicpricePlaceFiltersInput>>>;
  priceType?: InputMaybe<StringFilterInput>;
  prices?: InputMaybe<ComponentPlaceDetailDynamicpricePriceFiltersInput>;
  remark?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailDynamicpricePrice = {
  __typename?: 'ComponentPlaceDetailDynamicpricePrice';
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type ComponentPlaceDetailDynamicpricePriceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailDynamicpricePriceFiltersInput>>>;
  not?: InputMaybe<ComponentPlaceDetailDynamicpricePriceFiltersInput>;
  note?: InputMaybe<StringFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailDynamicpricePriceFiltersInput>>>;
  price?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailExhibit = {
  __typename?: 'ComponentPlaceDetailExhibit';
  content?: Maybe<Array<Maybe<ComponentPlaceDetailContent>>>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailExhibitContentArgs = {
  filters?: InputMaybe<ComponentPlaceDetailContentFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailExhibitFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailExhibitFiltersInput>>>;
  content?: InputMaybe<ComponentPlaceDetailContentFiltersInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailExhibitFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailExhibitFiltersInput>>>;
  slug?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailFairs = {
  __typename?: 'ComponentPlaceDetailFairs';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailGalleryImage = {
  __typename?: 'ComponentPlaceDetailGalleryImage';
  id: Scalars['ID']['output'];
  image: UploadFileRelationResponseCollection;
};


export type ComponentPlaceDetailGalleryImageImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailGalleryImageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailGalleryImageFiltersInput>>>;
  not?: InputMaybe<ComponentPlaceDetailGalleryImageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailGalleryImageFiltersInput>>>;
};

export type ComponentPlaceDetailGalleryImageInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ComponentPlaceDetailHeader = {
  __typename?: 'ComponentPlaceDetailHeader';
  id: Scalars['ID']['output'];
};

export type ComponentPlaceDetailImages = {
  __typename?: 'ComponentPlaceDetailImages';
  id: Scalars['ID']['output'];
};

export type ComponentPlaceDetailInformation = {
  __typename?: 'ComponentPlaceDetailInformation';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailInformationFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailInformationFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailInformationFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailInformationFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailOthers = {
  __typename?: 'ComponentPlaceDetailOthers';
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailOverview = {
  __typename?: 'ComponentPlaceDetailOverview';
  address?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Float']['output']>;
  long?: Maybe<Scalars['Float']['output']>;
  shareableText?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailPlace = {
  __typename?: 'ComponentPlaceDetailPlace';
  description?: Maybe<Scalars['String']['output']>;
  gallery?: Maybe<Array<Maybe<ComponentPlaceDetailGalleryImage>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};


export type ComponentPlaceDetailPlaceGalleryArgs = {
  filters?: InputMaybe<ComponentPlaceDetailGalleryImageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailPlaceAttraction = {
  __typename?: 'ComponentPlaceDetailPlaceAttraction';
  card?: Maybe<Array<Maybe<ComponentPlaceDetailCard>>>;
  id: Scalars['ID']['output'];
  title1?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailPlaceAttractionCardArgs = {
  filters?: InputMaybe<ComponentPlaceDetailCardFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailPlaceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailPlaceFiltersInput>>>;
  description?: InputMaybe<StringFilterInput>;
  gallery?: InputMaybe<ComponentPlaceDetailGalleryImageFiltersInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailPlaceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailPlaceFiltersInput>>>;
};

export type ComponentPlaceDetailPlaceGallery = {
  __typename?: 'ComponentPlaceDetailPlaceGallery';
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileRelationResponseCollection>;
};


export type ComponentPlaceDetailPlaceGalleryImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailPlaceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  gallery?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailGalleryImageInput>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentPlaceDetailPlaceTime = {
  __typename?: 'ComponentPlaceDetailPlaceTime';
  card?: Maybe<Array<Maybe<ComponentPlaceDetailTickets>>>;
  id: Scalars['ID']['output'];
  tabName: Scalars['String']['output'];
};


export type ComponentPlaceDetailPlaceTimeCardArgs = {
  filters?: InputMaybe<ComponentPlaceDetailTicketsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailPlaceexhibit = {
  __typename?: 'ComponentPlaceDetailPlaceexhibit';
  exhibit?: Maybe<Array<Maybe<ComponentPlaceDetailExhibit>>>;
  id: Scalars['ID']['output'];
};


export type ComponentPlaceDetailPlaceexhibitExhibitArgs = {
  filters?: InputMaybe<ComponentPlaceDetailExhibitFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailPlaceinformation = {
  __typename?: 'ComponentPlaceDetailPlaceinformation';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailPlaceothers = {
  __typename?: 'ComponentPlaceDetailPlaceothers';
  card?: Maybe<Array<Maybe<ComponentPlaceDetailTickets>>>;
  id: Scalars['ID']['output'];
  title1?: Maybe<Scalars['String']['output']>;
  title2?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailPlaceothersCardArgs = {
  filters?: InputMaybe<ComponentPlaceDetailTicketsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailPlaceoverview = {
  __typename?: 'ComponentPlaceDetailPlaceoverview';
  id: Scalars['ID']['output'];
  overview?: Maybe<ComponentPlaceDetailOverview>;
};

export type ComponentPlaceDetailPlacestovisit = {
  __typename?: 'ComponentPlaceDetailPlacestovisit';
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<UploadFileEntityResponse>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailPlacetickets = {
  __typename?: 'ComponentPlaceDetailPlacetickets';
  card?: Maybe<Array<Maybe<ComponentPlaceDetailTickets>>>;
  id: Scalars['ID']['output'];
  information?: Maybe<Array<Maybe<ComponentPlaceDetailInformation>>>;
  title1?: Maybe<Scalars['String']['output']>;
  title2?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailPlaceticketsCardArgs = {
  filters?: InputMaybe<ComponentPlaceDetailTicketsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type ComponentPlaceDetailPlaceticketsInformationArgs = {
  filters?: InputMaybe<ComponentPlaceDetailInformationFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailTicketcardinfo = {
  __typename?: 'ComponentPlaceDetailTicketcardinfo';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailTicketfair = {
  __typename?: 'ComponentPlaceDetailTicketfair';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlaceDetailTicketfairFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailTicketfairFiltersInput>>>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlaceDetailTicketfairFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailTicketfairFiltersInput>>>;
  value?: InputMaybe<StringFilterInput>;
};

export type ComponentPlaceDetailTickets = {
  __typename?: 'ComponentPlaceDetailTickets';
  content?: Maybe<Array<Maybe<ComponentPlaceDetailTicketfair>>>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


export type ComponentPlaceDetailTicketsContentArgs = {
  filters?: InputMaybe<ComponentPlaceDetailTicketfairFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentPlaceDetailTicketsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailTicketsFiltersInput>>>;
  content?: InputMaybe<ComponentPlaceDetailTicketfairFiltersInput>;
  not?: InputMaybe<ComponentPlaceDetailTicketsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailTicketsFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlacePlaceContent = {
  __typename?: 'ComponentPlacePlaceContent';
  Title?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentPlacePlaceHeader = {
  __typename?: 'ComponentPlacePlaceHeader';
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  title1?: Maybe<Scalars['String']['output']>;
  title2?: Maybe<Scalars['String']['output']>;
  title3?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlanTripPlanTrip = {
  __typename?: 'ComponentPlanTripPlanTrip';
  id: Scalars['ID']['output'];
  image?: Maybe<UploadFileEntityResponse>;
  link?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentPlanTripPlanTripFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentPlanTripPlanTripFiltersInput>>>;
  link?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentPlanTripPlanTripFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentPlanTripPlanTripFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentPlanTripPlanTripInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ComponentShootingBanner = {
  __typename?: 'ComponentShootingBanner';
  detail?: Maybe<Scalars['String']['output']>;
  detail2?: Maybe<Scalars['String']['output']>;
  detailHeader?: Maybe<Scalars['String']['output']>;
  header?: Maybe<Scalars['String']['output']>;
  header2?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentShootingPermission = {
  __typename?: 'ComponentShootingPermission';
  content?: Maybe<Array<Maybe<ComponentCommonPermissions>>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Enum_Componentshootingpermission_Type>;
};


export type ComponentShootingPermissionContentArgs = {
  filters?: InputMaybe<ComponentCommonPermissionsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentSuggestedItineriesItinerary = {
  __typename?: 'ComponentSuggestedItineriesItinerary';
  cityItinerary?: Maybe<Array<Maybe<ComponentSuggestedItineriesItineraryDetails>>>;
  id: Scalars['ID']['output'];
  titile?: Maybe<Scalars['String']['output']>;
};


export type ComponentSuggestedItineriesItineraryCityItineraryArgs = {
  filters?: InputMaybe<ComponentSuggestedItineriesItineraryDetailsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentSuggestedItineriesItineraryDetails = {
  __typename?: 'ComponentSuggestedItineriesItineraryDetails';
  details?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type ComponentSuggestedItineriesItineraryDetailsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentSuggestedItineriesItineraryDetailsFiltersInput>>>;
  details?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentSuggestedItineriesItineraryDetailsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentSuggestedItineriesItineraryDetailsFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
};

export type ComponentTopPackagesTopPackages = {
  __typename?: 'ComponentTopPackagesTopPackages';
  id: Scalars['ID']['output'];
  package?: Maybe<PackageEntityResponse>;
};

export type ComponentTopPackagesTopPackagesFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentTopPackagesTopPackagesFiltersInput>>>;
  not?: InputMaybe<ComponentTopPackagesTopPackagesFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentTopPackagesTopPackagesFiltersInput>>>;
  package?: InputMaybe<PackageFiltersInput>;
};

export type ComponentTopPackagesTopPackagesInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  package?: InputMaybe<Scalars['ID']['input']>;
};

export type ComponentTravelAgencyBanner = {
  __typename?: 'ComponentTravelAgencyBanner';
  bannerDetail?: Maybe<Scalars['String']['output']>;
  bannerDetail2?: Maybe<Scalars['String']['output']>;
  bannerImage?: Maybe<UploadFileEntityResponse>;
  bannerTitle?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type ComponentTravelDeskContent = {
  __typename?: 'ComponentTravelDeskContent';
  desk?: Maybe<Array<Maybe<ComponentTravelDeskDesk>>>;
  id: Scalars['ID']['output'];
};


export type ComponentTravelDeskContentDeskArgs = {
  filters?: InputMaybe<ComponentTravelDeskDeskFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ComponentTravelDeskDesk = {
  __typename?: 'ComponentTravelDeskDesk';
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ComponentTravelDeskDeskFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentTravelDeskDeskFiltersInput>>>;
  link?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentTravelDeskDeskFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentTravelDeskDeskFiltersInput>>>;
};

export type ContactUs = {
  __typename?: 'ContactUs';
  content?: Maybe<Array<Maybe<ContactUsContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ContactUsContentDynamicZone = ComponentContactusContactEntry | ComponentFilmistanBanner | Error;

export type ContactUsEntity = {
  __typename?: 'ContactUsEntity';
  attributes?: Maybe<ContactUs>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ContactUsEntityResponse = {
  __typename?: 'ContactUsEntityResponse';
  data?: Maybe<ContactUsEntity>;
};

export type ContactUsInput = {
  content?: InputMaybe<Array<Scalars['ContactUsContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  contains?: InputMaybe<Scalars['Date']['input']>;
  containsi?: InputMaybe<Scalars['Date']['input']>;
  endsWith?: InputMaybe<Scalars['Date']['input']>;
  eq?: InputMaybe<Scalars['Date']['input']>;
  eqi?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  ne?: InputMaybe<Scalars['Date']['input']>;
  nei?: InputMaybe<Scalars['Date']['input']>;
  not?: InputMaybe<DateFilterInput>;
  notContains?: InputMaybe<Scalars['Date']['input']>;
  notContainsi?: InputMaybe<Scalars['Date']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  startsWith?: InputMaybe<Scalars['Date']['input']>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  contains?: InputMaybe<Scalars['DateTime']['input']>;
  containsi?: InputMaybe<Scalars['DateTime']['input']>;
  endsWith?: InputMaybe<Scalars['DateTime']['input']>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  eqi?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  ne?: InputMaybe<Scalars['DateTime']['input']>;
  nei?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']['input']>;
  notContainsi?: InputMaybe<Scalars['DateTime']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Department = {
  __typename?: 'Department';
  Name?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  icon?: Maybe<UploadFileEntityResponse>;
  places?: Maybe<PlaceRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type DepartmentPlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DepartmentEntity = {
  __typename?: 'DepartmentEntity';
  attributes?: Maybe<Department>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type DepartmentEntityResponse = {
  __typename?: 'DepartmentEntityResponse';
  data?: Maybe<DepartmentEntity>;
};

export type DepartmentEntityResponseCollection = {
  __typename?: 'DepartmentEntityResponseCollection';
  data: Array<DepartmentEntity>;
  meta: ResponseCollectionMeta;
};

export type DepartmentFiltersInput = {
  Name?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<DepartmentFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<DepartmentFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<DepartmentFiltersInput>>>;
  places?: InputMaybe<PlaceFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type DepartmentInput = {
  Name?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['ID']['input']>;
  places?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Destination = {
  __typename?: 'Destination';
  content?: Maybe<Array<Maybe<DestinationContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type DestinationContentDynamicZone = ComponentDestinationDestContent | ComponentDestinationDestHeader | Error;

export type DestinationEntity = {
  __typename?: 'DestinationEntity';
  attributes?: Maybe<Destination>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type DestinationEntityResponse = {
  __typename?: 'DestinationEntityResponse';
  data?: Maybe<DestinationEntity>;
};

export type DestinationInput = {
  content?: InputMaybe<Array<Scalars['DestinationContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum Enum_Componentbesttimebesttimedetails_Align {
  Left = 'left',
  Right = 'right'
}

export enum Enum_Componentcommonhowtogetthere_Align {
  Left = 'left',
  Right = 'right'
}

export enum Enum_Componentcommonpolicycard_Type {
  Rectangle = 'rectangle',
  Square = 'square',
  Triangle = 'triangle'
}

export enum Enum_Componentcontactusmaindetails_Type {
  DesignationAndOffice = 'designation_and_office',
  Email = 'email',
  FaxNo = 'fax_no',
  OfficeNoAndMobile = 'office_no_and_mobile',
  User = 'user'
}

export enum Enum_Componentshootingpermission_Type {
  Collector = 'collector',
  Rectangle = 'rectangle',
  RectangleNoHeader = 'rectangleNoHeader',
  Square = 'square',
  Triangle = 'triangle'
}

export enum Enum_Film_Filmtype {
  InternationalCinema = 'International_Cinema',
  ShortFilmsAndDocumentaries = 'Short_Films_and_Documentaries',
  IndianCinema = 'indian_cinema'
}

export enum Enum_Gallery_Align {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export enum Enum_Place_Subcategory {
  Cafeteria = 'cafeteria',
  Elephant = 'elephant',
  Leopard = 'leopard',
  Lightandsoundshow = 'lightandsoundshow',
  Monuments = 'monuments',
  Museums = 'museums',
  Park = 'park',
  Venue = 'venue'
}

export type EmployeeCorner = {
  __typename?: 'EmployeeCorner';
  content?: Maybe<Array<Maybe<EmployeeCornerContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EmployeeCornerContentDynamicZone = ComponentEmployeeCornerDetails | Error;

export type EmployeeCornerEntity = {
  __typename?: 'EmployeeCornerEntity';
  attributes?: Maybe<EmployeeCorner>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type EmployeeCornerEntityResponse = {
  __typename?: 'EmployeeCornerEntityResponse';
  data?: Maybe<EmployeeCornerEntity>;
};

export type EmployeeCornerInput = {
  content?: InputMaybe<Array<Scalars['EmployeeCornerContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<UploadFileEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EventEntity = {
  __typename?: 'EventEntity';
  attributes?: Maybe<Event>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type EventEntityResponse = {
  __typename?: 'EventEntityResponse';
  data?: Maybe<EventEntity>;
};

export type EventEntityResponseCollection = {
  __typename?: 'EventEntityResponseCollection';
  data: Array<EventEntity>;
  meta: ResponseCollectionMeta;
};

export type EventFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<EventFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<EventFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<EventFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type EventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type EventRelationResponseCollection = {
  __typename?: 'EventRelationResponseCollection';
  data: Array<EventEntity>;
};

export type Explore = {
  __typename?: 'Explore';
  content?: Maybe<Array<Maybe<ExploreContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExploreAll = {
  __typename?: 'ExploreAll';
  category?: Maybe<CategoryEntityResponse>;
  content?: Maybe<Array<Maybe<ExploreAllContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExploreAllArrange = {
  __typename?: 'ExploreAllArrange';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  explore_alls?: Maybe<ExploreAllRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ExploreAllArrangeExplore_AllsArgs = {
  filters?: InputMaybe<ExploreAllFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ExploreAllArrangeEntity = {
  __typename?: 'ExploreAllArrangeEntity';
  attributes?: Maybe<ExploreAllArrange>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ExploreAllArrangeEntityResponse = {
  __typename?: 'ExploreAllArrangeEntityResponse';
  data?: Maybe<ExploreAllArrangeEntity>;
};

export type ExploreAllArrangeInput = {
  explore_alls?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ExploreAllContentDynamicZone = ComponentExploreHeaderCity | ComponentExploreHeaderPlace | Error;

export type ExploreAllEntity = {
  __typename?: 'ExploreAllEntity';
  attributes?: Maybe<ExploreAll>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ExploreAllEntityResponse = {
  __typename?: 'ExploreAllEntityResponse';
  data?: Maybe<ExploreAllEntity>;
};

export type ExploreAllEntityResponseCollection = {
  __typename?: 'ExploreAllEntityResponseCollection';
  data: Array<ExploreAllEntity>;
  meta: ResponseCollectionMeta;
};

export type ExploreAllFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExploreAllFiltersInput>>>;
  category?: InputMaybe<CategoryFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ExploreAllFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExploreAllFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExploreAllInput = {
  category?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Array<Scalars['ExploreAllContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ExploreAllRelationResponseCollection = {
  __typename?: 'ExploreAllRelationResponseCollection';
  data: Array<ExploreAllEntity>;
};

export type ExploreContentDynamicZone = ComponentExploreExplore2 | Error;

export type ExploreEntity = {
  __typename?: 'ExploreEntity';
  attributes?: Maybe<Explore>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ExploreEntityResponse = {
  __typename?: 'ExploreEntityResponse';
  data?: Maybe<ExploreEntity>;
};

export type ExploreInput = {
  content?: InputMaybe<Array<Scalars['ExploreContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FairsAndFestival = {
  __typename?: 'FairsAndFestival';
  banner?: Maybe<ComponentCommonBanner>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  map?: Maybe<ComponentCommonMap>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FairsAndFestivalEntity = {
  __typename?: 'FairsAndFestivalEntity';
  attributes?: Maybe<FairsAndFestival>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FairsAndFestivalEntityResponse = {
  __typename?: 'FairsAndFestivalEntityResponse';
  data?: Maybe<FairsAndFestivalEntity>;
};

export type FairsAndFestivalInput = {
  banner?: InputMaybe<ComponentCommonBannerInput>;
  map?: InputMaybe<ComponentCommonMapInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FairsAndFestivalListBanner = {
  __typename?: 'FairsAndFestivalListBanner';
  banner?: Maybe<ComponentCommonBanner>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FairsAndFestivalListBannerEntity = {
  __typename?: 'FairsAndFestivalListBannerEntity';
  attributes?: Maybe<FairsAndFestivalListBanner>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FairsAndFestivalListBannerEntityResponse = {
  __typename?: 'FairsAndFestivalListBannerEntityResponse';
  data?: Maybe<FairsAndFestivalListBannerEntity>;
};

export type FairsAndFestivalListBannerInput = {
  banner?: InputMaybe<ComponentCommonBannerInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FestivalsAndFair = {
  __typename?: 'FestivalsAndFair';
  city?: Maybe<CityEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  fromDate?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<UploadFileRelationResponseCollection>;
  map?: Maybe<Array<Maybe<ComponentCommonMap>>>;
  name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Long']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  toDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type FestivalsAndFairImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type FestivalsAndFairMapArgs = {
  filters?: InputMaybe<ComponentCommonMapFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type FestivalsAndFairEntity = {
  __typename?: 'FestivalsAndFairEntity';
  attributes?: Maybe<FestivalsAndFair>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FestivalsAndFairEntityResponse = {
  __typename?: 'FestivalsAndFairEntityResponse';
  data?: Maybe<FestivalsAndFairEntity>;
};

export type FestivalsAndFairEntityResponseCollection = {
  __typename?: 'FestivalsAndFairEntityResponseCollection';
  data: Array<FestivalsAndFairEntity>;
  meta: ResponseCollectionMeta;
};

export type FestivalsAndFairFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FestivalsAndFairFiltersInput>>>;
  city?: InputMaybe<CityFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  details?: InputMaybe<StringFilterInput>;
  fromDate?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  map?: InputMaybe<ComponentCommonMapFiltersInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<FestivalsAndFairFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FestivalsAndFairFiltersInput>>>;
  popularity?: InputMaybe<LongFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  toDate?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FestivalsAndFairInput = {
  city?: InputMaybe<Scalars['ID']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  map?: InputMaybe<Array<InputMaybe<ComponentCommonMapInput>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  popularity?: InputMaybe<Scalars['Long']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FestivalsAndFairRelationResponseCollection = {
  __typename?: 'FestivalsAndFairRelationResponseCollection';
  data: Array<FestivalsAndFairEntity>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Film = {
  __typename?: 'Film';
  bannerImage?: Maybe<UploadFileEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  filmType?: Maybe<Enum_Film_Filmtype>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FilmEntity = {
  __typename?: 'FilmEntity';
  attributes?: Maybe<Film>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FilmEntityResponse = {
  __typename?: 'FilmEntityResponse';
  data?: Maybe<FilmEntity>;
};

export type FilmEntityResponseCollection = {
  __typename?: 'FilmEntityResponseCollection';
  data: Array<FilmEntity>;
  meta: ResponseCollectionMeta;
};

export type FilmFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FilmFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  filmType?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<FilmFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FilmFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FilmInput = {
  bannerImage?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  filmType?: InputMaybe<Enum_Film_Filmtype>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FilmRelationResponseCollection = {
  __typename?: 'FilmRelationResponseCollection';
  data: Array<FilmEntity>;
};

export type FilmShooting = {
  __typename?: 'FilmShooting';
  content?: Maybe<Array<Maybe<FilmShootingContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FilmShootingContentDynamicZone = ComponentShootingBanner | ComponentShootingPermission | Error;

export type FilmShootingEntity = {
  __typename?: 'FilmShootingEntity';
  attributes?: Maybe<FilmShooting>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FilmShootingEntityResponse = {
  __typename?: 'FilmShootingEntityResponse';
  data?: Maybe<FilmShootingEntity>;
};

export type FilmShootingInput = {
  content?: InputMaybe<Array<Scalars['FilmShootingContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Filmistan = {
  __typename?: 'Filmistan';
  content?: Maybe<Array<Maybe<FilmistanContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FilmistanContentDynamicZone = ComponentFilmistanBanner | ComponentFilmistanLocation | ComponentFilmistanPermissions | Error;

export type FilmistanEntity = {
  __typename?: 'FilmistanEntity';
  attributes?: Maybe<Filmistan>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type FilmistanEntityResponse = {
  __typename?: 'FilmistanEntityResponse';
  data?: Maybe<FilmistanEntity>;
};

export type FilmistanInput = {
  content?: InputMaybe<Array<Scalars['FilmistanContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  contains?: InputMaybe<Scalars['Float']['input']>;
  containsi?: InputMaybe<Scalars['Float']['input']>;
  endsWith?: InputMaybe<Scalars['Float']['input']>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  eqi?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  nei?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']['input']>;
  notContainsi?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  startsWith?: InputMaybe<Scalars['Float']['input']>;
};

export type ForeignInfo = {
  __typename?: 'ForeignInfo';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ForeignInfoEntity = {
  __typename?: 'ForeignInfoEntity';
  attributes?: Maybe<ForeignInfo>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ForeignInfoEntityResponse = {
  __typename?: 'ForeignInfoEntityResponse';
  data?: Maybe<ForeignInfoEntity>;
};

export type ForeignInfoEntityResponseCollection = {
  __typename?: 'ForeignInfoEntityResponseCollection';
  data: Array<ForeignInfoEntity>;
  meta: ResponseCollectionMeta;
};

export type ForeignInfoFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ForeignInfoFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ForeignInfoFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ForeignInfoFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ForeignInfoInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ForeignTourist = {
  __typename?: 'ForeignTourist';
  content?: Maybe<Array<Maybe<ForeignTouristContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ForeignTouristContentDynamicZone = ComponentFilmistanBanner | ComponentForeignInfo | Error;

export type ForeignTouristEntity = {
  __typename?: 'ForeignTouristEntity';
  attributes?: Maybe<ForeignTourist>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ForeignTouristEntityResponse = {
  __typename?: 'ForeignTouristEntityResponse';
  data?: Maybe<ForeignTouristEntity>;
};

export type ForeignTouristInput = {
  content?: InputMaybe<Array<Scalars['ForeignTouristContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Gallery = {
  __typename?: 'Gallery';
  align?: Maybe<Enum_Gallery_Align>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<UploadFileEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type GalleryEntity = {
  __typename?: 'GalleryEntity';
  attributes?: Maybe<Gallery>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type GalleryEntityResponse = {
  __typename?: 'GalleryEntityResponse';
  data?: Maybe<GalleryEntity>;
};

export type GalleryEntityResponseCollection = {
  __typename?: 'GalleryEntityResponseCollection';
  data: Array<GalleryEntity>;
  meta: ResponseCollectionMeta;
};

export type GalleryFiltersInput = {
  align?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<GalleryFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<GalleryFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<GalleryFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type GalleryInput = {
  align?: InputMaybe<Enum_Gallery_Align>;
  image?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GalleryRelationResponseCollection = {
  __typename?: 'GalleryRelationResponseCollection';
  data: Array<GalleryEntity>;
};

export type GenericMorph = ActPolicyAndScheme | Activity | Adventure | AdventureListBanner | AllMedia | AllPackage | BestTime | Category | City | CityDetail | ComponentBestTimeBestTimeDetails | ComponentBestTimeWeatherCondition | ComponentCityDetailActivities | ComponentCityDetailCard | ComponentCityDetailCitiesDistance | ComponentCityDetailCitiesToVisit | ComponentCityDetailCityDescription | ComponentCityDetailCombine | ComponentCityDetailFairs | ComponentCityDetailHeader | ComponentCityDetailHowToReachThere | ComponentCityDetailPlaces | ComponentCityDetailPlacesToVisit | ComponentCityDetailVisit | ComponentCommonBanner | ComponentCommonCard | ComponentCommonCategoryPlace | ComponentCommonCityPlace | ComponentCommonDiscoverPlaceCard | ComponentCommonFilmCard | ComponentCommonHowToGetThere | ComponentCommonLeaderCard | ComponentCommonMap | ComponentCommonNamevalue | ComponentCommonPermissions | ComponentCommonPolicyCard | ComponentCommonPopularPackageCard | ComponentCommonSliderCard | ComponentCommonVideoCard | ComponentCommonWildLifeCard | ComponentContactusContactEntry | ComponentContactusMaindetails | ComponentDairyBlogs | ComponentDairyDairy | ComponentDairyInfo | ComponentDestinationDestContent | ComponentDestinationDestHeader | ComponentEmployeeCornerDetails | ComponentExploreExplore1 | ComponentExploreExplore2 | ComponentExploreHeaderCity | ComponentExploreHeaderPlace | ComponentFilmistanBanner | ComponentFilmistanFilm | ComponentFilmistanLocation | ComponentFilmistanPermissions | ComponentForeignInfo | ComponentGuideTravelGuide | ComponentHeritagePropertyAddEntry | ComponentHomeCafeteria | ComponentHomeDiscoverBeautifulPlace | ComponentHomeDiscoverPlace | ComponentHomeDiscoverRealBeauty | ComponentHomeLeader | ComponentHomeLightAndSoundShow | ComponentHomeMonuments | ComponentHomeMuseum | ComponentHomeParks | ComponentHomePlace | ComponentHomePlaces | ComponentHomeSlider | ComponentHomeVenue | ComponentHomeWildLife | ComponentLuxuryFacilities | ComponentLuxuryOnWheelDetail | ComponentLuxuryOnWheels | ComponentMediaEvents | ComponentMediaGallery | ComponentMediaPrintAds | ComponentMediaVideo | ComponentMoreActivityMoreActivity | ComponentPackagePackage | ComponentPackagePackagePlaces | ComponentPlaceDetail3DVideo | ComponentPlaceDetailCard | ComponentPlaceDetailCategory | ComponentPlaceDetailContent | ComponentPlaceDetailDescription | ComponentPlaceDetailDpCat | ComponentPlaceDetailDynamicprice | ComponentPlaceDetailDynamicpricePlace | ComponentPlaceDetailDynamicpricePrice | ComponentPlaceDetailExhibit | ComponentPlaceDetailFairs | ComponentPlaceDetailGalleryImage | ComponentPlaceDetailHeader | ComponentPlaceDetailImages | ComponentPlaceDetailInformation | ComponentPlaceDetailOthers | ComponentPlaceDetailOverview | ComponentPlaceDetailPlace | ComponentPlaceDetailPlaceAttraction | ComponentPlaceDetailPlaceGallery | ComponentPlaceDetailPlaceTime | ComponentPlaceDetailPlaceexhibit | ComponentPlaceDetailPlaceinformation | ComponentPlaceDetailPlaceothers | ComponentPlaceDetailPlaceoverview | ComponentPlaceDetailPlacestovisit | ComponentPlaceDetailPlacetickets | ComponentPlaceDetailTicketcardinfo | ComponentPlaceDetailTicketfair | ComponentPlaceDetailTickets | ComponentPlacePlaceContent | ComponentPlacePlaceHeader | ComponentPlanTripPlanTrip | ComponentShootingBanner | ComponentShootingPermission | ComponentSuggestedItineriesItinerary | ComponentSuggestedItineriesItineraryDetails | ComponentTopPackagesTopPackages | ComponentTravelAgencyBanner | ComponentTravelDeskContent | ComponentTravelDeskDesk | ContactUs | Department | Destination | EmployeeCorner | Event | Explore | ExploreAll | ExploreAllArrange | FairsAndFestival | FairsAndFestivalListBanner | FestivalsAndFair | Film | FilmShooting | Filmistan | ForeignInfo | ForeignTourist | Gallery | HeritageProperty | Home | HowToGetThere | I18NLocale | IhmsAndFci | Landing | LuxuryOnWheel | LuxuryOnWheelsDetail | MoreActivity | Other | Package | PackageDetail | Place | PlaceDetail | PlanTrip | PrintAd | RajasthanTravelGuide | RegistrationForTravelAgency | SeeAllPlace | SuggestedItinerie | TopActivity | TopPackage | TravelDairy | TravelDesk | TravelGuide | UpcomingEvent | UploadFile | UploadFolder | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsUser;

export type HeritageProperty = {
  __typename?: 'HeritageProperty';
  content?: Maybe<Array<Maybe<HeritagePropertyContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HeritagePropertyContentDynamicZone = ComponentCommonBanner | ComponentHeritagePropertyAddEntry | Error;

export type HeritagePropertyEntity = {
  __typename?: 'HeritagePropertyEntity';
  attributes?: Maybe<HeritageProperty>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type HeritagePropertyEntityResponse = {
  __typename?: 'HeritagePropertyEntityResponse';
  data?: Maybe<HeritagePropertyEntity>;
};

export type HeritagePropertyInput = {
  content?: InputMaybe<Array<Scalars['HeritagePropertyContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Home = {
  __typename?: 'Home';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  home?: Maybe<Array<Maybe<HomeHomeDynamicZone>>>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HomeEntity = {
  __typename?: 'HomeEntity';
  attributes?: Maybe<Home>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type HomeEntityResponse = {
  __typename?: 'HomeEntityResponse';
  data?: Maybe<HomeEntity>;
};

export type HomeHomeDynamicZone = ComponentHomeCafeteria | ComponentHomeDiscoverBeautifulPlace | ComponentHomeDiscoverRealBeauty | ComponentHomeLeader | ComponentHomeLightAndSoundShow | ComponentHomeMonuments | ComponentHomeMuseum | ComponentHomeParks | ComponentHomePlaces | ComponentHomeSlider | ComponentHomeVenue | ComponentHomeWildLife | Error;

export type HomeInput = {
  home?: InputMaybe<Array<Scalars['HomeHomeDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HowToGetThere = {
  __typename?: 'HowToGetThere';
  content?: Maybe<Array<Maybe<HowToGetThereContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HowToGetThereContentDynamicZone = ComponentCommonHowToGetThere | Error;

export type HowToGetThereEntity = {
  __typename?: 'HowToGetThereEntity';
  attributes?: Maybe<HowToGetThere>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type HowToGetThereEntityResponse = {
  __typename?: 'HowToGetThereEntityResponse';
  data?: Maybe<HowToGetThereEntity>;
};

export type HowToGetThereInput = {
  content?: InputMaybe<Array<Scalars['HowToGetThereContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type I18NLocale = {
  __typename?: 'I18NLocale';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type I18NLocaleEntity = {
  __typename?: 'I18NLocaleEntity';
  attributes?: Maybe<I18NLocale>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type I18NLocaleEntityResponse = {
  __typename?: 'I18NLocaleEntityResponse';
  data?: Maybe<I18NLocaleEntity>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: 'I18NLocaleEntityResponseCollection';
  data: Array<I18NLocaleEntity>;
  meta: ResponseCollectionMeta;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  containsi?: InputMaybe<Scalars['ID']['input']>;
  endsWith?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  eqi?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  nei?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  notContainsi?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  startsWith?: InputMaybe<Scalars['ID']['input']>;
};

export type IhmsAndFci = {
  __typename?: 'IhmsAndFci';
  content?: Maybe<Array<Maybe<IhmsAndFciContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IhmsAndFciContentDynamicZone = ComponentCommonPermissions | Error;

export type IhmsAndFciEntity = {
  __typename?: 'IhmsAndFciEntity';
  attributes?: Maybe<IhmsAndFci>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type IhmsAndFciEntityResponse = {
  __typename?: 'IhmsAndFciEntityResponse';
  data?: Maybe<IhmsAndFciEntity>;
};

export type IhmsAndFciInput = {
  content?: InputMaybe<Array<Scalars['IhmsAndFciContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  contains?: InputMaybe<Scalars['Int']['input']>;
  containsi?: InputMaybe<Scalars['Int']['input']>;
  endsWith?: InputMaybe<Scalars['Int']['input']>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  eqi?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  nei?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars['Int']['input']>;
  notContainsi?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  startsWith?: InputMaybe<Scalars['Int']['input']>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  contains?: InputMaybe<Scalars['JSON']['input']>;
  containsi?: InputMaybe<Scalars['JSON']['input']>;
  endsWith?: InputMaybe<Scalars['JSON']['input']>;
  eq?: InputMaybe<Scalars['JSON']['input']>;
  eqi?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  ne?: InputMaybe<Scalars['JSON']['input']>;
  nei?: InputMaybe<Scalars['JSON']['input']>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars['JSON']['input']>;
  notContainsi?: InputMaybe<Scalars['JSON']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  startsWith?: InputMaybe<Scalars['JSON']['input']>;
};

export type Landing = {
  __typename?: 'Landing';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LandingEntity = {
  __typename?: 'LandingEntity';
  attributes?: Maybe<Landing>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type LandingEntityResponse = {
  __typename?: 'LandingEntityResponse';
  data?: Maybe<LandingEntity>;
};

export type LandingInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type LongFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  contains?: InputMaybe<Scalars['Long']['input']>;
  containsi?: InputMaybe<Scalars['Long']['input']>;
  endsWith?: InputMaybe<Scalars['Long']['input']>;
  eq?: InputMaybe<Scalars['Long']['input']>;
  eqi?: InputMaybe<Scalars['Long']['input']>;
  gt?: InputMaybe<Scalars['Long']['input']>;
  gte?: InputMaybe<Scalars['Long']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  lt?: InputMaybe<Scalars['Long']['input']>;
  lte?: InputMaybe<Scalars['Long']['input']>;
  ne?: InputMaybe<Scalars['Long']['input']>;
  nei?: InputMaybe<Scalars['Long']['input']>;
  not?: InputMaybe<LongFilterInput>;
  notContains?: InputMaybe<Scalars['Long']['input']>;
  notContainsi?: InputMaybe<Scalars['Long']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  startsWith?: InputMaybe<Scalars['Long']['input']>;
};

export type LuxuryOnWheel = {
  __typename?: 'LuxuryOnWheel';
  content?: Maybe<Array<Maybe<LuxuryOnWheelContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LuxuryOnWheelContentDynamicZone = ComponentCommonBanner | ComponentLuxuryOnWheels | Error;

export type LuxuryOnWheelEntity = {
  __typename?: 'LuxuryOnWheelEntity';
  attributes?: Maybe<LuxuryOnWheel>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type LuxuryOnWheelEntityResponse = {
  __typename?: 'LuxuryOnWheelEntityResponse';
  data?: Maybe<LuxuryOnWheelEntity>;
};

export type LuxuryOnWheelInput = {
  content?: InputMaybe<Array<Scalars['LuxuryOnWheelContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LuxuryOnWheelsDetail = {
  __typename?: 'LuxuryOnWheelsDetail';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  wheels?: Maybe<Array<Maybe<ComponentLuxuryOnWheelDetail>>>;
};


export type LuxuryOnWheelsDetailWheelsArgs = {
  filters?: InputMaybe<ComponentLuxuryOnWheelDetailFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type LuxuryOnWheelsDetailEntity = {
  __typename?: 'LuxuryOnWheelsDetailEntity';
  attributes?: Maybe<LuxuryOnWheelsDetail>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type LuxuryOnWheelsDetailEntityResponse = {
  __typename?: 'LuxuryOnWheelsDetailEntityResponse';
  data?: Maybe<LuxuryOnWheelsDetailEntity>;
};

export type LuxuryOnWheelsDetailInput = {
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  wheels?: InputMaybe<Array<InputMaybe<ComponentLuxuryOnWheelDetailInput>>>;
};

export type MoreActivity = {
  __typename?: 'MoreActivity';
  activity?: Maybe<Array<Maybe<ComponentMoreActivityMoreActivity>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type MoreActivityActivityArgs = {
  filters?: InputMaybe<ComponentMoreActivityMoreActivityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type MoreActivityEntity = {
  __typename?: 'MoreActivityEntity';
  attributes?: Maybe<MoreActivity>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type MoreActivityEntityResponse = {
  __typename?: 'MoreActivityEntityResponse';
  data?: Maybe<MoreActivityEntity>;
};

export type MoreActivityInput = {
  activity?: InputMaybe<Array<InputMaybe<ComponentMoreActivityMoreActivityInput>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change user password. Confirm with the current password. */
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  createActivity?: Maybe<ActivityEntityResponse>;
  createAdventure?: Maybe<AdventureEntityResponse>;
  createCategory?: Maybe<CategoryEntityResponse>;
  createCity?: Maybe<CityEntityResponse>;
  createCityDetail?: Maybe<CityDetailEntityResponse>;
  createDepartment?: Maybe<DepartmentEntityResponse>;
  createEvent?: Maybe<EventEntityResponse>;
  createExploreAll?: Maybe<ExploreAllEntityResponse>;
  createFestivalsAndFair?: Maybe<FestivalsAndFairEntityResponse>;
  createFilm?: Maybe<FilmEntityResponse>;
  createForeignInfo?: Maybe<ForeignInfoEntityResponse>;
  createGallery?: Maybe<GalleryEntityResponse>;
  createPackage?: Maybe<PackageEntityResponse>;
  createPackageDetail?: Maybe<PackageDetailEntityResponse>;
  createPlace?: Maybe<PlaceEntityResponse>;
  createPlaceDetail?: Maybe<PlaceDetailEntityResponse>;
  createPrintAd?: Maybe<PrintAdEntityResponse>;
  createTopActivity?: Maybe<TopActivityEntityResponse>;
  createTravelGuide?: Maybe<TravelGuideEntityResponse>;
  createUpcomingEvent?: Maybe<UpcomingEventEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteActPolicyAndScheme?: Maybe<ActPolicyAndSchemeEntityResponse>;
  deleteActivity?: Maybe<ActivityEntityResponse>;
  deleteAdventure?: Maybe<AdventureEntityResponse>;
  deleteAdventureListBanner?: Maybe<AdventureListBannerEntityResponse>;
  deleteAllMedia?: Maybe<AllMediaEntityResponse>;
  deleteAllPackage?: Maybe<AllPackageEntityResponse>;
  deleteBestTime?: Maybe<BestTimeEntityResponse>;
  deleteCategory?: Maybe<CategoryEntityResponse>;
  deleteCity?: Maybe<CityEntityResponse>;
  deleteCityDetail?: Maybe<CityDetailEntityResponse>;
  deleteContactUs?: Maybe<ContactUsEntityResponse>;
  deleteDepartment?: Maybe<DepartmentEntityResponse>;
  deleteDestination?: Maybe<DestinationEntityResponse>;
  deleteEmployeeCorner?: Maybe<EmployeeCornerEntityResponse>;
  deleteEvent?: Maybe<EventEntityResponse>;
  deleteExplore?: Maybe<ExploreEntityResponse>;
  deleteExploreAll?: Maybe<ExploreAllEntityResponse>;
  deleteExploreAllArrange?: Maybe<ExploreAllArrangeEntityResponse>;
  deleteFairsAndFestival?: Maybe<FairsAndFestivalEntityResponse>;
  deleteFairsAndFestivalListBanner?: Maybe<FairsAndFestivalListBannerEntityResponse>;
  deleteFestivalsAndFair?: Maybe<FestivalsAndFairEntityResponse>;
  deleteFilm?: Maybe<FilmEntityResponse>;
  deleteFilmShooting?: Maybe<FilmShootingEntityResponse>;
  deleteFilmistan?: Maybe<FilmistanEntityResponse>;
  deleteForeignInfo?: Maybe<ForeignInfoEntityResponse>;
  deleteForeignTourist?: Maybe<ForeignTouristEntityResponse>;
  deleteGallery?: Maybe<GalleryEntityResponse>;
  deleteHeritageProperty?: Maybe<HeritagePropertyEntityResponse>;
  deleteHome?: Maybe<HomeEntityResponse>;
  deleteHowToGetThere?: Maybe<HowToGetThereEntityResponse>;
  deleteIhmsAndFci?: Maybe<IhmsAndFciEntityResponse>;
  deleteLanding?: Maybe<LandingEntityResponse>;
  deleteLuxuryOnWheel?: Maybe<LuxuryOnWheelEntityResponse>;
  deleteLuxuryOnWheelsDetail?: Maybe<LuxuryOnWheelsDetailEntityResponse>;
  deleteMoreActivity?: Maybe<MoreActivityEntityResponse>;
  deleteOther?: Maybe<OtherEntityResponse>;
  deletePackage?: Maybe<PackageEntityResponse>;
  deletePackageDetail?: Maybe<PackageDetailEntityResponse>;
  deletePlace?: Maybe<PlaceEntityResponse>;
  deletePlaceDetail?: Maybe<PlaceDetailEntityResponse>;
  deletePlanTrip?: Maybe<PlanTripEntityResponse>;
  deletePrintAd?: Maybe<PrintAdEntityResponse>;
  deleteRajasthanTravelGuide?: Maybe<RajasthanTravelGuideEntityResponse>;
  deleteRegistrationForTravelAgency?: Maybe<RegistrationForTravelAgencyEntityResponse>;
  deleteSeeAllPlace?: Maybe<SeeAllPlaceEntityResponse>;
  deleteSuggestedItinerie?: Maybe<SuggestedItinerieEntityResponse>;
  deleteTopActivity?: Maybe<TopActivityEntityResponse>;
  deleteTopPackage?: Maybe<TopPackageEntityResponse>;
  deleteTravelDairy?: Maybe<TravelDairyEntityResponse>;
  deleteTravelDesk?: Maybe<TravelDeskEntityResponse>;
  deleteTravelGuide?: Maybe<TravelGuideEntityResponse>;
  deleteUpcomingEvent?: Maybe<UpcomingEventEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  removeFile?: Maybe<UploadFileEntityResponse>;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateActPolicyAndScheme?: Maybe<ActPolicyAndSchemeEntityResponse>;
  updateActivity?: Maybe<ActivityEntityResponse>;
  updateAdventure?: Maybe<AdventureEntityResponse>;
  updateAdventureListBanner?: Maybe<AdventureListBannerEntityResponse>;
  updateAllMedia?: Maybe<AllMediaEntityResponse>;
  updateAllPackage?: Maybe<AllPackageEntityResponse>;
  updateBestTime?: Maybe<BestTimeEntityResponse>;
  updateCategory?: Maybe<CategoryEntityResponse>;
  updateCity?: Maybe<CityEntityResponse>;
  updateCityDetail?: Maybe<CityDetailEntityResponse>;
  updateContactUs?: Maybe<ContactUsEntityResponse>;
  updateDepartment?: Maybe<DepartmentEntityResponse>;
  updateDestination?: Maybe<DestinationEntityResponse>;
  updateEmployeeCorner?: Maybe<EmployeeCornerEntityResponse>;
  updateEvent?: Maybe<EventEntityResponse>;
  updateExplore?: Maybe<ExploreEntityResponse>;
  updateExploreAll?: Maybe<ExploreAllEntityResponse>;
  updateExploreAllArrange?: Maybe<ExploreAllArrangeEntityResponse>;
  updateFairsAndFestival?: Maybe<FairsAndFestivalEntityResponse>;
  updateFairsAndFestivalListBanner?: Maybe<FairsAndFestivalListBannerEntityResponse>;
  updateFestivalsAndFair?: Maybe<FestivalsAndFairEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateFilm?: Maybe<FilmEntityResponse>;
  updateFilmShooting?: Maybe<FilmShootingEntityResponse>;
  updateFilmistan?: Maybe<FilmistanEntityResponse>;
  updateForeignInfo?: Maybe<ForeignInfoEntityResponse>;
  updateForeignTourist?: Maybe<ForeignTouristEntityResponse>;
  updateGallery?: Maybe<GalleryEntityResponse>;
  updateHeritageProperty?: Maybe<HeritagePropertyEntityResponse>;
  updateHome?: Maybe<HomeEntityResponse>;
  updateHowToGetThere?: Maybe<HowToGetThereEntityResponse>;
  updateIhmsAndFci?: Maybe<IhmsAndFciEntityResponse>;
  updateLanding?: Maybe<LandingEntityResponse>;
  updateLuxuryOnWheel?: Maybe<LuxuryOnWheelEntityResponse>;
  updateLuxuryOnWheelsDetail?: Maybe<LuxuryOnWheelsDetailEntityResponse>;
  updateMoreActivity?: Maybe<MoreActivityEntityResponse>;
  updateOther?: Maybe<OtherEntityResponse>;
  updatePackage?: Maybe<PackageEntityResponse>;
  updatePackageDetail?: Maybe<PackageDetailEntityResponse>;
  updatePlace?: Maybe<PlaceEntityResponse>;
  updatePlaceDetail?: Maybe<PlaceDetailEntityResponse>;
  updatePlanTrip?: Maybe<PlanTripEntityResponse>;
  updatePrintAd?: Maybe<PrintAdEntityResponse>;
  updateRajasthanTravelGuide?: Maybe<RajasthanTravelGuideEntityResponse>;
  updateRegistrationForTravelAgency?: Maybe<RegistrationForTravelAgencyEntityResponse>;
  updateSeeAllPlace?: Maybe<SeeAllPlaceEntityResponse>;
  updateSuggestedItinerie?: Maybe<SuggestedItinerieEntityResponse>;
  updateTopActivity?: Maybe<TopActivityEntityResponse>;
  updateTopPackage?: Maybe<TopPackageEntityResponse>;
  updateTravelDairy?: Maybe<TravelDairyEntityResponse>;
  updateTravelDesk?: Maybe<TravelDeskEntityResponse>;
  updateTravelGuide?: Maybe<TravelGuideEntityResponse>;
  updateUpcomingEvent?: Maybe<UpcomingEventEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationCreateActivityArgs = {
  data: ActivityInput;
};


export type MutationCreateAdventureArgs = {
  data: AdventureInput;
};


export type MutationCreateCategoryArgs = {
  data: CategoryInput;
};


export type MutationCreateCityArgs = {
  data: CityInput;
};


export type MutationCreateCityDetailArgs = {
  data: CityDetailInput;
};


export type MutationCreateDepartmentArgs = {
  data: DepartmentInput;
};


export type MutationCreateEventArgs = {
  data: EventInput;
};


export type MutationCreateExploreAllArgs = {
  data: ExploreAllInput;
};


export type MutationCreateFestivalsAndFairArgs = {
  data: FestivalsAndFairInput;
};


export type MutationCreateFilmArgs = {
  data: FilmInput;
};


export type MutationCreateForeignInfoArgs = {
  data: ForeignInfoInput;
};


export type MutationCreateGalleryArgs = {
  data: GalleryInput;
};


export type MutationCreatePackageArgs = {
  data: PackageInput;
};


export type MutationCreatePackageDetailArgs = {
  data: PackageDetailInput;
};


export type MutationCreatePlaceArgs = {
  data: PlaceInput;
};


export type MutationCreatePlaceDetailArgs = {
  data: PlaceDetailInput;
};


export type MutationCreatePrintAdArgs = {
  data: PrintAdInput;
};


export type MutationCreateTopActivityArgs = {
  data: TopActivityInput;
};


export type MutationCreateTravelGuideArgs = {
  data: TravelGuideInput;
};


export type MutationCreateUpcomingEventArgs = {
  data: UpcomingEventInput;
};


export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};


export type MutationCreateUploadFolderArgs = {
  data: UploadFolderInput;
};


export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};


export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};


export type MutationDeleteActivityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAdventureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCityDetailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDepartmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExploreAllArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFestivalsAndFairArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFilmArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteForeignInfoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGalleryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePackageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePackageDetailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlaceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlaceDetailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePrintAdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTopActivityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTravelGuideArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUpcomingEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUploadFolderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};


export type MutationMultipleUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  files: Array<InputMaybe<Scalars['Upload']['input']>>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationRemoveFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type MutationUpdateActPolicyAndSchemeArgs = {
  data: ActPolicyAndSchemeInput;
};


export type MutationUpdateActivityArgs = {
  data: ActivityInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateAdventureArgs = {
  data: AdventureInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateAdventureListBannerArgs = {
  data: AdventureListBannerInput;
};


export type MutationUpdateAllMediaArgs = {
  data: AllMediaInput;
};


export type MutationUpdateAllPackageArgs = {
  data: AllPackageInput;
};


export type MutationUpdateBestTimeArgs = {
  data: BestTimeInput;
};


export type MutationUpdateCategoryArgs = {
  data: CategoryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCityArgs = {
  data: CityInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCityDetailArgs = {
  data: CityDetailInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateContactUsArgs = {
  data: ContactUsInput;
};


export type MutationUpdateDepartmentArgs = {
  data: DepartmentInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateDestinationArgs = {
  data: DestinationInput;
};


export type MutationUpdateEmployeeCornerArgs = {
  data: EmployeeCornerInput;
};


export type MutationUpdateEventArgs = {
  data: EventInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateExploreArgs = {
  data: ExploreInput;
};


export type MutationUpdateExploreAllArgs = {
  data: ExploreAllInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateExploreAllArrangeArgs = {
  data: ExploreAllArrangeInput;
};


export type MutationUpdateFairsAndFestivalArgs = {
  data: FairsAndFestivalInput;
};


export type MutationUpdateFairsAndFestivalListBannerArgs = {
  data: FairsAndFestivalListBannerInput;
};


export type MutationUpdateFestivalsAndFairArgs = {
  data: FestivalsAndFairInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID']['input'];
  info?: InputMaybe<FileInfoInput>;
};


export type MutationUpdateFilmArgs = {
  data: FilmInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateFilmShootingArgs = {
  data: FilmShootingInput;
};


export type MutationUpdateFilmistanArgs = {
  data: FilmistanInput;
};


export type MutationUpdateForeignInfoArgs = {
  data: ForeignInfoInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateForeignTouristArgs = {
  data: ForeignTouristInput;
};


export type MutationUpdateGalleryArgs = {
  data: GalleryInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateHeritagePropertyArgs = {
  data: HeritagePropertyInput;
};


export type MutationUpdateHomeArgs = {
  data: HomeInput;
};


export type MutationUpdateHowToGetThereArgs = {
  data: HowToGetThereInput;
};


export type MutationUpdateIhmsAndFciArgs = {
  data: IhmsAndFciInput;
};


export type MutationUpdateLandingArgs = {
  data: LandingInput;
};


export type MutationUpdateLuxuryOnWheelArgs = {
  data: LuxuryOnWheelInput;
};


export type MutationUpdateLuxuryOnWheelsDetailArgs = {
  data: LuxuryOnWheelsDetailInput;
};


export type MutationUpdateMoreActivityArgs = {
  data: MoreActivityInput;
};


export type MutationUpdateOtherArgs = {
  data: OtherInput;
};


export type MutationUpdatePackageArgs = {
  data: PackageInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePackageDetailArgs = {
  data: PackageDetailInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlaceArgs = {
  data: PlaceInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlaceDetailArgs = {
  data: PlaceDetailInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePlanTripArgs = {
  data: PlanTripInput;
};


export type MutationUpdatePrintAdArgs = {
  data: PrintAdInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRajasthanTravelGuideArgs = {
  data: RajasthanTravelGuideInput;
};


export type MutationUpdateRegistrationForTravelAgencyArgs = {
  data: RegistrationForTravelAgencyInput;
};


export type MutationUpdateSeeAllPlaceArgs = {
  data: SeeAllPlaceInput;
};


export type MutationUpdateSuggestedItinerieArgs = {
  data: SuggestedItinerieInput;
};


export type MutationUpdateTopActivityArgs = {
  data: TopActivityInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTopPackageArgs = {
  data: TopPackageInput;
};


export type MutationUpdateTravelDairyArgs = {
  data: TravelDairyInput;
};


export type MutationUpdateTravelDeskArgs = {
  data: TravelDeskInput;
};


export type MutationUpdateTravelGuideArgs = {
  data: TravelGuideInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUpcomingEventArgs = {
  data: UpcomingEventInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUploadFolderArgs = {
  data: UploadFolderInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID']['input'];
};


export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']['input']>;
  refId?: InputMaybe<Scalars['ID']['input']>;
};

export type Other = {
  __typename?: 'Other';
  content?: Maybe<Array<Maybe<ComponentCommonPermissions>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type OtherContentArgs = {
  filters?: InputMaybe<ComponentCommonPermissionsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type OtherEntity = {
  __typename?: 'OtherEntity';
  attributes?: Maybe<Other>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type OtherEntityResponse = {
  __typename?: 'OtherEntityResponse';
  data?: Maybe<OtherEntity>;
};

export type OtherInput = {
  content?: InputMaybe<Array<InputMaybe<ComponentCommonPermissionsInput>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Package = {
  __typename?: 'Package';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<UploadFileEntityResponse>;
  link?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  package_detail?: Maybe<PackageDetailEntityResponse>;
  popularity: Scalars['Long']['output'];
  price?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PackageDetail = {
  __typename?: 'PackageDetail';
  bookable?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  days?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  images?: Maybe<UploadFileRelationResponseCollection>;
  name?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  package?: Maybe<PackageEntityResponse>;
  places?: Maybe<ComponentPackagePackagePlaces>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PackageDetailImagesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PackageDetailEntity = {
  __typename?: 'PackageDetailEntity';
  attributes?: Maybe<PackageDetail>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PackageDetailEntityResponse = {
  __typename?: 'PackageDetailEntityResponse';
  data?: Maybe<PackageDetailEntity>;
};

export type PackageDetailEntityResponseCollection = {
  __typename?: 'PackageDetailEntityResponseCollection';
  data: Array<PackageDetailEntity>;
  meta: ResponseCollectionMeta;
};

export type PackageDetailFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PackageDetailFiltersInput>>>;
  bookable?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  days?: InputMaybe<StringFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<PackageDetailFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PackageDetailFiltersInput>>>;
  overview?: InputMaybe<StringFilterInput>;
  package?: InputMaybe<PackageFiltersInput>;
  places?: InputMaybe<ComponentPackagePackagePlacesFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PackageDetailInput = {
  bookable?: InputMaybe<Scalars['Boolean']['input']>;
  days?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  overview?: InputMaybe<Scalars['String']['input']>;
  package?: InputMaybe<Scalars['ID']['input']>;
  places?: InputMaybe<ComponentPackagePackagePlacesInput>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type PackageEntity = {
  __typename?: 'PackageEntity';
  attributes?: Maybe<Package>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PackageEntityResponse = {
  __typename?: 'PackageEntityResponse';
  data?: Maybe<PackageEntity>;
};

export type PackageEntityResponseCollection = {
  __typename?: 'PackageEntityResponseCollection';
  data: Array<PackageEntity>;
  meta: ResponseCollectionMeta;
};

export type PackageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PackageFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<PackageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PackageFiltersInput>>>;
  package_detail?: InputMaybe<PackageDetailFiltersInput>;
  popularity?: InputMaybe<LongFilterInput>;
  price?: InputMaybe<StringFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  rating?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PackageInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['ID']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  package_detail?: InputMaybe<Scalars['ID']['input']>;
  popularity?: InputMaybe<Scalars['Long']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  rating?: InputMaybe<Scalars['String']['input']>;
};

export type PackageRelationResponseCollection = {
  __typename?: 'PackageRelationResponseCollection';
  data: Array<PackageEntity>;
};

export type Pagination = {
  __typename?: 'Pagination';
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type Place = {
  __typename?: 'Place';
  bookable?: Maybe<Scalars['Boolean']['output']>;
  categories?: Maybe<CategoryRelationResponseCollection>;
  city?: Maybe<CityEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<DepartmentEntityResponse>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  images?: Maybe<UploadFileRelationResponseCollection>;
  link?: Maybe<Scalars['String']['output']>;
  locationDetail?: Maybe<Scalars['String']['output']>;
  map?: Maybe<UploadFileEntityResponse>;
  mobile?: Maybe<Scalars['String']['output']>;
  mobile2?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  placeDetail?: Maybe<PlaceDetailEntityResponse>;
  place_tag?: Maybe<Scalars['String']['output']>;
  popularity: Scalars['Long']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  rating?: Maybe<Scalars['String']['output']>;
  subCategory?: Maybe<Enum_Place_Subcategory>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  video?: Maybe<UploadFileEntityResponse>;
  visit_time?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};


export type PlaceCategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type PlaceImagesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlaceDetail = {
  __typename?: 'PlaceDetail';
  categories?: Maybe<Array<Maybe<ComponentPlaceDetailCategory>>>;
  content?: Maybe<Array<Maybe<PlaceDetailContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  place?: Maybe<PlaceEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PlaceDetailCategoriesArgs = {
  filters?: InputMaybe<ComponentPlaceDetailCategoryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlaceDetailContentDynamicZone = ComponentPlaceDetail3DVideo | ComponentPlaceDetailDescription | ComponentPlaceDetailDynamicprice | ComponentPlaceDetailHeader | ComponentPlaceDetailImages | ComponentPlaceDetailPlaceAttraction | ComponentPlaceDetailPlaceGallery | ComponentPlaceDetailPlaceTime | ComponentPlaceDetailPlaceexhibit | ComponentPlaceDetailPlaceothers | ComponentPlaceDetailPlaceoverview | ComponentPlaceDetailPlacestovisit | ComponentPlaceDetailPlacetickets | Error;

export type PlaceDetailEntity = {
  __typename?: 'PlaceDetailEntity';
  attributes?: Maybe<PlaceDetail>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PlaceDetailEntityResponse = {
  __typename?: 'PlaceDetailEntityResponse';
  data?: Maybe<PlaceDetailEntity>;
};

export type PlaceDetailEntityResponseCollection = {
  __typename?: 'PlaceDetailEntityResponseCollection';
  data: Array<PlaceDetailEntity>;
  meta: ResponseCollectionMeta;
};

export type PlaceDetailFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PlaceDetailFiltersInput>>>;
  categories?: InputMaybe<ComponentPlaceDetailCategoryFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<PlaceDetailFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PlaceDetailFiltersInput>>>;
  place?: InputMaybe<PlaceFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PlaceDetailInput = {
  categories?: InputMaybe<Array<InputMaybe<ComponentPlaceDetailCategoryInput>>>;
  content?: InputMaybe<Array<Scalars['PlaceDetailContentDynamicZoneInput']['input']>>;
  place?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type PlaceEntity = {
  __typename?: 'PlaceEntity';
  attributes?: Maybe<Place>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PlaceEntityResponse = {
  __typename?: 'PlaceEntityResponse';
  data?: Maybe<PlaceEntity>;
};

export type PlaceEntityResponseCollection = {
  __typename?: 'PlaceEntityResponseCollection';
  data: Array<PlaceEntity>;
  meta: ResponseCollectionMeta;
};

export type PlaceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PlaceFiltersInput>>>;
  bookable?: InputMaybe<BooleanFilterInput>;
  categories?: InputMaybe<CategoryFiltersInput>;
  city?: InputMaybe<CityFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  department?: InputMaybe<DepartmentFiltersInput>;
  description?: InputMaybe<StringFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  locationDetail?: InputMaybe<StringFilterInput>;
  mobile?: InputMaybe<StringFilterInput>;
  mobile2?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<PlaceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PlaceFiltersInput>>>;
  placeDetail?: InputMaybe<PlaceDetailFiltersInput>;
  place_tag?: InputMaybe<StringFilterInput>;
  popularity?: InputMaybe<LongFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  rating?: InputMaybe<StringFilterInput>;
  subCategory?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  visit_time?: InputMaybe<StringFilterInput>;
  website?: InputMaybe<StringFilterInput>;
};

export type PlaceInput = {
  bookable?: InputMaybe<Scalars['Boolean']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  city?: InputMaybe<Scalars['ID']['input']>;
  department?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  link?: InputMaybe<Scalars['String']['input']>;
  locationDetail?: InputMaybe<Scalars['String']['input']>;
  map?: InputMaybe<Scalars['ID']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  mobile2?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  placeDetail?: InputMaybe<Scalars['ID']['input']>;
  place_tag?: InputMaybe<Scalars['String']['input']>;
  popularity?: InputMaybe<Scalars['Long']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  rating?: InputMaybe<Scalars['String']['input']>;
  subCategory?: InputMaybe<Enum_Place_Subcategory>;
  video?: InputMaybe<Scalars['ID']['input']>;
  visit_time?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type PlaceRelationResponseCollection = {
  __typename?: 'PlaceRelationResponseCollection';
  data: Array<PlaceEntity>;
};

export type PlanTrip = {
  __typename?: 'PlanTrip';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  trip?: Maybe<Array<Maybe<ComponentPlanTripPlanTrip>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PlanTripTripArgs = {
  filters?: InputMaybe<ComponentPlanTripPlanTripFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlanTripEntity = {
  __typename?: 'PlanTripEntity';
  attributes?: Maybe<PlanTrip>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PlanTripEntityResponse = {
  __typename?: 'PlanTripEntityResponse';
  data?: Maybe<PlanTripEntity>;
};

export type PlanTripInput = {
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  trip?: InputMaybe<Array<InputMaybe<ComponentPlanTripPlanTripInput>>>;
};

export type PrintAd = {
  __typename?: 'PrintAd';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  pdf?: Maybe<UploadFileEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PrintAdEntity = {
  __typename?: 'PrintAdEntity';
  attributes?: Maybe<PrintAd>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PrintAdEntityResponse = {
  __typename?: 'PrintAdEntityResponse';
  data?: Maybe<PrintAdEntity>;
};

export type PrintAdEntityResponseCollection = {
  __typename?: 'PrintAdEntityResponseCollection';
  data: Array<PrintAdEntity>;
  meta: ResponseCollectionMeta;
};

export type PrintAdFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PrintAdFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<PrintAdFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PrintAdFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PrintAdInput = {
  link?: InputMaybe<Scalars['String']['input']>;
  pdf?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PrintAdRelationResponseCollection = {
  __typename?: 'PrintAdRelationResponseCollection';
  data: Array<PrintAdEntity>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW'
}

export type Query = {
  __typename?: 'Query';
  actPolicyAndScheme?: Maybe<ActPolicyAndSchemeEntityResponse>;
  activities?: Maybe<ActivityEntityResponseCollection>;
  activity?: Maybe<ActivityEntityResponse>;
  adventure?: Maybe<AdventureEntityResponse>;
  adventureListBanner?: Maybe<AdventureListBannerEntityResponse>;
  adventures?: Maybe<AdventureEntityResponseCollection>;
  allMedia?: Maybe<AllMediaEntityResponse>;
  allPackage?: Maybe<AllPackageEntityResponse>;
  bestTime?: Maybe<BestTimeEntityResponse>;
  categories?: Maybe<CategoryEntityResponseCollection>;
  category?: Maybe<CategoryEntityResponse>;
  cities?: Maybe<CityEntityResponseCollection>;
  city?: Maybe<CityEntityResponse>;
  cityDetail?: Maybe<CityDetailEntityResponse>;
  cityDetails?: Maybe<CityDetailEntityResponseCollection>;
  contactUs?: Maybe<ContactUsEntityResponse>;
  department?: Maybe<DepartmentEntityResponse>;
  departments?: Maybe<DepartmentEntityResponseCollection>;
  destination?: Maybe<DestinationEntityResponse>;
  employeeCorner?: Maybe<EmployeeCornerEntityResponse>;
  event?: Maybe<EventEntityResponse>;
  events?: Maybe<EventEntityResponseCollection>;
  explore?: Maybe<ExploreEntityResponse>;
  exploreAll?: Maybe<ExploreAllEntityResponse>;
  exploreAllArrange?: Maybe<ExploreAllArrangeEntityResponse>;
  exploreAlls?: Maybe<ExploreAllEntityResponseCollection>;
  fairsAndFestival?: Maybe<FairsAndFestivalEntityResponse>;
  fairsAndFestivalListBanner?: Maybe<FairsAndFestivalListBannerEntityResponse>;
  festivalsAndFair?: Maybe<FestivalsAndFairEntityResponse>;
  festivalsAndFairs?: Maybe<FestivalsAndFairEntityResponseCollection>;
  film?: Maybe<FilmEntityResponse>;
  filmShooting?: Maybe<FilmShootingEntityResponse>;
  filmistan?: Maybe<FilmistanEntityResponse>;
  films?: Maybe<FilmEntityResponseCollection>;
  foreignInfo?: Maybe<ForeignInfoEntityResponse>;
  foreignInfos?: Maybe<ForeignInfoEntityResponseCollection>;
  foreignTourist?: Maybe<ForeignTouristEntityResponse>;
  galleries?: Maybe<GalleryEntityResponseCollection>;
  gallery?: Maybe<GalleryEntityResponse>;
  heritageProperty?: Maybe<HeritagePropertyEntityResponse>;
  home?: Maybe<HomeEntityResponse>;
  howToGetThere?: Maybe<HowToGetThereEntityResponse>;
  i18NLocale?: Maybe<I18NLocaleEntityResponse>;
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>;
  ihmsAndFci?: Maybe<IhmsAndFciEntityResponse>;
  landing?: Maybe<LandingEntityResponse>;
  luxuryOnWheel?: Maybe<LuxuryOnWheelEntityResponse>;
  luxuryOnWheelsDetail?: Maybe<LuxuryOnWheelsDetailEntityResponse>;
  me?: Maybe<UsersPermissionsMe>;
  moreActivity?: Maybe<MoreActivityEntityResponse>;
  other?: Maybe<OtherEntityResponse>;
  package?: Maybe<PackageEntityResponse>;
  packageDetail?: Maybe<PackageDetailEntityResponse>;
  packageDetails?: Maybe<PackageDetailEntityResponseCollection>;
  packages?: Maybe<PackageEntityResponseCollection>;
  place?: Maybe<PlaceEntityResponse>;
  placeDetail?: Maybe<PlaceDetailEntityResponse>;
  placeDetails?: Maybe<PlaceDetailEntityResponseCollection>;
  places?: Maybe<PlaceEntityResponseCollection>;
  planTrip?: Maybe<PlanTripEntityResponse>;
  printAd?: Maybe<PrintAdEntityResponse>;
  printAds?: Maybe<PrintAdEntityResponseCollection>;
  rajasthanTravelGuide?: Maybe<RajasthanTravelGuideEntityResponse>;
  registrationForTravelAgency?: Maybe<RegistrationForTravelAgencyEntityResponse>;
  seeAllPlace?: Maybe<SeeAllPlaceEntityResponse>;
  suggestedItinerie?: Maybe<SuggestedItinerieEntityResponse>;
  topActivities?: Maybe<TopActivityEntityResponseCollection>;
  topActivity?: Maybe<TopActivityEntityResponse>;
  topPackage?: Maybe<TopPackageEntityResponse>;
  travelDairy?: Maybe<TravelDairyEntityResponse>;
  travelDesk?: Maybe<TravelDeskEntityResponse>;
  travelGuide?: Maybe<TravelGuideEntityResponse>;
  travelGuides?: Maybe<TravelGuideEntityResponseCollection>;
  upcomingEvent?: Maybe<UpcomingEventEntityResponse>;
  upcomingEvents?: Maybe<UpcomingEventEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};


export type QueryActPolicyAndSchemeArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryActivitiesArgs = {
  filters?: InputMaybe<ActivityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryActivityArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAdventureArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAdventureListBannerArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryAdventuresArgs = {
  filters?: InputMaybe<AdventureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryAllMediaArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryAllPackageArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryBestTimeArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryCategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCitiesArgs = {
  filters?: InputMaybe<CityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryCityArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCityDetailArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCityDetailsArgs = {
  filters?: InputMaybe<CityDetailFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryContactUsArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryDepartmentArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDepartmentsArgs = {
  filters?: InputMaybe<DepartmentFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryDestinationArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryEmployeeCornerArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryEventsArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryExploreArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryExploreAllArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryExploreAllArrangeArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryExploreAllsArgs = {
  filters?: InputMaybe<ExploreAllFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryFairsAndFestivalArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryFairsAndFestivalListBannerArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryFestivalsAndFairArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryFestivalsAndFairsArgs = {
  filters?: InputMaybe<FestivalsAndFairFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryFilmArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryFilmShootingArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryFilmistanArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryFilmsArgs = {
  filters?: InputMaybe<FilmFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryForeignInfoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryForeignInfosArgs = {
  filters?: InputMaybe<ForeignInfoFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryForeignTouristArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryGalleriesArgs = {
  filters?: InputMaybe<GalleryFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryGalleryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryHeritagePropertyArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryHomeArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryHowToGetThereArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryI18NLocaleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryIhmsAndFciArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryLandingArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryLuxuryOnWheelArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryLuxuryOnWheelsDetailArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryMoreActivityArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryOtherArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryPackageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPackageDetailArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPackageDetailsArgs = {
  filters?: InputMaybe<PackageDetailFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPackagesArgs = {
  filters?: InputMaybe<PackageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPlaceArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPlaceDetailArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPlaceDetailsArgs = {
  filters?: InputMaybe<PlaceDetailFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPlacesArgs = {
  filters?: InputMaybe<PlaceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPlanTripArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryPrintAdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPrintAdsArgs = {
  filters?: InputMaybe<PrintAdFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryRajasthanTravelGuideArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryRegistrationForTravelAgencyArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QuerySeeAllPlaceArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QuerySuggestedItinerieArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryTopActivitiesArgs = {
  filters?: InputMaybe<TopActivityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTopActivityArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryTopPackageArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryTravelDairyArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryTravelDeskArgs = {
  publicationState?: InputMaybe<PublicationState>;
};


export type QueryTravelGuideArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryTravelGuidesArgs = {
  filters?: InputMaybe<TravelGuideFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUpcomingEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUpcomingEventsArgs = {
  filters?: InputMaybe<UpcomingEventFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUploadFileArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUploadFolderArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUploadFoldersArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUsersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryUsersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type RajasthanTravelGuide = {
  __typename?: 'RajasthanTravelGuide';
  content?: Maybe<Array<Maybe<RajasthanTravelGuideContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title_1?: Maybe<Scalars['String']['output']>;
  title_2?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RajasthanTravelGuideContentDynamicZone = ComponentGuideTravelGuide | Error;

export type RajasthanTravelGuideEntity = {
  __typename?: 'RajasthanTravelGuideEntity';
  attributes?: Maybe<RajasthanTravelGuide>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type RajasthanTravelGuideEntityResponse = {
  __typename?: 'RajasthanTravelGuideEntityResponse';
  data?: Maybe<RajasthanTravelGuideEntity>;
};

export type RajasthanTravelGuideInput = {
  content?: InputMaybe<Array<Scalars['RajasthanTravelGuideContentDynamicZoneInput']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title_1?: InputMaybe<Scalars['String']['input']>;
  title_2?: InputMaybe<Scalars['String']['input']>;
};

export type RegistrationForTravelAgency = {
  __typename?: 'RegistrationForTravelAgency';
  content?: Maybe<Array<Maybe<RegistrationForTravelAgencyContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RegistrationForTravelAgencyContentDynamicZone = ComponentCommonPolicyCard | ComponentTravelAgencyBanner | Error;

export type RegistrationForTravelAgencyEntity = {
  __typename?: 'RegistrationForTravelAgencyEntity';
  attributes?: Maybe<RegistrationForTravelAgency>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type RegistrationForTravelAgencyEntityResponse = {
  __typename?: 'RegistrationForTravelAgencyEntityResponse';
  data?: Maybe<RegistrationForTravelAgencyEntity>;
};

export type RegistrationForTravelAgencyInput = {
  content?: InputMaybe<Array<Scalars['RegistrationForTravelAgencyContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ResponseCollectionMeta = {
  __typename?: 'ResponseCollectionMeta';
  pagination: Pagination;
};

export type SeeAllPlace = {
  __typename?: 'SeeAllPlace';
  content?: Maybe<Array<Maybe<SeeAllPlaceContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SeeAllPlaceContentDynamicZone = ComponentPlacePlaceContent | ComponentPlacePlaceHeader | Error;

export type SeeAllPlaceEntity = {
  __typename?: 'SeeAllPlaceEntity';
  attributes?: Maybe<SeeAllPlace>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type SeeAllPlaceEntityResponse = {
  __typename?: 'SeeAllPlaceEntityResponse';
  data?: Maybe<SeeAllPlaceEntity>;
};

export type SeeAllPlaceInput = {
  content?: InputMaybe<Array<Scalars['SeeAllPlaceContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  containsi?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  eqi?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  nei?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notContainsi?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notNull?: InputMaybe<Scalars['Boolean']['input']>;
  null?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type SuggestedItinerie = {
  __typename?: 'SuggestedItinerie';
  content?: Maybe<Array<Maybe<SuggestedItinerieContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SuggestedItinerieContentDynamicZone = ComponentCommonBanner | ComponentSuggestedItineriesItinerary | Error;

export type SuggestedItinerieEntity = {
  __typename?: 'SuggestedItinerieEntity';
  attributes?: Maybe<SuggestedItinerie>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type SuggestedItinerieEntityResponse = {
  __typename?: 'SuggestedItinerieEntityResponse';
  data?: Maybe<SuggestedItinerieEntity>;
};

export type SuggestedItinerieInput = {
  content?: InputMaybe<Array<Scalars['SuggestedItinerieContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type TopActivity = {
  __typename?: 'TopActivity';
  activities?: Maybe<ActivityRelationResponseCollection>;
  city?: Maybe<CityEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type TopActivityActivitiesArgs = {
  filters?: InputMaybe<ActivityFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TopActivityEntity = {
  __typename?: 'TopActivityEntity';
  attributes?: Maybe<TopActivity>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TopActivityEntityResponse = {
  __typename?: 'TopActivityEntityResponse';
  data?: Maybe<TopActivityEntity>;
};

export type TopActivityEntityResponseCollection = {
  __typename?: 'TopActivityEntityResponseCollection';
  data: Array<TopActivityEntity>;
  meta: ResponseCollectionMeta;
};

export type TopActivityFiltersInput = {
  activities?: InputMaybe<ActivityFiltersInput>;
  and?: InputMaybe<Array<InputMaybe<TopActivityFiltersInput>>>;
  city?: InputMaybe<CityFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<TopActivityFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TopActivityFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TopActivityInput = {
  activities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  city?: InputMaybe<Scalars['ID']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TopPackage = {
  __typename?: 'TopPackage';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  package?: Maybe<Array<Maybe<ComponentTopPackagesTopPackages>>>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type TopPackagePackageArgs = {
  filters?: InputMaybe<ComponentTopPackagesTopPackagesFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TopPackageEntity = {
  __typename?: 'TopPackageEntity';
  attributes?: Maybe<TopPackage>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TopPackageEntityResponse = {
  __typename?: 'TopPackageEntityResponse';
  data?: Maybe<TopPackageEntity>;
};

export type TopPackageInput = {
  package?: InputMaybe<Array<InputMaybe<ComponentTopPackagesTopPackagesInput>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TravelDairy = {
  __typename?: 'TravelDairy';
  content?: Maybe<Array<Maybe<TravelDairyContentDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TravelDairyContentDynamicZone = ComponentCommonBanner | ComponentDairyBlogs | Error;

export type TravelDairyEntity = {
  __typename?: 'TravelDairyEntity';
  attributes?: Maybe<TravelDairy>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TravelDairyEntityResponse = {
  __typename?: 'TravelDairyEntityResponse';
  data?: Maybe<TravelDairyEntity>;
};

export type TravelDairyInput = {
  content?: InputMaybe<Array<Scalars['TravelDairyContentDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TravelDesk = {
  __typename?: 'TravelDesk';
  banner?: Maybe<Array<Maybe<TravelDeskBannerDynamicZone>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TravelDeskBannerDynamicZone = ComponentCommonBanner | ComponentTravelDeskContent | Error;

export type TravelDeskEntity = {
  __typename?: 'TravelDeskEntity';
  attributes?: Maybe<TravelDesk>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TravelDeskEntityResponse = {
  __typename?: 'TravelDeskEntityResponse';
  data?: Maybe<TravelDeskEntity>;
};

export type TravelDeskInput = {
  banner?: InputMaybe<Array<Scalars['TravelDeskBannerDynamicZoneInput']['input']>>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TravelGuide = {
  __typename?: 'TravelGuide';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<UploadFileRelationResponseCollection>;
  link?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type TravelGuideImageArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TravelGuideEntity = {
  __typename?: 'TravelGuideEntity';
  attributes?: Maybe<TravelGuide>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type TravelGuideEntityResponse = {
  __typename?: 'TravelGuideEntityResponse';
  data?: Maybe<TravelGuideEntity>;
};

export type TravelGuideEntityResponseCollection = {
  __typename?: 'TravelGuideEntityResponseCollection';
  data: Array<TravelGuideEntity>;
  meta: ResponseCollectionMeta;
};

export type TravelGuideFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<TravelGuideFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<TravelGuideFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TravelGuideFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TravelGuideInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  link?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type TravelGuideRelationResponseCollection = {
  __typename?: 'TravelGuideRelationResponseCollection';
  data: Array<TravelGuideEntity>;
};

export type UpcomingEvent = {
  __typename?: 'UpcomingEvent';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  eventEndDate?: Maybe<Scalars['Date']['output']>;
  eventPhoto: UploadFileEntityResponse;
  eventStartDate?: Maybe<Scalars['Date']['output']>;
  eventTime?: Maybe<Scalars['String']['output']>;
  eventTitle: Scalars['String']['output'];
  eventType?: Maybe<Scalars['String']['output']>;
  isFeatured: Scalars['Boolean']['output'];
  organizedBy?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  sectionName: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UpcomingEventEntity = {
  __typename?: 'UpcomingEventEntity';
  attributes?: Maybe<UpcomingEvent>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UpcomingEventEntityResponse = {
  __typename?: 'UpcomingEventEntityResponse';
  data?: Maybe<UpcomingEventEntity>;
};

export type UpcomingEventEntityResponseCollection = {
  __typename?: 'UpcomingEventEntityResponseCollection';
  data: Array<UpcomingEventEntity>;
  meta: ResponseCollectionMeta;
};

export type UpcomingEventFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UpcomingEventFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  eventEndDate?: InputMaybe<DateFilterInput>;
  eventStartDate?: InputMaybe<DateFilterInput>;
  eventTime?: InputMaybe<StringFilterInput>;
  eventTitle?: InputMaybe<StringFilterInput>;
  eventType?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  isFeatured?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<UpcomingEventFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UpcomingEventFiltersInput>>>;
  organizedBy?: InputMaybe<StringFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  sectionName?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UpcomingEventInput = {
  eventEndDate?: InputMaybe<Scalars['Date']['input']>;
  eventPhoto?: InputMaybe<Scalars['ID']['input']>;
  eventStartDate?: InputMaybe<Scalars['Date']['input']>;
  eventTime?: InputMaybe<Scalars['String']['input']>;
  eventTitle?: InputMaybe<Scalars['String']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  organizedBy?: InputMaybe<Scalars['String']['input']>;
  publishedAt?: InputMaybe<Scalars['DateTime']['input']>;
  sectionName?: InputMaybe<Scalars['String']['input']>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  alternativeText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  formats?: Maybe<Scalars['JSON']['output']>;
  hash: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  mime: Scalars['String']['output'];
  name: Scalars['String']['output'];
  previewUrl?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  provider_metadata?: Maybe<Scalars['JSON']['output']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type UploadFileEntity = {
  __typename?: 'UploadFileEntity';
  attributes?: Maybe<UploadFile>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFileEntityResponse = {
  __typename?: 'UploadFileEntityResponse';
  data?: Maybe<UploadFileEntity>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: 'UploadFileEntityResponseCollection';
  data: Array<UploadFileEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  folder?: InputMaybe<UploadFolderFiltersInput>;
  folderPath?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileInput = {
  alternativeText?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Scalars['String']['input']>;
  ext?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['ID']['input']>;
  folderPath?: InputMaybe<Scalars['String']['input']>;
  formats?: InputMaybe<Scalars['JSON']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  mime?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  previewUrl?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_metadata?: InputMaybe<Scalars['JSON']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFileRelationResponseCollection = {
  __typename?: 'UploadFileRelationResponseCollection';
  data: Array<UploadFileEntity>;
};

export type UploadFolder = {
  __typename?: 'UploadFolder';
  children?: Maybe<UploadFolderRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  files?: Maybe<UploadFileRelationResponseCollection>;
  name: Scalars['String']['output'];
  parent?: Maybe<UploadFolderEntityResponse>;
  path: Scalars['String']['output'];
  pathId: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type UploadFolderChildrenArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UploadFolderFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UploadFolderEntity = {
  __typename?: 'UploadFolderEntity';
  attributes?: Maybe<UploadFolder>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UploadFolderEntityResponse = {
  __typename?: 'UploadFolderEntityResponse';
  data?: Maybe<UploadFolderEntity>;
};

export type UploadFolderEntityResponseCollection = {
  __typename?: 'UploadFolderEntityResponseCollection';
  data: Array<UploadFolderEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFolderFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  children?: InputMaybe<UploadFolderFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  files?: InputMaybe<UploadFileFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFolderFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  parent?: InputMaybe<UploadFolderFiltersInput>;
  path?: InputMaybe<StringFilterInput>;
  pathId?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UploadFolderInput = {
  children?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  pathId?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadFolderRelationResponseCollection = {
  __typename?: 'UploadFolderRelationResponseCollection';
  data: Array<UploadFolderEntity>;
};

export type UsersPermissionsCreateRolePayload = {
  __typename?: 'UsersPermissionsCreateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsDeleteRolePayload = {
  __typename?: 'UsersPermissionsDeleteRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String']['input'];
  password: Scalars['String']['input'];
  provider?: Scalars['String']['input'];
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']['output']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type UsersPermissionsPasswordPayload = {
  __typename?: 'UsersPermissionsPasswordPayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  action: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UsersPermissionsPermissionEntity = {
  __typename?: 'UsersPermissionsPermissionEntity';
  attributes?: Maybe<UsersPermissionsPermission>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: 'UsersPermissionsPermissionRelationResponseCollection';
  data: Array<UsersPermissionsPermissionEntity>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};


export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UsersPermissionsRoleEntity = {
  __typename?: 'UsersPermissionsRoleEntity';
  attributes?: Maybe<UsersPermissionsRole>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsRoleEntityResponse = {
  __typename?: 'UsersPermissionsRoleEntityResponse';
  data?: Maybe<UsersPermissionsRoleEntity>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: 'UsersPermissionsRoleEntityResponseCollection';
  data: Array<UsersPermissionsRoleEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  __typename?: 'UsersPermissionsUpdateRolePayload';
  ok: Scalars['Boolean']['output'];
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  blocked?: Maybe<Scalars['Boolean']['output']>;
  confirmed?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UsersPermissionsUserEntity = {
  __typename?: 'UsersPermissionsUserEntity';
  attributes?: Maybe<UsersPermissionsUser>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: 'UsersPermissionsUserEntityResponse';
  data?: Maybe<UsersPermissionsUserEntity>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: 'UsersPermissionsUserEntityResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmationToken?: InputMaybe<StringFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  confirmationToken?: InputMaybe<Scalars['String']['input']>;
  confirmed?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  resetPasswordToken?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: 'UsersPermissionsUserRelationResponseCollection';
  data: Array<UsersPermissionsUserEntity>;
};

export type FetchHomeSearchQueryVariables = Exact<{
  searchKey?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FetchHomeSearchQuery = { __typename?: 'Query', places?: { __typename?: 'PlaceEntityResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', id?: string | null, attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null, categories?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null } | null } | null } | null } | null } | null } | null } | null }> } | null };

export type FetchActPolicyQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchActPolicyQuery = { __typename?: 'Query', actPolicyAndScheme?: { __typename?: 'ActPolicyAndSchemeEntityResponse', data?: { __typename?: 'ActPolicyAndSchemeEntity', attributes?: { __typename?: 'ActPolicyAndScheme', content?: Array<
          | { __typename: 'ComponentCommonPolicyCard', id: string, title?: string | null, content?: Array<{ __typename?: 'ComponentCommonPermissions', id: string, title?: string | null, link?: string | null } | null> | null }
          | { __typename: 'ComponentFilmistanBanner', id: string, bannerTitle?: string | null, bannerDetails?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchActivityQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchActivityQuery = { __typename?: 'Query', topActivities?: { __typename?: 'TopActivityEntityResponseCollection', data: Array<{ __typename?: 'TopActivityEntity', attributes?: { __typename?: 'TopActivity', activities?: { __typename?: 'ActivityRelationResponseCollection', data: Array<{ __typename?: 'ActivityEntity', attributes?: { __typename?: 'Activity', name: string, description?: string | null, link?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, description?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null } | null } | null } | null }> } | null };

export type FetchAdventureQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchAdventureQuery = { __typename?: 'Query', adventureListBanner?: { __typename?: 'AdventureListBannerEntityResponse', data?: { __typename?: 'AdventureListBannerEntity', attributes?: { __typename?: 'AdventureListBanner', banner?: { __typename?: 'ComponentCommonBanner', title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null } | null } | null } | null, adventures?: { __typename?: 'AdventureEntityResponseCollection', data: Array<{ __typename?: 'AdventureEntity', attributes?: { __typename?: 'Adventure', name?: string | null, details?: string | null, popularity?: any | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null } | null }> } | null };

export type FetchBestTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchBestTimeQuery = { __typename?: 'Query', bestTime?: { __typename?: 'BestTimeEntityResponse', data?: { __typename?: 'BestTimeEntity', attributes?: { __typename?: 'BestTime', header?: string | null, content?: Array<
          | { __typename: 'ComponentBestTimeBestTimeDetails', id: string, description?: string | null, align?: Enum_Componentbesttimebesttimedetails_Align | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentBestTimeWeatherCondition', id: string, header?: string | null, content?: Array<{ __typename?: 'ComponentCommonCard', id: string, title?: string | null, location?: string | null, temperature?: string | null, weather?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchCategoriesCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCategoriesCountsQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null }, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null }> } | null } | null }> } | null };

export type FetchCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCategoryListQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null } | null }> } | null };

export type FetchCityDetailsQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchCityDetailsQuery = { __typename?: 'Query', cityDetails?: { __typename?: 'CityDetailEntityResponseCollection', data: Array<{ __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, nickname?: string | null, description?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, bookable?: boolean | null, description?: string | null, categories?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null }> } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                            | { __typename: 'ComponentPlaceDetail3DVideo' }
                            | { __typename: 'ComponentPlaceDetailDescription' }
                            | { __typename: 'ComponentPlaceDetailDynamicprice' }
                            | { __typename: 'ComponentPlaceDetailHeader' }
                            | { __typename: 'ComponentPlaceDetailImages' }
                            | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                            | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                            | { __typename: 'ComponentPlaceDetailPlaceTime' }
                            | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                            | { __typename: 'ComponentPlaceDetailPlaceothers' }
                            | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                            | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                            | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                            | { __typename: 'Error' }
                           | null> | null } | null } | null } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null, festivalsAndFairs?: { __typename?: 'FestivalsAndFairRelationResponseCollection', data: Array<{ __typename?: 'FestivalsAndFairEntity', id?: string | null, attributes?: { __typename?: 'FestivalsAndFair', name?: string | null, details?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null, activities?: { __typename?: 'ActivityRelationResponseCollection', data: Array<{ __typename?: 'ActivityEntity', id?: string | null, attributes?: { __typename?: 'Activity', name: string, description?: string | null, link?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null, howToReachHere?: { __typename?: 'ComponentCommonMap', planeRoute?: string | null, carRoute?: string | null, trainRoute?: string | null, mapImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null } | null } | null } | null, content?: Array<
          | { __typename: 'ComponentCityDetailActivities', id: string, title?: string | null, description?: string | null, icon?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentCityDetailCitiesToVisit', id: string, cities?: Array<{ __typename?: 'ComponentCityDetailCitiesDistance', id: string, distance?: number | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null } | null } | null } | null> | null }
          | { __typename: 'ComponentCityDetailCombine', id: string, highlightedText?: string | null, title?: string | null, description?: string | null, link?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null }
          | { __typename: 'ComponentCityDetailFairs', id: string, title?: string | null, description?: string | null, icon?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentCityDetailHeader', id: string, imageText?: string | null }
          | { __typename: 'ComponentCityDetailHowToReachThere', id: string }
          | { __typename: 'ComponentCityDetailPlaces', id: string, title?: string | null, description?: string | null, icon?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentCityDetailVisit', id: string }
          | { __typename: 'Error' }
         | null> | null } | null }> } | null };

export type FetchContactUsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchContactUsQuery = { __typename?: 'Query', contactUs?: { __typename?: 'ContactUsEntityResponse', data?: { __typename?: 'ContactUsEntity', attributes?: { __typename?: 'ContactUs', content?: Array<
          | { __typename: 'ComponentContactusContactEntry', id: string, header?: string | null, content?: Array<{ __typename?: 'ComponentContactusMaindetails', id: string, title?: string | null, details?: string | null, type?: Enum_Componentcontactusmaindetails_Type | null } | null> | null }
          | { __typename: 'ComponentFilmistanBanner', id: string, bannerTitle?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchDepartmentDataQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchDepartmentDataQuery = { __typename?: 'Query', departments?: { __typename?: 'DepartmentEntityResponseCollection', data: Array<{ __typename?: 'DepartmentEntity', id?: string | null, attributes?: { __typename?: 'Department', Name?: string | null, icon?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                      | { __typename: 'ComponentPlaceDetail3DVideo' }
                      | { __typename: 'ComponentPlaceDetailDescription' }
                      | { __typename: 'ComponentPlaceDetailDynamicprice' }
                      | { __typename: 'ComponentPlaceDetailHeader' }
                      | { __typename: 'ComponentPlaceDetailImages' }
                      | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                      | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                      | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                      | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                      | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                      | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                      | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                      | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                      | { __typename: 'Error' }
                     | null> | null } | null } | null } | null } | null }> } | null } | null }> } | null };

export type FetchDestinationQueryVariables = Exact<{
  pageParam?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  searchKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchDestinationQuery = { __typename?: 'Query', cities?: { __typename?: 'CityEntityResponseCollection', meta: { __typename?: 'ResponseCollectionMeta', pagination: { __typename?: 'Pagination', page: number, pageSize: number, total: number, pageCount: number } }, data: Array<{ __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, popularity: any, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string } | null } | null } | null } | null }> } | null, destination?: { __typename?: 'DestinationEntityResponse', data?: { __typename?: 'DestinationEntity', id?: string | null, attributes?: { __typename?: 'Destination', content?: Array<
          | { __typename: 'ComponentDestinationDestContent', id: string }
          | { __typename: 'ComponentDestinationDestHeader', id: string, title1: string, title2: string, title3: string, image: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } }
          | { __typename?: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchEmployeeCornerQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchEmployeeCornerQuery = { __typename?: 'Query', employeeCorner?: { __typename?: 'EmployeeCornerEntityResponse', data?: { __typename?: 'EmployeeCornerEntity', attributes?: { __typename?: 'EmployeeCorner', content?: Array<
          | { __typename: 'ComponentEmployeeCornerDetails', id: string, content?: Array<{ __typename?: 'ComponentForeignInfo', id: string, description?: string | null, title?: string | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchExhibitDetailQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
  exhibitSlug?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchExhibitDetailQuery = { __typename?: 'Query', placeDetails?: { __typename?: 'PlaceDetailEntityResponseCollection', data: Array<{ __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', content?: Array<
          | { __typename?: 'ComponentPlaceDetail3DVideo' }
          | { __typename?: 'ComponentPlaceDetailDescription' }
          | { __typename?: 'ComponentPlaceDetailDynamicprice' }
          | { __typename?: 'ComponentPlaceDetailHeader' }
          | { __typename?: 'ComponentPlaceDetailImages' }
          | { __typename?: 'ComponentPlaceDetailPlaceAttraction' }
          | { __typename?: 'ComponentPlaceDetailPlaceGallery' }
          | { __typename?: 'ComponentPlaceDetailPlaceTime' }
          | { __typename: 'ComponentPlaceDetailPlaceexhibit', id: string, exhibit?: Array<{ __typename?: 'ComponentPlaceDetailExhibit', name?: string | null, slug?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailContent', title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null, attributes?: { __typename?: 'UploadFile', url: string, alternativeText?: string | null } | null } | null } | null } | null> | null } | null> | null }
          | { __typename?: 'ComponentPlaceDetailPlaceothers' }
          | { __typename?: 'ComponentPlaceDetailPlaceoverview' }
          | { __typename?: 'ComponentPlaceDetailPlacestovisit' }
          | { __typename?: 'ComponentPlaceDetailPlacetickets' }
          | { __typename?: 'Error' }
         | null> | null } | null }> } | null };

export type FetchExploreQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchExploreQuery = { __typename?: 'Query', explore?: { __typename?: 'ExploreEntityResponse', data?: { __typename?: 'ExploreEntity', attributes?: { __typename?: 'Explore', content?: Array<
          | { __typename?: 'ComponentExploreExplore2', content?: Array<{ __typename: 'ComponentExploreExplore1', category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null } | null } | null } | null, cities?: { __typename?: 'CityRelationResponseCollection', data: Array<{ __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string } | null } | null } | null } | null }> } | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null } | null> | null }
          | { __typename?: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchExploreAllArrangeQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchExploreAllArrangeQuery = { __typename?: 'Query', exploreAllArrange?: { __typename?: 'ExploreAllArrangeEntityResponse', data?: { __typename?: 'ExploreAllArrangeEntity', attributes?: { __typename?: 'ExploreAllArrange', explore_alls?: { __typename?: 'ExploreAllRelationResponseCollection', data: Array<{ __typename?: 'ExploreAllEntity', id?: string | null, attributes?: { __typename?: 'ExploreAll', category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null } | null } | null } | null, content?: Array<
                | { __typename: 'ComponentExploreHeaderCity', id: string, cityHeader?: string | null, cities?: { __typename?: 'CityRelationResponseCollection', data: Array<{ __typename?: 'CityEntity', id?: string | null, attributes?: { __typename?: 'City', name: string, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string } | null } | null } | null } | null }> } | null }
                | { __typename: 'ComponentExploreHeaderPlace', id: string, placeHeader?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null }
                | { __typename: 'Error' }
               | null> | null } | null }> } | null } | null } | null } | null };

export type FetchFairsAndFestivalQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type FetchFairsAndFestivalQuery = { __typename?: 'Query', fairsAndFestivalListBanner?: { __typename?: 'FairsAndFestivalListBannerEntityResponse', data?: { __typename?: 'FairsAndFestivalListBannerEntity', attributes?: { __typename?: 'FairsAndFestivalListBanner', banner?: { __typename?: 'ComponentCommonBanner', title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null } | null } | null } | null, festivalsAndFairs?: { __typename?: 'FestivalsAndFairEntityResponseCollection', data: Array<{ __typename?: 'FestivalsAndFairEntity', id?: string | null, attributes?: { __typename?: 'FestivalsAndFair', name?: string | null, details?: string | null, fromDate?: any | null, toDate?: any | null, popularity?: any | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, map?: Array<{ __typename?: 'ComponentCommonMap', planeRoute?: string | null, carRoute?: string | null, trainRoute?: string | null, mapImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null> | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null } | null }> } | null };

export type FetchFilmShootingQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchFilmShootingQuery = { __typename?: 'Query', filmShooting?: { __typename?: 'FilmShootingEntityResponse', data?: { __typename?: 'FilmShootingEntity', attributes?: { __typename?: 'FilmShooting', content?: Array<
          | { __typename: 'ComponentShootingBanner', id: string, header?: string | null, header2?: string | null, detailHeader?: string | null, detail?: string | null, detail2?: string | null }
          | { __typename: 'ComponentShootingPermission', id: string, title?: string | null, description?: string | null, type?: Enum_Componentshootingpermission_Type | null, content?: Array<{ __typename?: 'ComponentCommonPermissions', id: string, title?: string | null, link?: string | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchFilmistanQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchFilmistanQuery = { __typename?: 'Query', films?: { __typename: 'FilmEntityResponseCollection', data: Array<{ __typename?: 'FilmEntity', attributes?: { __typename?: 'Film', title?: string | null, description?: string | null, filmType?: Enum_Film_Filmtype | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> } | null, filmistan?: { __typename?: 'FilmistanEntityResponse', data?: { __typename?: 'FilmistanEntity', id?: string | null, attributes?: { __typename?: 'Filmistan', content?: Array<
          | { __typename: 'ComponentFilmistanBanner', bannerTitle?: string | null, bannerDetails?: string | null, bannerDetails2?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentFilmistanLocation', title?: string | null, cities?: { __typename?: 'CityRelationResponseCollection', data: Array<{ __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string } | null } | null } | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> } | null }
          | { __typename: 'ComponentFilmistanPermissions', title?: string | null, content?: Array<{ __typename?: 'ComponentCommonPolicyCard', title?: string | null, type?: Enum_Componentcommonpolicycard_Type | null, content?: Array<{ __typename?: 'ComponentCommonPermissions', title?: string | null, link?: string | null } | null> | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchForeignTouristQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchForeignTouristQuery = { __typename?: 'Query', foreignTourist?: { __typename?: 'ForeignTouristEntityResponse', data?: { __typename?: 'ForeignTouristEntity', attributes?: { __typename?: 'ForeignTourist', content?: Array<
          | { __typename: 'ComponentFilmistanBanner', id: string, bannerTitle?: string | null, bannerDetails?: string | null, bannerDetails2?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentForeignInfo', id: string, title?: string | null, description?: string | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchHeritagePropertyQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchHeritagePropertyQuery = { __typename?: 'Query', heritageProperty?: { __typename?: 'HeritagePropertyEntityResponse', data?: { __typename?: 'HeritagePropertyEntity', attributes?: { __typename?: 'HeritageProperty', content?: Array<
          | { __typename: 'ComponentCommonBanner', id: string, title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentHeritagePropertyAddEntry', id: string, content?: Array<{ __typename?: 'ComponentCommonCityPlace', id: string, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null, mobile?: string | null, mobile2?: string | null, website?: string | null, locationDetail?: string | null, email?: string | null, description?: string | null, link?: string | null, map?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> } | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchHomeDataQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchHomeDataQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null } | null }> } | null } | null }> } | null, home?: { __typename?: 'HomeEntityResponse', data?: { __typename?: 'HomeEntity', attributes?: { __typename?: 'Home', home?: Array<
          | { __typename: 'ComponentHomeCafeteria', id: string, title?: string | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                                | { __typename: 'ComponentPlaceDetail3DVideo' }
                                | { __typename: 'ComponentPlaceDetailDescription' }
                                | { __typename: 'ComponentPlaceDetailDynamicprice' }
                                | { __typename: 'ComponentPlaceDetailHeader' }
                                | { __typename: 'ComponentPlaceDetailImages' }
                                | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                                | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                                | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                                | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                                | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                                | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'Error' }
                               | null> | null } | null } | null } | null } | null }> } | null } | null } | null } | null }
          | { __typename: 'ComponentHomeDiscoverBeautifulPlace', id: string, title?: string | null, content?: Array<{ __typename?: 'ComponentCommonDiscoverPlaceCard', id: string, description?: string | null, title?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, place?: { __typename?: 'PlaceEntityResponse', data?: { __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null } | null } | null, video?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null> | null }
          | { __typename: 'ComponentHomeDiscoverRealBeauty', id: string, title?: string | null, headerTitle?: string | null, highlightedText?: string | null, description?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentHomeLeader', id: string, title?: string | null, content?: Array<{ __typename?: 'ComponentCommonLeaderCard', id: string, name?: string | null, designation?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null> | null }
          | { __typename: 'ComponentHomeLightAndSoundShow', id: string, title?: string | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                                | { __typename: 'ComponentPlaceDetail3DVideo' }
                                | { __typename: 'ComponentPlaceDetailDescription' }
                                | { __typename: 'ComponentPlaceDetailDynamicprice' }
                                | { __typename: 'ComponentPlaceDetailHeader' }
                                | { __typename: 'ComponentPlaceDetailImages' }
                                | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                                | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                                | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                                | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                                | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                                | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'Error' }
                               | null> | null } | null } | null } | null } | null }> } | null } | null } | null } | null }
          | { __typename: 'ComponentHomeMonuments', id: string, title?: string | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                                | { __typename: 'ComponentPlaceDetail3DVideo' }
                                | { __typename: 'ComponentPlaceDetailDescription' }
                                | { __typename: 'ComponentPlaceDetailDynamicprice' }
                                | { __typename: 'ComponentPlaceDetailHeader' }
                                | { __typename: 'ComponentPlaceDetailImages' }
                                | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                                | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                                | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                                | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                                | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                                | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'Error' }
                               | null> | null } | null } | null } | null } | null }> } | null } | null } | null } | null }
          | { __typename: 'ComponentHomeMuseum', id: string, title?: string | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                                | { __typename: 'ComponentPlaceDetail3DVideo' }
                                | { __typename: 'ComponentPlaceDetailDescription' }
                                | { __typename: 'ComponentPlaceDetailDynamicprice' }
                                | { __typename: 'ComponentPlaceDetailHeader' }
                                | { __typename: 'ComponentPlaceDetailImages' }
                                | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                                | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                                | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                                | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                                | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                                | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'Error' }
                               | null> | null } | null } | null } | null } | null }> } | null } | null } | null } | null }
          | { __typename: 'ComponentHomeParks', id: string, title?: string | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                                | { __typename: 'ComponentPlaceDetail3DVideo' }
                                | { __typename: 'ComponentPlaceDetailDescription' }
                                | { __typename: 'ComponentPlaceDetailDynamicprice' }
                                | { __typename: 'ComponentPlaceDetailHeader' }
                                | { __typename: 'ComponentPlaceDetailImages' }
                                | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                                | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                                | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                                | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                                | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                                | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'Error' }
                               | null> | null } | null } | null } | null } | null }> } | null } | null } | null } | null }
          | { __typename: 'ComponentHomePlaces', id: string, Name: string, Category?: Array<{ __typename?: 'ComponentCommonCategoryPlace', id: string, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', id?: string | null } | null } } | null } | null } | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                            | { __typename: 'ComponentPlaceDetail3DVideo' }
                            | { __typename: 'ComponentPlaceDetailDescription' }
                            | { __typename: 'ComponentPlaceDetailDynamicprice' }
                            | { __typename: 'ComponentPlaceDetailHeader' }
                            | { __typename: 'ComponentPlaceDetailImages' }
                            | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                            | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                            | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                            | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                            | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                            | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                            | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                            | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                            | { __typename: 'Error' }
                           | null> | null } | null } | null } | null } | null }> } | null } | null> | null }
          | { __typename: 'ComponentHomeSlider', id: string, Title?: string | null, highlightedText?: string | null, video?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, card?: Array<{ __typename?: 'ComponentCommonSliderCard', slideTitle: string, slideDescription: string, image: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null> | null }
          | { __typename: 'ComponentHomeVenue' }
          | { __typename: 'ComponentHomeWildLife', id: string, title?: string | null, category?: { __typename?: 'CategoryEntityResponse', data?: { __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string, content?: Array<
                                | { __typename: 'ComponentPlaceDetail3DVideo' }
                                | { __typename: 'ComponentPlaceDetailDescription' }
                                | { __typename: 'ComponentPlaceDetailDynamicprice' }
                                | { __typename: 'ComponentPlaceDetailHeader' }
                                | { __typename: 'ComponentPlaceDetailImages' }
                                | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
                                | { __typename: 'ComponentPlaceDetailPlaceGallery' }
                                | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceexhibit' }
                                | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'ComponentPlaceDetailPlaceoverview' }
                                | { __typename: 'ComponentPlaceDetailPlacestovisit' }
                                | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
                                | { __typename: 'Error' }
                               | null> | null } | null } | null } | null } | null }> } | null } | null } | null } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchHowToGetThereQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchHowToGetThereQuery = { __typename?: 'Query', howToGetThere?: { __typename?: 'HowToGetThereEntityResponse', data?: { __typename?: 'HowToGetThereEntity', attributes?: { __typename?: 'HowToGetThere', title: string, content?: Array<
          | { __typename: 'ComponentCommonHowToGetThere', id: string, title: string, description?: string | null, align?: Enum_Componentcommonhowtogetthere_Align | null, bookLink: string, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename?: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchIhmsfcisQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchIhmsfcisQuery = { __typename?: 'Query', ihmsAndFci?: { __typename?: 'IhmsAndFciEntityResponse', data?: { __typename?: 'IhmsAndFciEntity', attributes?: { __typename?: 'IhmsAndFci', content?: Array<
          | { __typename: 'ComponentCommonPermissions', id: string, title?: string | null, link?: string | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchItineriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchItineriesQuery = { __typename?: 'Query', suggestedItinerie?: { __typename?: 'SuggestedItinerieEntityResponse', data?: { __typename?: 'SuggestedItinerieEntity', attributes?: { __typename?: 'SuggestedItinerie', content?: Array<
          | { __typename: 'ComponentCommonBanner', title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentSuggestedItineriesItinerary', titile?: string | null, cityItinerary?: Array<{ __typename?: 'ComponentSuggestedItineriesItineraryDetails', details?: string | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type LuxuryOnWheelQueryVariables = Exact<{ [key: string]: never; }>;


export type LuxuryOnWheelQuery = { __typename?: 'Query', luxuryOnWheel?: { __typename?: 'LuxuryOnWheelEntityResponse', data?: { __typename?: 'LuxuryOnWheelEntity', attributes?: { __typename?: 'LuxuryOnWheel', content?: Array<
          | { __typename: 'ComponentCommonBanner', id: string, title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentLuxuryOnWheels', id: string, title?: string | null, description?: string | null, link?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchLuxuryOnWheelsDetailQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchLuxuryOnWheelsDetailQuery = { __typename?: 'Query', luxuryOnWheelsDetail?: { __typename?: 'LuxuryOnWheelsDetailEntityResponse', data?: { __typename?: 'LuxuryOnWheelsDetailEntity', attributes?: { __typename?: 'LuxuryOnWheelsDetail', wheels?: Array<{ __typename?: 'ComponentLuxuryOnWheelDetail', wheels?: { __typename?: 'ComponentLuxuryOnWheels', title?: string | null, title2?: string | null, description?: string | null, link?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null, facilities?: { __typename?: 'ComponentLuxuryFacilities', Title?: string | null, Details?: string | null } | null } | null> | null } | null } | null } | null };

export type FetchMapViewQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMapViewQuery = { __typename?: 'Query', placeDetails?: { __typename?: 'PlaceDetailEntityResponseCollection', data: Array<{ __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', place?: { __typename?: 'PlaceEntityResponse', data?: { __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, description?: string | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null } | null } | null, content?: Array<
          | { __typename: 'ComponentPlaceDetail3DVideo', id: string, threeDvideo?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentPlaceDetailDescription', id: string, title?: string | null }
          | { __typename: 'ComponentPlaceDetailDynamicprice', id: string }
          | { __typename: 'ComponentPlaceDetailHeader', id: string }
          | { __typename: 'ComponentPlaceDetailImages', id: string }
          | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
          | { __typename: 'ComponentPlaceDetailPlaceGallery', id: string, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentPlaceDetailPlaceTime' }
          | { __typename: 'ComponentPlaceDetailPlaceexhibit', id: string, exhibit?: Array<{ __typename?: 'ComponentPlaceDetailExhibit', name?: string | null, slug?: string | null } | null> | null }
          | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null }
          | { __typename: 'ComponentPlaceDetailPlaceoverview', id: string, overview?: { __typename?: 'ComponentPlaceDetailOverview', description?: string | null, lat?: number | null, long?: number | null, address?: string | null } | null }
          | { __typename: 'ComponentPlaceDetailPlacestovisit', title?: string | null, description?: string | null, id: string, icon?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null }
          | { __typename: 'Error' }
         | null> | null } | null }> } | null, places?: { __typename?: 'PlaceEntityResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, subCategory?: Enum_Place_Subcategory | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', id?: string | null, attributes?: { __typename?: 'City', name: string, nickname?: string | null, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string } | null } | null } | null } | null } | null } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null, categories?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null }> } | null } | null }> } | null };

export type FetchMediaQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMediaQuery = { __typename?: 'Query', events?: { __typename?: 'EventEntityResponseCollection', data: Array<{ __typename?: 'EventEntity', attributes?: { __typename?: 'Event', title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> } | null, galleries?: { __typename?: 'GalleryEntityResponseCollection', data: Array<{ __typename?: 'GalleryEntity', attributes?: { __typename?: 'Gallery', title?: string | null, align?: Enum_Gallery_Align | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> } | null, allMedia?: { __typename?: 'AllMediaEntityResponse', data?: { __typename?: 'AllMediaEntity', attributes?: { __typename?: 'AllMedia', content?: Array<
          | { __typename: 'ComponentCommonPolicyCard', id: string, title?: string | null, type?: Enum_Componentcommonpolicycard_Type | null, content?: Array<{ __typename?: 'ComponentCommonPermissions', id: string, title?: string | null, link?: string | null } | null> | null }
          | { __typename: 'ComponentFilmistanBanner', id: string, bannerTitle?: string | null, bannerDetails?: string | null, bannerDetails2?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentHomeDiscoverBeautifulPlace', id: string, title?: string | null, content?: Array<{ __typename?: 'ComponentCommonDiscoverPlaceCard', id: string, description?: string | null, place?: { __typename?: 'PlaceEntityResponse', data?: { __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null } | null } | null, video?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null> | null }
          | { __typename: 'ComponentMediaEvents' }
          | { __typename: 'ComponentMediaGallery' }
          | { __typename: 'ComponentMediaPrintAds', id: string, title?: string | null, print_ads?: { __typename?: 'PrintAdRelationResponseCollection', data: Array<{ __typename?: 'PrintAdEntity', attributes?: { __typename?: 'PrintAd', title?: string | null, pdf?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> } | null }
          | { __typename: 'ComponentMediaVideo', id: string, title?: string | null, description?: string | null, mainContent?: Array<{ __typename?: 'ComponentCommonVideoCard', id: string, thumbnail?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, video: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchMoreActivityQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMoreActivityQuery = { __typename?: 'Query', moreActivity?: { __typename?: 'MoreActivityEntityResponse', data?: { __typename?: 'MoreActivityEntity', attributes?: { __typename?: 'MoreActivity', activity?: Array<{ __typename?: 'ComponentMoreActivityMoreActivity', name?: string | null, link?: string | null } | null> | null } | null } | null } | null };

export type FetchOtherQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOtherQuery = { __typename?: 'Query', other?: { __typename?: 'OtherEntityResponse', data?: { __typename?: 'OtherEntity', attributes?: { __typename?: 'Other', content?: Array<{ __typename?: 'ComponentCommonPermissions', id: string, title?: string | null, link?: string | null } | null> | null } | null } | null } | null };

export type FetchPackageQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchPackageQuery = { __typename?: 'Query', allPackage?: { __typename?: 'AllPackageEntityResponse', data?: { __typename?: 'AllPackageEntity', attributes?: { __typename?: 'AllPackage', content?: Array<
          | { __typename: 'ComponentFilmistanBanner', id: string, bannerTitle?: string | null, bannerDetails?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentPackagePackage', id: string, title?: string | null, totalPackage?: string | null, description?: string | null, packages?: { __typename: 'PackageRelationResponseCollection', data: Array<{ __typename?: 'PackageEntity', attributes?: { __typename?: 'Package', name?: string | null, link?: string | null, description?: string | null, rating?: string | null, popularity: any, price?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, url: string } | null } | null } | null, package_detail?: { __typename?: 'PackageDetailEntityResponse', data?: { __typename?: 'PackageDetailEntity', attributes?: { __typename?: 'PackageDetail', slug?: string | null } | null } | null } | null } | null }> } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchPackageDetailQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchPackageDetailQuery = { __typename?: 'Query', packageDetails?: { __typename?: 'PackageDetailEntityResponseCollection', data: Array<{ __typename?: 'PackageDetailEntity', id?: string | null, attributes?: { __typename?: 'PackageDetail', name?: string | null, days?: string | null, description?: string | null, bookable?: boolean | null, overview?: string | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, places?: { __typename?: 'ComponentPackagePackagePlaces', title?: string | null, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null, description?: string | null, rating?: string | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, categories?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null }> } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null } | null }> } | null } | null } | null }> } | null };

export type FetchPlaceDetailsQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchPlaceDetailsQuery = { __typename?: 'Query', placeDetails?: { __typename?: 'PlaceDetailEntityResponseCollection', data: Array<{ __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', place?: { __typename?: 'PlaceEntityResponse', data?: { __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, link?: string | null, bookable?: boolean | null, description?: string | null, categories?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', Name?: string | null, icon: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null }> } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string, places?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', id?: string | null, attributes?: { __typename?: 'Place', name?: string | null, description?: string | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null, cityDetail?: { __typename?: 'CityDetailEntityResponse', data?: { __typename?: 'CityDetailEntity', attributes?: { __typename?: 'CityDetail', slug: string } | null } | null } | null } | null } | null } | null } | null } | null } | null, content?: Array<
          | { __typename: 'ComponentPlaceDetail3DVideo', id: string, threeDvideo?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentPlaceDetailDescription', id: string, title?: string | null }
          | { __typename: 'ComponentPlaceDetailDynamicprice', id: string, cats?: Array<{ __typename?: 'ComponentPlaceDetailDpCat', name: string, title?: string | null, places?: Array<{ __typename?: 'ComponentPlaceDetailDynamicpricePlace', name: string, priceType?: string | null, remark?: string | null, prices?: Array<{ __typename?: 'ComponentPlaceDetailDynamicpricePrice', title: string, price?: string | null, note?: string | null } | null> | null } | null> | null } | null> | null }
          | { __typename: 'ComponentPlaceDetailHeader', id: string }
          | { __typename: 'ComponentPlaceDetailImages', id: string }
          | { __typename: 'ComponentPlaceDetailPlaceAttraction' }
          | { __typename: 'ComponentPlaceDetailPlaceGallery', id: string, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentPlaceDetailPlaceTime', id: string, tabName: string, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
          | { __typename: 'ComponentPlaceDetailPlaceexhibit', id: string, exhibit?: Array<{ __typename?: 'ComponentPlaceDetailExhibit', name?: string | null, slug?: string | null } | null> | null }
          | { __typename: 'ComponentPlaceDetailPlaceothers', id: string, title1?: string | null, title2?: string | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
          | { __typename: 'ComponentPlaceDetailPlaceoverview', id: string, overview?: { __typename?: 'ComponentPlaceDetailOverview', description?: string | null, lat?: number | null, long?: number | null, address?: string | null, shareableText?: string | null } | null }
          | { __typename: 'ComponentPlaceDetailPlacestovisit', title?: string | null, description?: string | null, id: string, icon?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'ComponentPlaceDetailPlacetickets', id: string, title1?: string | null, title2?: string | null, information?: Array<{ __typename?: 'ComponentPlaceDetailInformation', title?: string | null, description?: string | null } | null> | null, card?: Array<{ __typename?: 'ComponentPlaceDetailTickets', title?: string | null, content?: Array<{ __typename?: 'ComponentPlaceDetailTicketfair', name?: string | null, value?: string | null } | null> | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null, categories?: Array<{ __typename?: 'ComponentPlaceDetailCategory', name: string, title?: string | null, description?: string | null, places?: Array<{ __typename?: 'ComponentPlaceDetailPlace', name: string, description?: string | null, gallery?: Array<{ __typename?: 'ComponentPlaceDetailGalleryImage', image: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } } | null> | null } | null> | null } | null> | null } | null }> } | null };

export type FetchPlanTripQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchPlanTripQuery = { __typename?: 'Query', planTrip?: { __typename?: 'PlanTripEntityResponse', data?: { __typename?: 'PlanTripEntity', attributes?: { __typename?: 'PlanTrip', trip?: Array<{ __typename?: 'ComponentPlanTripPlanTrip', title?: string | null, link?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null> | null } | null } | null } | null };

export type FetchSuggestediternariesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchSuggestediternariesQuery = { __typename?: 'Query', suggestedItinerie?: { __typename?: 'SuggestedItinerieEntityResponse', data?: { __typename?: 'SuggestedItinerieEntity', attributes?: { __typename?: 'SuggestedItinerie', title?: string | null, content?: Array<
          | { __typename: 'ComponentCommonBanner', id: string, title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentSuggestedItineriesItinerary', id: string, titile?: string | null, cityItinerary?: Array<{ __typename?: 'ComponentSuggestedItineriesItineraryDetails', details?: string | null, title?: string | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchTopPackageQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchTopPackageQuery = { __typename?: 'Query', topPackage?: { __typename: 'TopPackageEntityResponse', data?: { __typename?: 'TopPackageEntity', id?: string | null, attributes?: { __typename?: 'TopPackage', package?: Array<{ __typename?: 'ComponentTopPackagesTopPackages', package?: { __typename?: 'PackageEntityResponse', data?: { __typename?: 'PackageEntity', attributes?: { __typename?: 'Package', link?: string | null, name?: string | null, price?: string | null, rating?: string | null, description?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, package_detail?: { __typename?: 'PackageDetailEntityResponse', data?: { __typename?: 'PackageDetailEntity', id?: string | null, attributes?: { __typename?: 'PackageDetail', slug?: string | null, days?: string | null, bookable?: boolean | null } | null } | null } | null } | null } | null } | null } | null> | null } | null } | null } | null };

export type FetchTouristAttractionQueryVariables = Exact<{
  pageParam?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  searchKey?: InputMaybe<Scalars['String']['input']>;
  cityName?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchTouristAttractionQuery = { __typename?: 'Query', places?: { __typename?: 'PlaceEntityResponseCollection', meta: { __typename?: 'ResponseCollectionMeta', pagination: { __typename?: 'Pagination', page: number, pageSize: number, total: number, pageCount: number } }, data: Array<{ __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', popularity: any, name?: string | null, bookable?: boolean | null, city?: { __typename?: 'CityEntityResponse', data?: { __typename?: 'CityEntity', attributes?: { __typename?: 'City', name: string } | null } | null } | null, categories?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', id?: string | null, attributes?: { __typename?: 'Category', Name?: string | null } | null }> } | null, images?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, placeDetail?: { __typename?: 'PlaceDetailEntityResponse', data?: { __typename?: 'PlaceDetailEntity', attributes?: { __typename?: 'PlaceDetail', slug: string } | null } | null } | null } | null }> } | null, seeAllPlace?: { __typename?: 'SeeAllPlaceEntityResponse', data?: { __typename?: 'SeeAllPlaceEntity', id?: string | null, attributes?: { __typename?: 'SeeAllPlace', content?: Array<
          | { __typename: 'ComponentPlacePlaceContent', Title?: string | null }
          | { __typename: 'ComponentPlacePlaceHeader', id: string, title1?: string | null, title2?: string | null, title3?: string | null, image?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchTravelAgencyQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchTravelAgencyQuery = { __typename?: 'Query', registrationForTravelAgency?: { __typename?: 'RegistrationForTravelAgencyEntityResponse', data?: { __typename?: 'RegistrationForTravelAgencyEntity', attributes?: { __typename?: 'RegistrationForTravelAgency', content?: Array<
          | { __typename: 'ComponentCommonPolicyCard', id: string, title?: string | null, type?: Enum_Componentcommonpolicycard_Type | null, content?: Array<{ __typename?: 'ComponentCommonPermissions', id: string, title?: string | null, link?: string | null } | null> | null }
          | { __typename: 'ComponentTravelAgencyBanner', id: string, bannerTitle?: string | null, bannerDetail?: string | null, bannerDetail2?: string | null, bannerImage?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchTravelDairyQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchTravelDairyQuery = { __typename?: 'Query', travelDairy?: { __typename?: 'TravelDairyEntityResponse', data?: { __typename?: 'TravelDairyEntity', attributes?: { __typename?: 'TravelDairy', content?: Array<
          | { __typename: 'ComponentCommonBanner', id: string, title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentDairyBlogs', id: string, title?: string | null, description?: string | null, Info?: Array<{ __typename?: 'ComponentDairyInfo', name?: string | null, date?: any | null, link?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null, locations?: { __typename?: 'PlaceRelationResponseCollection', data: Array<{ __typename?: 'PlaceEntity', attributes?: { __typename?: 'Place', name?: string | null } | null }> } | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type TravelDeskQueryVariables = Exact<{ [key: string]: never; }>;


export type TravelDeskQuery = { __typename?: 'Query', travelDesk?: { __typename?: 'TravelDeskEntityResponse', data?: { __typename?: 'TravelDeskEntity', attributes?: { __typename?: 'TravelDesk', banner?: Array<
          | { __typename: 'ComponentCommonBanner', id: string, title?: string | null, description?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null }
          | { __typename: 'ComponentTravelDeskContent', id: string, desk?: Array<{ __typename?: 'ComponentTravelDeskDesk', name?: string | null, link?: string | null } | null> | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type TravelGuideQueryVariables = Exact<{ [key: string]: never; }>;


export type TravelGuideQuery = { __typename?: 'Query', rajasthanTravelGuide?: { __typename?: 'RajasthanTravelGuideEntityResponse', data?: { __typename?: 'RajasthanTravelGuideEntity', attributes?: { __typename?: 'RajasthanTravelGuide', title_1?: string | null, title_2?: string | null, description?: string | null, content?: Array<
          | { __typename: 'ComponentGuideTravelGuide', travel_guides?: { __typename?: 'TravelGuideRelationResponseCollection', data: Array<{ __typename?: 'TravelGuideEntity', attributes?: { __typename?: 'TravelGuide', title?: string | null, description?: string | null, link?: string | null, image?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null }> } | null } | null }> } | null }
          | { __typename: 'Error' }
         | null> | null } | null } | null } | null };

export type FetchUpcomingEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchUpcomingEventsQuery = { __typename?: 'Query', upcomingEvents?: { __typename?: 'UpcomingEventEntityResponseCollection', data: Array<{ __typename?: 'UpcomingEventEntity', id?: string | null, attributes?: { __typename?: 'UpcomingEvent', eventTitle: string, sectionName: string, organizedBy?: string | null, eventStartDate?: any | null, eventEndDate?: any | null, eventTime?: string | null, eventType?: string | null, isFeatured: boolean, eventPhoto: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } } | null }> } | null };


export const FetchHomeSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchHomeSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"999"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"city"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}}}]}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchHomeSearchQuery, FetchHomeSearchQueryVariables>;
export const FetchActPolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchActPolicy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actPolicyAndScheme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonPolicyCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchActPolicyQuery, FetchActPolicyQueryVariables>;
export const FetchActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchActivityQuery, FetchActivityQueryVariables>;
export const FetchAdventureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchAdventure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adventureListBanner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"adventures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchAdventureQuery, FetchAdventureQueryVariables>;
export const FetchBestTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchBestTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bestTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentBestTimeBestTimeDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentBestTimeWeatherCondition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"weather"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchBestTimeQuery, FetchBestTimeQueryVariables>;
export const FetchCategoriesCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchCategoriesCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchCategoriesCountsQuery, FetchCategoriesCountsQueryVariables>;
export const FetchCategoryListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchCategoryList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchCategoryListQuery, FetchCategoryListQueryVariables>;
export const FetchCityDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchCityDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cityDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"festivalsAndFairs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"howToReachHere"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mapImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"planeRoute"}},{"kind":"Field","name":{"kind":"Name","value":"carRoute"}},{"kind":"Field","name":{"kind":"Name","value":"trainRoute"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailHeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageText"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailPlaces"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailFairs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailActivities"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailCombine"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"highlightedText"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailHowToReachThere"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailVisit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCityDetailCitiesToVisit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchCityDetailsQuery, FetchCityDetailsQueryVariables>;
export const FetchContactUsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchContactUs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactUs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentContactusContactEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchContactUsQuery, FetchContactUsQueryVariables>;
export const FetchDepartmentDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchDepartmentData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"departments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchDepartmentDataQuery, FetchDepartmentDataQueryVariables>;
export const FetchDestinationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchDestination"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageParam"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"50"}},{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageParam"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"containsi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"destination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentDestinationDestHeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"title3"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentDestinationDestContent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchDestinationQuery, FetchDestinationQueryVariables>;
export const FetchEmployeeCornerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchEmployeeCorner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employeeCorner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentEmployeeCornerDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchEmployeeCornerQuery, FetchEmployeeCornerQueryVariables>;
export const FetchExhibitDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchExhibitDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exhibitSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceexhibit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exhibit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exhibitSlug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alternativeText"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchExhibitDetailQuery, FetchExhibitDetailQueryVariables>;
export const FetchExploreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchExplore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"explore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentExploreExplore2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchExploreQuery, FetchExploreQueryVariables>;
export const FetchExploreAllArrangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchExploreAllArrange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exploreAllArrange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"explore_alls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentExploreHeaderCity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cityHeader"}},{"kind":"Field","name":{"kind":"Name","value":"cities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentExploreHeaderPlace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"placeHeader"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchExploreAllArrangeQuery, FetchExploreAllArrangeQueryVariables>;
export const FetchFairsAndFestivalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchFairsAndFestival"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fairsAndFestivalListBanner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"festivalsAndFairs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"fromDate"}},{"kind":"Field","name":{"kind":"Name","value":"toDate"}},{"kind":"Field","name":{"kind":"Name","value":"map"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planeRoute"}},{"kind":"Field","name":{"kind":"Name","value":"carRoute"}},{"kind":"Field","name":{"kind":"Name","value":"trainRoute"}},{"kind":"Field","name":{"kind":"Name","value":"mapImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchFairsAndFestivalQuery, FetchFairsAndFestivalQueryVariables>;
export const FetchFilmShootingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchFilmShooting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filmShooting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentShootingBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"header2"}},{"kind":"Field","name":{"kind":"Name","value":"detailHeader"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"detail2"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentShootingPermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchFilmShootingQuery, FetchFilmShootingQueryVariables>;
export const FetchFilmistanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchFilmistan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"films"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"filmType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"filmistan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails2"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanPermissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchFilmistanQuery, FetchFilmistanQueryVariables>;
export const FetchForeignTouristDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchForeignTourist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"foreignTourist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails2"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentForeignInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchForeignTouristQuery, FetchForeignTouristQueryVariables>;
export const FetchHeritagePropertyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchHeritageProperty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heritageProperty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHeritagePropertyAddEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"mobile2"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"locationDetail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"map"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchHeritagePropertyQuery, FetchHeritagePropertyQueryVariables>;
export const FetchHomeDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchHomeData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"home"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"home"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeSlider"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Title"}},{"kind":"Field","name":{"kind":"Name","value":"highlightedText"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slideTitle"}},{"kind":"Field","name":{"kind":"Name","value":"slideDescription"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeDiscoverRealBeauty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"headerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"highlightedText"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomePlaces"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeDiscoverBeautifulPlace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeWildLife"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeMonuments"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeLeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"designation"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeCafeteria"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeMuseum"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeLightAndSoundShow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeParks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"10"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchHomeDataQuery, FetchHomeDataQueryVariables>;
export const FetchHowToGetThereDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchHowToGetThere"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"howToGetThere"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonHowToGetThere"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"bookLink"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchHowToGetThereQuery, FetchHowToGetThereQueryVariables>;
export const FetchIhmsfcisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchIHMSFCIS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ihmsAndFci"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonPermissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchIhmsfcisQuery, FetchIhmsfcisQueryVariables>;
export const FetchItineriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchItineries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suggestedItinerie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentSuggestedItineriesItinerary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"titile"}},{"kind":"Field","name":{"kind":"Name","value":"cityItinerary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"details"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchItineriesQuery, FetchItineriesQueryVariables>;
export const LuxuryOnWheelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LuxuryOnWheel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"luxuryOnWheel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentLuxuryOnWheels"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<LuxuryOnWheelQuery, LuxuryOnWheelQueryVariables>;
export const FetchLuxuryOnWheelsDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchLuxuryOnWheelsDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"luxuryOnWheelsDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wheels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wheels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Title"}},{"kind":"Field","name":{"kind":"Name","value":"Details"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchLuxuryOnWheelsDetailQuery, FetchLuxuryOnWheelsDetailQueryVariables>;
export const FetchMapViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchMapView"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailHeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailImages"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailDescription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceoverview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"long"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceexhibit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exhibit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacestovisit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceGallery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetail3DVideo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threeDvideo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailDynamicprice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subCategory"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchMapViewQuery, FetchMapViewQueryVariables>;
export const FetchMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"galleries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"align"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails2"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentMediaVideo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","alias":{"kind":"Name","value":"mainContent"},"name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentMediaPrintAds"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"print_ads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonPolicyCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentHomeDiscoverBeautifulPlace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchMediaQuery, FetchMediaQueryVariables>;
export const FetchMoreActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchMoreActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moreActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchMoreActivityQuery, FetchMoreActivityQueryVariables>;
export const FetchOtherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchOther"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"other"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchOtherQuery, FetchOtherQueryVariables>;
export const FetchPackageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchPackage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPackage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentFilmistanBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetails"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPackagePackage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"totalPackage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"packages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"package_detail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchPackageQuery, FetchPackageQueryVariables>;
export const FetchPackageDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchPackageDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packageDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchPackageDetailQuery, FetchPackageDetailQueryVariables>;
export const FetchPlaceDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchPlaceDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cityDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailHeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailImages"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailDescription"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceoverview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"long"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"shareableText"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacetickets"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceothers"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tabName"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceexhibit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exhibit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"999"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlacestovisit"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailPlaceGallery"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetail3DVideo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"threeDvideo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlaceDetailDynamicprice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceType"}},{"kind":"Field","name":{"kind":"Name","value":"remark"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"places"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"gallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchPlaceDetailsQuery, FetchPlaceDetailsQueryVariables>;
export const FetchPlanTripDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchPlanTrip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planTrip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trip"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchPlanTripQuery, FetchPlanTripQueryVariables>;
export const FetchSuggestediternariesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchSuggestediternaries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suggestedItinerie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentSuggestedItineriesItinerary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"titile"}},{"kind":"Field","name":{"kind":"Name","value":"cityItinerary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchSuggestediternariesQuery, FetchSuggestediternariesQueryVariables>;
export const FetchTopPackageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchTopPackage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPackage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"package"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"package"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"package_detail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchTopPackageQuery, FetchTopPackageQueryVariables>;
export const FetchTouristAttractionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchTouristAttraction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageParam"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cityName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"places"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"categories"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"containsi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchKey"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"city"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"containsi"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cityName"}}}]}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"40"}},{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageParam"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"placeDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"seeAllPlace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlacePlaceContent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentPlacePlaceHeader"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title1"}},{"kind":"Field","name":{"kind":"Name","value":"title2"}},{"kind":"Field","name":{"kind":"Name","value":"title3"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchTouristAttractionQuery, FetchTouristAttractionQueryVariables>;
export const FetchTravelAgencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchTravelAgency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registrationForTravelAgency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentTravelAgencyBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bannerTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetail"}},{"kind":"Field","name":{"kind":"Name","value":"bannerDetail2"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonPolicyCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchTravelAgencyQuery, FetchTravelAgencyQueryVariables>;
export const FetchTravelDairyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchTravelDairy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"travelDairy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentDairyBlogs"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"Info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchTravelDairyQuery, FetchTravelDairyQueryVariables>;
export const TravelDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TravelDesk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"travelDesk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentCommonBanner"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentTravelDeskContent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TravelDeskQuery, TravelDeskQueryVariables>;
export const TravelGuideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TravelGuide"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rajasthanTravelGuide"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title_1"}},{"kind":"Field","name":{"kind":"Name","value":"title_2"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ComponentGuideTravelGuide"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"travel_guides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TravelGuideQuery, TravelGuideQueryVariables>;
export const FetchUpcomingEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchUpcomingEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upcomingEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventStartDate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gte"},"value":{"kind":"StringValue","value":"2026-03-18","block":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"StringValue","value":"eventStartDate:asc","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventTitle"}},{"kind":"Field","name":{"kind":"Name","value":"sectionName"}},{"kind":"Field","name":{"kind":"Name","value":"organizedBy"}},{"kind":"Field","name":{"kind":"Name","value":"eventStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"eventEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"eventTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventPhoto"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchUpcomingEventsQuery, FetchUpcomingEventsQueryVariables>;