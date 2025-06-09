import Category from "../Models/category.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exisitingCategory = await Category.findOne({ name });
    if (exisitingCategory) {
      return res.status(400).json({ error: "Category already exists." });
    }

    const category = new Category({
      name,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const fetchCategorysBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const modifyCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name || category.name;
    const updatedcategory = await category.save();

    res.status(201).json(updatedcategory);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const removeCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.deleteOne();

    res.status(201).json({ message: `Deleted ${category.name} successfully` });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export {
  createCategory,
  fetchCategories,
  fetchCategorysBySlug,
  modifyCategory,
  removeCategory,
};
