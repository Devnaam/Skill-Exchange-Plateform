import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Technology', description: 'Programming, Web Dev, AI, Data Science', icon: '💻' },
    { name: 'Design', description: 'Graphic Design, UI/UX, Illustration', icon: '🎨' },
    { name: 'Business', description: 'Marketing, Management, Sales', icon: '💼' },
    { name: 'Languages', description: 'English, Spanish, French, etc.', icon: '🌍' },
    { name: 'Arts', description: 'Music, Photography, Drawing', icon: '🎭' },
    { name: 'Fitness', description: 'Yoga, Sports, Gym', icon: '💪' },
    { name: 'Cooking', description: 'Baking, Cuisine, Recipes', icon: '🍳' },
    { name: 'Lifestyle', description: 'Fashion, Travel, Wellness', icon: '✨' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
