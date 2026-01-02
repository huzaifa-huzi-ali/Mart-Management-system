const categoryService = require('../services/category.service');
const { success, error } = require('../utils/response');

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const data = await categoryService.getAllCategories();
    success(res, data);
  } catch (err) {
    error(res, 'Failed to fetch categories', 500, err);
  }
};

// CREATE category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return error(res, 'Category name is required', 400);

  try {
    const data = await categoryService.createCategory({ name, description });
    success(res, data, 'Category created', 201);
  } catch (err) {
    error(res, 'Failed to create category', 500, err);
  }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!id || isNaN(id)) return error(res, 'Invalid ID', 400);

  try {
    const successResult = await categoryService.updateCategory(id, { name, description });
    if (!successResult) return error(res, 'Category not found', 404);
    success(res, null, 'Category updated');
  } catch (err) {
    error(res, 'Failed to update category', 500, err);
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return error(res, 'Invalid ID', 400);

  try {
    const successResult = await categoryService.deleteCategory(id);
    if (!successResult) return error(res, 'Category not found', 404);
    success(res, null, 'Category deleted');
  } catch (err) {
    error(res, 'Failed to delete category', 500, err);
  }
};
