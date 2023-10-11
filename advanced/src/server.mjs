import dotenv from "dotenv";
import express from "express";
import { FlatfileClient } from "@flatfile/api";
import cors from "cors"; // Import the cors module

//this can be stored on their side. We just need this returned to us.

dotenv.config();

const app = express();
const port = 8080;

console.log(process.env.SPACE_ID);
console.log(process.env.FLATFILE_API_KEY);

const flatfile = new FlatfileClient({
  token: process.env.FLATFILE_API_KEY,
  environment: process.env.BASE_URL + "/v1",
});

// Enable CORS middleware
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/space", async (req, res) => {
  try {
    const space = await flatfile.spaces.get(process.env.SPACE_ID);
    res.json(space);
  } catch (error) {
    console.error("Error retrieving space:", error);
    res.status(500).json({ error: "Failed to retrieve space" });
  }
});

const usersTable = {
  "user1@example.com": {
    userId: "user1@example.com",
    spaceId: "us_sp_yRuaABM5",
    companyId: "company1",
  },
  "user2@example.com": {
    userId: "user2@example.com",
    spaceId: null,
    companyId: "company2",
  },
  "user3@example.com": {
    userId: "user3@example.com",
    spaceId: null,
    companyId: "company3",
  },
};

const brandTable = {
  company1: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/GAP_Logo.svg/2560px-GAP_Logo.svg.png",
    primaryColor: "black",
    name: "Gap",
  },
  company2: {
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Old_Navy_Logo.svg/2560px-Old_Navy_Logo.svg.png",
    primaryColor: "navy",
    name: "Old Navy",
  },
  company3: {
    logo: "https://1000logos.net/wp-content/uploads/2020/07/Bath-Body-Works-Logo.jpg",
    primaryColor: "pink",
    name: "Bath & Body Works",
  },
};

// Define an endpoint to retrieve userTable data
app.get("/api/users", (req, res) => {
  res.json(usersTable);
});

// Define an endpoint to update user data by userId
app.put("/api/users/:userId", express.json(), (req, res) => {
  const { userId } = req.params;
  const updatedUserData = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  if (!usersTable[userId]) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update the user data in the usersTable
  usersTable[userId] = { ...usersTable[userId], ...updatedUserData };

  res.json({ message: "User data updated successfully" });
});

// Define an endpoint to retrieve brandTable data
app.get("/api/brands", (req, res) => {
  res.json(brandTable);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
