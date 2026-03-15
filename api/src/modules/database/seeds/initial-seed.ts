import { DataSource } from 'typeorm';
import { Category } from '../../categories/category.entity';
import { Course } from '../../courses/course.entity';

export const runSeed = async (dataSource: DataSource) => {
  const categoryRepository = dataSource.getRepository(Category);
  const courseRepository = dataSource.getRepository(Course);

  // 1. Seed Categories
  const categories = [
    { name: 'Behaviour' },
    { name: 'Training' },
    { name: 'Nutrition' },
  ];

  // Use upsert to avoid errors if run multiple times
  await categoryRepository.upsert(categories, ['name']);
  console.log('✅ Categories seeded');

  // 2. Get Category IDs
  const behaviourCat = await categoryRepository.findOneBy({
    name: 'Behaviour',
  });
  const trainingCat = await categoryRepository.findOneBy({ name: 'Training' });
  const nutritionCat = await categoryRepository.findOneBy({
    name: 'Nutrition',
  });

  // 3. Seed Courses - Only if no courses exist
  const existingCoursesCount = await courseRepository.count();

  if (existingCoursesCount === 0) {
    const courses = [
      {
        title: 'Potty Training Basics',
        description:
          'Master the fundamentals of house training your dog. Learn effective techniques, crate training, and outdoor routines to establish good bathroom habits quickly.',
        price: 29.99,
        totalSeats: 20,
        occupiedSeats: 5,
        category: trainingCat,
      },
      {
        title: 'Sit, Stay & Basic Commands',
        description:
          'Teach your dog essential obedience commands. Cover sit, stay, down, and come with positive reinforcement methods.',
        price: 39.99,
        totalSeats: 18,
        occupiedSeats: 8,
        category: trainingCat,
      },
      {
        title: 'Leash Walking & Loose Leash Skills',
        description:
          'Stop your dog from pulling on walks. Learn techniques for comfortable, enjoyable walks with your furry companion.',
        price: 34.99,
        totalSeats: 25,
        occupiedSeats: 10,
        category: trainingCat,
      },
      {
        title: 'Recall Training & Coming When Called',
        description:
          'Build a reliable recall command so your dog comes when called every time. Essential safety skill for all dogs.',
        price: 44.99,
        totalSeats: 15,
        occupiedSeats: 7,
        category: trainingCat,
      },
      {
        title: 'Crate Training & Confinement',
        description:
          'Learn how to properly introduce and use a crate for training, travel, and safety. Make it a positive space for your dog.',
        price: 24.99,
        totalSeats: 22,
        occupiedSeats: 9,
        category: trainingCat,
      },
      {
        title: 'Puppy Training Essentials',
        description:
          'Everything you need to know for raising a well-behaved puppy. From socialization to basic commands and house training.',
        price: 49.99,
        totalSeats: 12,
        occupiedSeats: 3,
        category: trainingCat,
      },
      {
        title: 'Understanding Canine Behavior',
        description:
          'Deep understanding of dog body language, behavior signals, and psychology. Learn what your dog is trying to tell you.',
        price: 44.99,
        totalSeats: 15,
        occupiedSeats: 7,
        category: behaviourCat,
      },
      {
        title: 'Managing Anxiety & Fear in Dogs',
        description:
          'Recognize signs of anxiety and fear in your dog. Learn practical strategies to help your anxious dog feel more confident.',
        price: 49.99,
        totalSeats: 12,
        occupiedSeats: 3,
        category: behaviourCat,
      },
      {
        title: 'Aggression Management & Prevention',
        description:
          'Address aggressive behavior safely. Learn triggers, prevention techniques, and how to create a safer environment.',
        price: 59.99,
        totalSeats: 10,
        occupiedSeats: 4,
        category: behaviourCat,
      },
      {
        title: 'Socialization: Building Confidence',
        description:
          'Learn how to properly socialize your dog with people, other dogs, and new environments for a well-adjusted companion.',
        price: 34.99,
        totalSeats: 20,
        occupiedSeats: 8,
        category: behaviourCat,
      },
      {
        title: 'Reading Dog Body Language',
        description:
          "Master the ability to interpret your dog's signals. Understand tail wagging, ear position, play bows, and stress signals.",
        price: 29.99,
        totalSeats: 25,
        occupiedSeats: 11,
        category: behaviourCat,
      },
      {
        title: 'Nutrition Essentials for Dogs',
        description:
          "Learn about balanced diets, nutritional requirements, and how proper nutrition impacts your dog's health and behavior.",
        price: 24.99,
        totalSeats: 30,
        occupiedSeats: 12,
        category: nutritionCat,
      },
      {
        title: 'Special Diets & Food Allergies',
        description:
          'Understanding food sensitivities, allergies, and special dietary needs for different dog breeds and health conditions.',
        price: 29.99,
        totalSeats: 16,
        occupiedSeats: 6,
        category: nutritionCat,
      },
      {
        title: 'Raw Diet & Home-Cooked Meals',
        description:
          'Explore raw and home-cooked diet options for dogs. Learn proper preparation, nutrition balance, and safety considerations.',
        price: 39.99,
        totalSeats: 14,
        occupiedSeats: 5,
        category: nutritionCat,
      },
      {
        title: 'Weight Management & Healthy Weight',
        description:
          'Help your dog achieve and maintain a healthy weight. Learn nutrition strategies and exercise routines for overweight dogs.',
        price: 34.99,
        totalSeats: 18,
        occupiedSeats: 9,
        category: nutritionCat,
      },
    ];

    await courseRepository.save(courses);
    console.log('✅ Courses seeded (15 courses added)');
  } else {
    console.log(
      '⏭️  Skipping course seeding - courses already exist in database',
    );
  }
};
