import { Router } from 'express';

const router = Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      printer: { connected: false, status: 'disconnected' },
      cash_drawer: { connected: false, status: 'disconnected' },
      card_reader: { connected: false, status: 'disconnected' },
      barcode_scanner: { connected: false, status: 'disconnected' }
    }
  });
});

export default router;
