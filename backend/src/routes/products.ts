import { Router } from 'express';
import { executeQuery } from '../config/database';

const router = Router();

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await executeQuery(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = true
      ORDER BY p.name
    `);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
  return;
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await executeQuery(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.is_active = true
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    next(error);
  }
  return;
});

export default router;
