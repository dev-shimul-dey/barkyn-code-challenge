import { DataSource } from "typeorm";
import { Category } from "../../categories/category.entity";
import { Course } from "../../courses/course.entity";

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
  await categoryRepository.upsert(categories, ["name"]);
  console.log("✅ Categories seeded");

  // 2. Get Category IDs
  const behaviourCat = await categoryRepository.findOneBy({ name: 'Behaviour' });
  const trainingCat = await categoryRepository.findOneBy({ name: 'Training' });
  const nutritionCat = await categoryRepository.findOneBy({ name: 'Nutrition' });

  // 3. Seed Courses
  const courses = [
    {
      title: 'Sed ut alterum aspernandum',
      description: 'Deep dive into canine behavioral patterns.',
      price: 1.00,
      totalSeats: 15,
      occupiedSeats: 3,
      category: behaviourCat,
    },
    {
      title: 'At vero eos et accusamus',
      description: 'Advanced training techniques.',
      price: 45.50,
      totalSeats: 10,
      occupiedSeats: 0,
      category: trainingCat,
    },
    {
      title: 'Et harum quidem rerum facilis',
      description: 'Nutrition essentials for a healthy dog.',
      price: 25.00,
      totalSeats: 20,
      occupiedSeats: 0,
      category: nutritionCat,
    }
  ];

  await courseRepository.save(courses);
  console.log("✅ Courses seeded");
};