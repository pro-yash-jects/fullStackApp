import axios from "axios";
import { User } from "../models/User.js";

export const searchStock = async (req, res) => {
    const symbol = req.params.symbol?.trim();
    if (!symbol) {
        return res.status(400).json({ error: "Invalid or empty stock symbol" });
    }
    try {
        const response = await axios.get("https://api.twelvedata.com/quote", {
            params: {
                symbol,
                apikey : process.env.TWELVE_KEY
            }
        }
        )
        res.status(200).json(response.data);
        return;
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).send("Error while getting current data")
    }
}

// Get user's watchlist
export const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ watchList: user.watchList || [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching watchlist" });
    }
};

// Add symbol to watchlist
export const addToWatchlist = async (req, res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) {
            return res.status(400).json({ message: "Symbol is required" });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Add symbol if not already in watchlist
        if (!user.watchList.includes(symbol.toUpperCase())) {
            user.watchList.push(symbol.toUpperCase());
            await user.save();
        }
        
        res.json({ message: "Added to watchlist", watchList: user.watchList });
    } catch (error) {
        res.status(500).json({ message: "Error adding to watchlist" });
    }
};

// Remove symbol from watchlist
export const removeFromWatchlist = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Remove symbol from watchlist
        user.watchList = user.watchList.filter(s => s !== symbol.toUpperCase());
        await user.save();
        
        res.json({ message: "Removed from watchlist", watchList: user.watchList });
    } catch (error) {
        res.status(500).json({ message: "Error removing from watchlist" });
    }
};
