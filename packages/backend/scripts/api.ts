const express = require("express");
const app = express();
const cors = require("cors");
const { getHexes } = require("./transaction/calls");
app.use(cors());

app.get("/api/getUTXO", async (req, res) => {
  try {
    console.log(req);
    const address = req.query.address;
    const poseidonHash = req.query.poseidonHash;
    const result = await getHexes(address, poseidonHash);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
