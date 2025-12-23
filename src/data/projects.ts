import { Project } from '@/types/project';

// Import all project images
import skylineTower from '@/assets/projects/skyline-tower.jpg';
import azureHeights from '@/assets/projects/azure-heights.jpg';
import palmOasisVilla from '@/assets/projects/palm-oasis-villa.jpg';
import serenityEstate from '@/assets/projects/serenity-estate.jpg';
import nexusHub from '@/assets/projects/nexus-hub.jpg';
import techPark from '@/assets/projects/tech-park.jpg';
import marinaResort from '@/assets/projects/marina-resort.jpg';
import alpineLodge from '@/assets/projects/alpine-lodge.jpg';
import metroHospital from '@/assets/projects/metro-hospital.jpg';
import horizonUniversity from '@/assets/projects/horizon-university.jpg';
import crossBayBridge from '@/assets/projects/cross-bay-bridge.jpg';
import logisticsCenter from '@/assets/projects/logistics-center.jpg';
import ecoverdeHq from '@/assets/projects/ecoverde-hq.jpg';
import helixTower from '@/assets/projects/helix-tower.jpg';
import coastalMedical from '@/assets/projects/coastal-medical.jpg';

// Sample video URLs (using reliable public domain sample videos)
const SAMPLE_VIDEOS = {
  construction1: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  construction2: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  construction3: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  timelapse1: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  timelapse2: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  drone1: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Skyline Tower One',
    location: 'Dubai, UAE',
    year: 2024,
    category: 'high-rise',
    categoryLabel: 'High-Rise',
    media: [
      { id: '1a', type: 'image', src: skylineTower, alt: 'Skyline Tower One - 85-story glass skyscraper with cyan LED accents at night', aspectRatio: 0.8 },
      { id: '1b', type: 'video', src: SAMPLE_VIDEOS.construction1, thumbnail: skylineTower, alt: 'Skyline Tower construction timelapse', aspectRatio: 1.78 },
    ],
  },
  {
    id: '2',
    title: 'Azure Heights Complex',
    location: 'Singapore',
    year: 2023,
    category: 'high-rise',
    categoryLabel: 'High-Rise',
    media: [
      { id: '2a', type: 'video', src: SAMPLE_VIDEOS.timelapse1, thumbnail: azureHeights, alt: 'Azure Heights drone flythrough', aspectRatio: 1.78 },
      { id: '2b', type: 'image', src: azureHeights, alt: 'Azure Heights - Modern residential towers with vertical gardens', aspectRatio: 0.8 },
    ],
  },
  {
    id: '3',
    title: 'Palm Oasis Villa',
    location: 'Malibu, USA',
    year: 2024,
    category: 'villas-residential',
    categoryLabel: 'Villas & Residential',
    media: [
      { id: '3a', type: 'image', src: palmOasisVilla, alt: 'Palm Oasis Villa - Luxury modern villa with infinity pool overlooking Pacific ocean', aspectRatio: 1.33 },
      { id: '3b', type: 'video', src: SAMPLE_VIDEOS.construction2, thumbnail: palmOasisVilla, alt: 'Palm Oasis Villa construction progress', aspectRatio: 1.78 },
    ],
  },
  {
    id: '4',
    title: 'Serenity Estate',
    location: 'Monaco',
    year: 2023,
    category: 'villas-residential',
    categoryLabel: 'Villas & Residential',
    media: [
      { id: '4a', type: 'image', src: serenityEstate, alt: 'Serenity Estate - Mediterranean luxury mansion with marble facade', aspectRatio: 1.0 },
    ],
  },
  {
    id: '5',
    title: 'Nexus Business Hub',
    location: 'London, UK',
    year: 2024,
    category: 'commercial-offices',
    categoryLabel: 'Commercial & Offices',
    media: [
      { id: '5a', type: 'image', src: nexusHub, alt: 'Nexus Business Hub - Glass curtain wall office building with green terraces', aspectRatio: 0.8 },
      { id: '5b', type: 'video', src: SAMPLE_VIDEOS.timelapse2, thumbnail: nexusHub, alt: 'Nexus Hub construction timelapse', aspectRatio: 1.78 },
    ],
  },
  {
    id: '6',
    title: 'Tech Park Central',
    location: 'Berlin, Germany',
    year: 2022,
    category: 'commercial-offices',
    categoryLabel: 'Commercial & Offices',
    media: [
      { id: '6a', type: 'video', src: SAMPLE_VIDEOS.construction3, thumbnail: techPark, alt: 'Tech Park Central aerial tour', aspectRatio: 1.78 },
      { id: '6b', type: 'image', src: techPark, alt: 'Tech Park Central - Industrial modern innovation hub with exposed steel', aspectRatio: 1.33 },
    ],
  },
  {
    id: '7',
    title: 'Grand Marina Resort',
    location: 'Bali, Indonesia',
    year: 2024,
    category: 'hospitality-hotels',
    categoryLabel: 'Hospitality & Hotels',
    media: [
      { id: '7a', type: 'image', src: marinaResort, alt: 'Grand Marina Resort - Tropical beachfront resort with thatched villas', aspectRatio: 1.33 },
      { id: '7b', type: 'video', src: SAMPLE_VIDEOS.drone1, thumbnail: marinaResort, alt: 'Grand Marina Resort drone tour', aspectRatio: 1.78 },
    ],
  },
  {
    id: '8',
    title: 'Alpine Luxury Lodge',
    location: 'Zermatt, Switzerland',
    year: 2023,
    category: 'hospitality-hotels',
    categoryLabel: 'Hospitality & Hotels',
    media: [
      { id: '8a', type: 'image', src: alpineLodge, alt: 'Alpine Luxury Lodge - Wooden chalet in Swiss Alps with mountain views', aspectRatio: 1.33 },
    ],
  },
  {
    id: '9',
    title: 'Metro General Hospital',
    location: 'Toronto, Canada',
    year: 2024,
    category: 'healthcare',
    categoryLabel: 'Healthcare',
    media: [
      { id: '9a', type: 'image', src: metroHospital, alt: 'Metro General Hospital - State-of-the-art medical facility with healing gardens', aspectRatio: 1.33 },
      { id: '9b', type: 'video', src: SAMPLE_VIDEOS.construction1, thumbnail: metroHospital, alt: 'Metro Hospital construction progress', aspectRatio: 1.78 },
    ],
  },
  {
    id: '10',
    title: 'Horizon University Campus',
    location: 'Sydney, Australia',
    year: 2023,
    category: 'education',
    categoryLabel: 'Education',
    media: [
      { id: '10a', type: 'image', src: horizonUniversity, alt: 'Horizon University Campus - Contemporary educational architecture with green courtyards', aspectRatio: 1.33 },
    ],
  },
  {
    id: '11',
    title: 'Cross-Bay Bridge',
    location: 'San Francisco, USA',
    year: 2024,
    category: 'infrastructure',
    categoryLabel: 'Infrastructure',
    media: [
      { id: '11a', type: 'video', src: SAMPLE_VIDEOS.timelapse1, thumbnail: crossBayBridge, alt: 'Cross-Bay Bridge construction timelapse', aspectRatio: 1.78 },
      { id: '11b', type: 'image', src: crossBayBridge, alt: 'Cross-Bay Bridge - Cable-stayed bridge spanning bay at sunset', aspectRatio: 1.6 },
    ],
  },
  {
    id: '12',
    title: 'Global Logistics Center',
    location: 'Rotterdam, Netherlands',
    year: 2023,
    category: 'industrial',
    categoryLabel: 'Industrial',
    media: [
      { id: '12a', type: 'image', src: logisticsCenter, alt: 'Global Logistics Center - Automated port facility with crane systems', aspectRatio: 1.33 },
      { id: '12b', type: 'video', src: SAMPLE_VIDEOS.construction2, thumbnail: logisticsCenter, alt: 'Logistics Center operations video', aspectRatio: 1.78 },
    ],
  },
  {
    id: '13',
    title: 'EcoVerde Headquarters',
    location: 'Copenhagen, Denmark',
    year: 2024,
    category: 'sustainable-green',
    categoryLabel: 'Sustainable & Green',
    media: [
      { id: '13a', type: 'image', src: ecoverdeHq, alt: 'EcoVerde Headquarters - Biophilic office with living walls and solar panels', aspectRatio: 1.0 },
      { id: '13b', type: 'video', src: SAMPLE_VIDEOS.timelapse2, thumbnail: ecoverdeHq, alt: 'EcoVerde sustainable features tour', aspectRatio: 1.78 },
    ],
  },
  {
    id: '14',
    title: 'The Helix Tower',
    location: 'Tokyo, Japan',
    year: 2024,
    category: 'iconic-landmark',
    categoryLabel: 'Iconic & Landmark',
    featured: true,
    media: [
      { id: '14a', type: 'image', src: helixTower, alt: 'The Helix Tower - Twisted spiral skyscraper illuminated at night', aspectRatio: 0.7 },
      { id: '14b', type: 'video', src: SAMPLE_VIDEOS.drone1, thumbnail: helixTower, alt: 'Helix Tower drone showcase', aspectRatio: 1.78 },
    ],
  },
  {
    id: '15',
    title: 'Coastal Medical Center',
    location: 'Miami, USA',
    year: 2023,
    category: 'healthcare',
    categoryLabel: 'Healthcare',
    media: [
      { id: '15a', type: 'image', src: coastalMedical, alt: 'Coastal Medical Center - Art Deco hospital with ocean view', aspectRatio: 1.33 },
    ],
  },
];
