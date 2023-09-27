import { db } from '@/db/config/db';
import { Category } from '@/db/schema';

async function seedDefaultCategory() {
  try {
    await db.delete(Category);
    await db
      .insert(Category)
      .values([
        { name: 'Computer Science' },
        { name: 'Music' },
        { name: 'Fitness' },
        { name: 'Photography' },
        { name: 'Accounting' },
        { name: 'Engineering' },
        { name: 'Filming' },
      ]);
    console.log('category seeding completed');
  } catch (e) {
    console.log('An error occurred while seeding category');
    console.log(e);
  }
}

void (async () => {
  await Promise.all([seedDefaultCategory()]);
})();
