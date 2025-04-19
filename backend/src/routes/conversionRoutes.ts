import { Router } from 'express';

import {
  convertToRoman,
  convertToArabic,
  getAll,
  removeAll,
} from '../controllers/conversionController';

const router = Router();

// Route for converting Arabic to Roman
router.get('/roman/:inputValue', convertToRoman);

// Route for converting Roman to Arabic
router.get('/arabic/:inputValue', convertToArabic);

// Route for getting all conversions
router.get('/all', getAll);

// Route for removing all conversions
router.delete('/remove', removeAll);

export default router;
