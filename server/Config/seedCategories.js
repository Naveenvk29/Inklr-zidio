import dotenv from "dotenv";
import slugify from "slugify";
import Category from "../Models/category.js";
import connectDB from "./db.js";

dotenv.config();
connectDB();

const rawCategoryNames = [
  "Technology",
  "Health",
  "Finance",
  "Education",
  "Travel",
  "Food & Cooking",
  "Lifestyle",
  "Sports",
  "Entertainment",
  "Science",
  "Art & Culture",
  "Business",
  "Politics",
  "Environment",
  "Fashion",
  "Automotive",
  "Photography",
  "Personal Development",
];

const categories = rawCategoryNames.map((name) => ({
  name,
  slug: slugify(name, { lower: true }),
}));

const seedCategories = async () => {
  try {
    await connectDB();
    await Category.deleteMany();

    const created = await Category.insertMany(categories);
    console.log(`✅ Seeded ${created.length} categories`);
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedCategories();
