import express from "express"
import { searchStock, getWatchlist, addToWatchlist, removeFromWatchlist } from "../controller/stockController.js";
import { authenticate } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get('/search/:symbol', searchStock)

// Watchlist endpoints
router.get('/watchlist', authenticate, getWatchlist);
router.post('/watchlist', authenticate, addToWatchlist);
router.delete('/watchlist/:symbol', authenticate, removeFromWatchlist);

export default router;