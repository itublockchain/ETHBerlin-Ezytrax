const express = require("express");
const app = express();
const cors = require("cors");
const { getHexes } = require("./transaction/createUTXO");
app.use(cors());

app.get("/api/getUTXO", async (req, res) => {
  try {
    const address = req.query.address;
    console.log(address);
    const poseidonHash = req.query.poseidonHash;
    console.log(poseidonHash);
    const result = await getHexes(address, poseidonHash);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/getNullifier", async (req, res) => {
  try {
    const address = req.query.address;
    console.log(address);
    const result = await getNullifier(address);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
