import { BookingStatus, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Web Development', slug: 'web-development', description: 'Modern websites, landing pages, and SaaS builds for Indian businesses.' },
  { name: 'Mobile Development', slug: 'mobile-development', description: 'Android and iOS app development for startups and local brands.' },
  { name: 'Graphic Design', slug: 'graphic-design', description: 'Brand identities, campaign creatives, and social visuals.' },
  { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Growth campaigns, SEO, and paid media for Indian markets.' },
  { name: 'Home Services', slug: 'home-services', description: 'Reliable residential cleaning and home care support.' },
  { name: 'Plumbing', slug: 'plumbing', description: 'Leak fixes, installations, and maintenance visits.' },
  { name: 'Electrician', slug: 'electrician', description: 'Electrical repairs, fittings, and safety checks.' },
  { name: 'Photography', slug: 'photography', description: 'Portraits, events, and product photography.' },
] as const;

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Kochi', 'Lucknow', 'Indore'] as const;

const professionalNames = [
  'Aman Kumar',
  'Priya Singh',
  'Rahul Verma',
  'Neha Gupta',
  'Arjun Yadav',
  'Sneha Mishra',
  'Vikram Chaudhary',
  'Anjali Pandey',
  'Rohit Saxena',
  'Kavya Tiwari',
] as const;

const customerNames = [
  'Sandeep Jaiswal',
  'Pooja Srivastava',
  'Mohit Agarwal',
  'Nisha Bansal',
  'Aditya Pandey',
  'Kriti Khanna',
  'Manish Tripathi',
  'Ritika Sharma',
  'Saurabh Singh',
  'Ananya Verma',
] as const;

const professionalFocuses = [
  'Lead web engineer helping startups ship refined products.',
  'Mobile developer focused on polished consumer experiences.',
  'Brand designer crafting premium visual identities.',
  'Growth marketer building measurable acquisition systems.',
  'Home services specialist for apartments and family homes.',
  'Plumber handling urgent repairs and neat installations.',
  'Electrician delivering safe, high-quality electrical work.',
  'Photographer producing clean commercial and event imagery.',
  'Full-stack consultant for modern SaaS builds.',
  'Operations-focused professional delivering on-time service.',
] as const;

const professionalSpecialties = [
  ['Web Development', 'Digital Marketing'],
  ['Mobile Development', 'Graphic Design'],
  ['Graphic Design', 'Photography'],
  ['Digital Marketing', 'Web Development'],
  ['Home Services', 'Digital Marketing'],
  ['Plumbing', 'Home Services'],
  ['Electrician', 'Plumbing'],
  ['Photography', 'Graphic Design'],
  ['Web Development', 'Mobile Development'],
  ['Digital Marketing', 'Photography'],
] as const;

const serviceTemplates = {
  'Web Development': [
    'Landing page build',
    'Business website redesign',
    'SaaS dashboard implementation',
    'Performance and SEO audit',
  ],
  'Mobile Development': [
    'Android app prototype',
    'iOS app interface build',
    'React Native feature sprint',
    'App store readiness review',
  ],
  'Graphic Design': [
    'Brand identity kit',
    'Social media creative pack',
    'Pitch deck design',
    'UI visual refresh',
  ],
  'Digital Marketing': [
    'SEO growth plan',
    'Paid ads campaign setup',
    'Content strategy sprint',
    'Lead generation audit',
  ],
  'Home Services': [
    'Deep home cleaning',
    'Move-in cleaning service',
    'Kitchen and bath refresh',
    'Weekly maintenance cleaning',
  ],
  'Plumbing': [
    'Leak repair visit',
    'Bathroom fitting service',
    'Pipe inspection and repair',
    'Water pressure fix',
  ],
  Electrician: [
    'Wiring inspection',
    'Switchboard repair',
    'Lighting installation',
    'Power backup setup',
  ],
  Photography: [
    'Portrait session',
    'Event coverage',
    'Product photo shoot',
    'Studio retouch package',
  ],
} as const;

const servicePricingBands: Record<string, { min: number; max: number }> = {
  'Web Development': { min: 8000, max: 25000 },
  'Mobile Development': { min: 15000, max: 50000 },
  'Graphic Design': { min: 500, max: 5000 },
  'Digital Marketing': { min: 2000, max: 15000 },
  'Home Services': { min: 300, max: 2000 },
  Plumbing: { min: 500, max: 3500 },
  Electrician: { min: 600, max: 4000 },
  Photography: { min: 1500, max: 12000 },
} as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function makeEmail(name: string, index: number) {
  return `${slugify(name)}.${index + 1}@skillbridge.local`;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function priceFor(categoryName: keyof typeof servicePricingBands, profileIndex: number, serviceIndex: number) {
  const band = servicePricingBands[categoryName];
  const slots = 4;
  const step = Math.max(1, Math.floor((band.max - band.min) / (slots - 1)));
  return Math.min(band.max, band.min + step * ((profileIndex + serviceIndex) % slots));
}

async function main() {
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.professionalProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const createdCategories = [];
  for (const category of categories) {
    createdCategories.push(
      await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
      })
    );
  }

  const professionalUsers = [];
  const customerUsers = [];

  for (let index = 0; index < professionalNames.length; index += 1) {
    const name = professionalNames[index];
    professionalUsers.push(
      await prisma.user.create({
        data: {
          email: makeEmail(name, index),
          name,
          role: UserRole.PROFESSIONAL,
          image: `https://i.pravatar.cc/150?img=${index + 11}`,
          phone: `+91-9${String(500000000 + index).slice(0, 9)}`,
        },
      })
    );
  }

  for (let index = 0; index < customerNames.length; index += 1) {
    const name = customerNames[index];
    customerUsers.push(
      await prisma.user.create({
        data: {
          email: makeEmail(name, index + 20),
          name,
          role: UserRole.CUSTOMER,
          image: `https://i.pravatar.cc/150?img=${index + 31}`,
          phone: `+91-8${String(600000000 + index).slice(0, 9)}`,
        },
      })
    );
  }

  const professionalProfiles = [];
  for (let index = 0; index < professionalUsers.length; index += 1) {
    const user = professionalUsers[index];
    const city = cities[index % cities.length];
    const primaryCategory = professionalSpecialties[index][0];
    professionalProfiles.push(
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          headline: professionalFocuses[index],
          description: `Trusted ${primaryCategory.toLowerCase()} support for clients in ${city}.`,
          city,
          state: 'Uttar Pradesh',
          country: 'India',
          postalCode: `${110000 + index}`,
          yearsExperience: 3 + (index % 8),
          hourlyRate: 1500 + index * 250,
          isVerified: index % 2 === 0,
          isAvailable: true,
        },
      })
    );
  }

  const services = [];
  for (let profileIndex = 0; profileIndex < professionalProfiles.length; profileIndex += 1) {
    const profile = professionalProfiles[profileIndex];
    const specialties = professionalSpecialties[profileIndex];

    for (let serviceIndex = 0; serviceIndex < 4; serviceIndex += 1) {
      const specialtyName = specialties[serviceIndex % specialties.length];
      const category = createdCategories.find((item) => item.name === specialtyName)!;
      const templateList = serviceTemplates[specialtyName as keyof typeof serviceTemplates];
      const title = templateList[serviceIndex];
      const price = priceFor(specialtyName as keyof typeof servicePricingBands, profileIndex, serviceIndex);
      const durationMinutes = 60 + serviceIndex * 30;

      services.push(
        await prisma.service.create({
          data: {
            title,
            description: `${title} delivered by ${professionalUsers[profileIndex].name} for clients in ${profile.city}, India.`,
            price,
            durationMinutes,
            categoryId: category.id,
            professionalId: profile.id,
            images: [
              `https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80&sig=${profileIndex}${serviceIndex}a`,
              `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80&sig=${profileIndex}${serviceIndex}b`,
            ],
            isActive: true,
          },
        })
      );
    }
  }

  const bookingStatuses = [
    BookingStatus.PENDING,
    BookingStatus.ACCEPTED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED_BY_CUSTOMER,
  ];

  for (let index = 0; index < 20; index += 1) {
    const customer = customerUsers[index % customerUsers.length];
    const professional = professionalUsers[index % professionalUsers.length];
    const profile = professionalProfiles[index % professionalProfiles.length];
    const service = services[index % services.length];
    const scheduledDate = new Date(Date.now() + (index + 1) * 3 * 24 * 60 * 60 * 1000);
    const scheduledEndDate = addMinutes(scheduledDate, service.durationMinutes ?? 60);
    const status = bookingStatuses[index % bookingStatuses.length];

    await prisma.booking.create({
      data: {
        customerId: customer.id,
        professionalId: professional.id,
        serviceId: service.id,
        scheduledDate,
        scheduledEndDate,
        status,
        totalPrice: service.price,
        address: `${cities[index % cities.length]}, India`,
        notes: `Seed booking for ${profile.userId} scheduled with ${professional.name}.`,
      },
    });
  }

  console.log(
    `Seeded ${createdCategories.length} categories, ${professionalUsers.length + customerUsers.length} users, ${professionalProfiles.length} professionals, ${services.length} services, and 20 bookings.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
