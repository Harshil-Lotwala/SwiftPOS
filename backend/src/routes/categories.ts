import { Router } from 'express';
import { executeQuery } from '../config/database';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await executeQuery('SELECT * FROM categories WHERE is_active = true ORDER BY name');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

export default router;
