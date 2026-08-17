import { ServiceItem, CoreValueItem, ObjectiveItem, GoalItem } from '../types';

export const BRAND_INFO = {
  name: 'AutoVentraMobilities',
  fullName: 'AutoVentraMobilities',
  tagline: 'Driving Trust. Delivering Value.',
  heroHeadline: 'DRIVE WITH CONFIDENCE',
  heroSubheadline: 'Quality Vehicles. Reliable Rentals. Professional Transport Solutions.',
  slogan: 'YOUR TRUSTED PARTNER IN EVERY DRIVE.',
  phone: '+254 702 957300',
  phoneRaw: '+254702957300',
  whatsapp: '254702957300',
  email: 'info@autoventramobilities.com',
  location: 'Ngong Road, Nairobi, Kenya',
  website: 'www.autoventramobilities.com',
  whatsappUrl: 'https://wa.me/254702957300?text=Hello%20AutoVentraMobilities%2C%20I%20am%20inquiring%20about%20your%20vehicles%20and%20services.',
  telUrl: 'tel:+254702957300',
  mailUrl: 'mailto:info@autoventramobilities.com',
  businessHours: [
    { days: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
    { days: 'Saturday', hours: '9:00 AM – 4:00 PM' },
    { days: 'Sunday & Holidays', hours: 'By Appointment Only' },
  ],
};

export const COMPANY_PROFILE = {
  title: 'COMPANY PROFILE',
  text: 'AutoVentraMobilities is a modern automotive dealership and mobility solutions provider committed to making vehicle ownership and travel simple, reliable, and affordable. We specialize in the buying, selling, trading, and sourcing of quality vehicles while providing exceptional customer service, transparent transactions, and professional guidance. Our goal is to become the preferred destination for individuals, families, and businesses seeking dependable vehicles at competitive prices.',
};

export const VISION = {
  title: 'OUR VISION',
  text: 'To become the leading and most trusted car dealership in the region, recognized for quality vehicles, integrity, innovation, and outstanding customer satisfaction.',
};

export const MISSION = {
  title: 'OUR MISSION',
  text: 'To provide customers with quality vehicles and exceptional automotive solutions through honesty, affordability, professionalism, and a seamless buying and selling experience.',
};

export const OBJECTIVES: ObjectiveItem[] = [
  { text: 'To offer high-quality new and pre-owned vehicles.' },
  { text: 'To provide fair and transparent vehicle trade-in services.' },
  { text: 'To build long-term relationships through trust and excellent customer care.' },
  { text: 'To expand our inventory to meet diverse customer needs.' },
  { text: 'To embrace innovation and digital solutions that make buying and selling vehicles easier.' },
];

export const GOALS: GoalItem[] = [
  { text: 'Become a leading car dealership brand in East Africa.' },
  { text: 'Maintain high customer satisfaction through reliable service.' },
  { text: 'Grow our market presence with quality vehicles and competitive pricing.' },
  { text: 'Build strategic partnerships with vehicle manufacturers, financiers, and insurance providers.' },
  { text: 'Promote integrity, professionalism, and excellence in every transaction.' },
];

export const CORE_VALUES: CoreValueItem[] = [
  {
    name: 'INTEGRITY',
    description: 'Honest and transparent business practices.',
    icon: 'Scale',
  },
  {
    name: 'QUALITY',
    description: 'Vehicles that meet high standards.',
    icon: 'ShieldCheck',
  },
  {
    name: 'CUSTOMER FIRST',
    description: 'Every customer matters.',
    icon: 'Users',
  },
  {
    name: 'EXCELLENCE',
    description: 'Delivering the best experience every time.',
    icon: 'Award',
  },
  {
    name: 'INNOVATION',
    description: 'Using modern technology to improve our services.',
    icon: 'Lightbulb',
  },
  {
    name: 'RELIABILITY',
    description: 'Keeping our promises and earning customer trust.',
    icon: 'CheckCircle2',
  },
];

export const PILLARS_STRIP = [
  {
    id: 'buy',
    title: 'Buy a Vehicle',
    tag: 'BUY',
    icon: 'Car',
    text: 'Premium verified new & pre-owned inventory with full inspection reports and honest pricing.',
    actionLabel: 'Browse Vehicles',
  },
  {
    id: 'rent',
    title: 'Car Rentals',
    tag: 'RENT',
    icon: 'KeyRound',
    text: 'Flexible short and long-term rental fleet for business executives, families, and road trips.',
    actionLabel: 'Book a Rental',
  },
  {
    id: 'transport',
    title: 'Transport Solutions',
    tag: 'TRANSPORT',
    icon: 'Compass',
    text: 'Dedicated private, executive, and corporate group transport services with vetted professional drivers.',
    actionLabel: 'Request Transport',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'sales',
    title: 'New & Used Car Sales',
    shortDescription: 'Verified inventory of pristine new and pre-owned vehicles inspected for roadworthiness and performance.',
    fullDescription: 'We provide an extensive selection of vetted, certified brand-new and pre-owned automobiles. Every vehicle in our lot undergoes rigorous multi-point mechanical checks to ensure safety, reliability, and peace of mind on the road.',
    features: [
      'Comprehensive mechanical & diagnostic inspection',
      'Clean logbooks and verified vehicle histories',
      'Competitive direct pricing with zero hidden fees',
      'Flexible test drive scheduling in Nairobi',
    ],
    icon: 'Car',
    category: 'dealership',
  },
  {
    id: 'rentals',
    title: 'Car Rentals',
    shortDescription: 'Flexible daily, weekly, and monthly car rentals for executive travel, safari tours, and daily commuting.',
    fullDescription: 'Whether you require an executive sedan for corporate meetings, a 4x4 SUV for safari excursions, or an economical hatchback for urban driving, AutoVentraMobilities offers well-maintained rental vehicles with instant booking.',
    features: [
      'Self-drive and chauffeur-driven options',
      'Short-term daily hires and long-term corporate leases',
      'Comprehensive insurance coverage included',
      '24/7 roadside assistance and replacement guarantee',
    ],
    icon: 'KeyRound',
    category: 'rental',
  },
  {
    id: 'transport',
    title: 'Transport Services',
    shortDescription: 'Reliable private, corporate, and event passenger transport solutions managed with punctuality.',
    fullDescription: 'Professional mobility and executive transport across Nairobi and East Africa. From airport transfers and VIP delegations to staff shuttles and event logistics, our fleet delivers punctual, comfortable, and secure rides.',
    features: [
      'JKIA airport pickups and seamless transfers',
      'Executive & corporate staff transport contracts',
      'Event and group delegation transport fleet',
      'Experienced, professional, and vetted drivers',
    ],
    icon: 'Compass',
    category: 'logistics',
  },
  {
    id: 'trade-ins',
    title: 'Vehicle Trade-Ins',
    shortDescription: 'Upgrade your current car effortlessly with fair market valuations and fast paperwork turnaround.',
    fullDescription: 'Trade in your existing vehicle toward a newer model with complete transparency. Our experienced appraisers assess your car accurately, allowing you to drive away in your upgraded car with minimal downtime.',
    features: [
      'Same-day professional valuation assessment',
      'Fair, transparent, market-aligned trade-in value',
      'Deduction of valuation directly from your upgrade price',
      'Full handling of transfer paperwork & logbook updates',
    ],
    icon: 'Repeat',
    category: 'dealership',
  },
  {
    id: 'sourcing',
    title: 'Vehicle Sourcing',
    shortDescription: 'Custom vehicle search for specific makes, models, and specifications tailored to your budget.',
    fullDescription: 'Looking for a rare trim, specific colorway, or custom configuration? Our dedicated sourcing network scours local and international dealer networks to procure the exact car that fulfills your desires.',
    features: [
      'Access to exclusive verified regional dealership networks',
      'Strict quality validation before deal commitment',
      'Negotiation handled by automotive specialists',
      'Direct doorstep delivery and handover',
    ],
    icon: 'Search',
    category: 'dealership',
  },
  {
    id: 'import',
    title: 'Vehicle Import Services',
    shortDescription: 'End-to-end import solutions from Japan, UK, Thailand, and South Africa with duty clearance.',
    fullDescription: 'Hassle-free direct vehicle importation from premier global auction hubs (Japan, UK, Singapore, South Africa). We manage the entire pipeline from auction bidding and shipping to Kenya Revenue Authority (KRA) customs clearance.',
    features: [
      'Direct bidding on premier international auto auctions',
      'Full pre-shipment inspection (QISJ / JEVIC certificates)',
      'Transparent customs duty calculation & clearance',
      'Direct port clearance from Mombasa to Nairobi showroom',
    ],
    icon: 'Globe2',
    category: 'dealership',
  },
  {
    id: 'financing',
    title: 'Vehicle Financing Assistance',
    shortDescription: 'Tailored asset financing partnerships with leading banking institutions and micro-financiers.',
    fullDescription: 'Turn your dream car into reality through our streamlined financing facilitation. We partner with tier-1 commercial banks, SACCOs, and asset financiers to secure favorable interest rates and manageable repayment tenures.',
    features: [
      'Up to 80% - 90% asset financing facilitation',
      'Flexible repayment terms from 12 to 60 months',
      'Fast-track pre-approval with minimal paperwork',
      'Transparent amortization schedules and guidance',
    ],
    icon: 'CircleDollarSign',
    category: 'advisory',
  },
  {
    id: 'consultation',
    title: 'Automotive Consultation',
    shortDescription: 'Expert advisory on car selection, valuation, maintenance forecasting, and ownership economics.',
    fullDescription: 'Unbiased, expert guidance to help you make sound automotive decisions. From fleet optimization for companies to personal vehicle suitability assessments, our team equips you with factual industry knowledge.',
    features: [
      'Total Cost of Ownership (TCO) and fuel economy analysis',
      'Fleet management advisory for corporate organizations',
      'Resale value projection and depreciation insights',
      'Pre-purchase technical advisory and condition audit',
    ],
    icon: 'HelpCircle',
    category: 'advisory',
  },
];
