import axios from "axios";
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
