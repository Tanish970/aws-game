const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load .env variables
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize AWS Bedrock Runtime Client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/generate-story", async (req, res) => {
  const { character1, character2 } = req.body;

  const payload = {
    modelId: "amazon.nova-micro-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inferenceConfig: {
        max_new_tokens: 500,
      },
      messages: [
        {
          role: "user",
          content: [
            {
              text: `Create a funny story about ${character1} and ${character2}.`,
            },
          ],
        },
      ],
    }),
  };

  try {
    const command = new InvokeModelCommand(payload);
    const response = await bedrockClient.send(command);
  
    // Decode the binary response
    const responseBody = new TextDecoder().decode(response.body);
    console.log("Decoded Response Body:", responseBody);
  
    // Parse the JSON response
    const parsedBody = JSON.parse(responseBody);
    console.log("Parsed Body:", parsedBody);
  
    // Extract the story text
    const story =
      parsedBody.output?.message?.content?.[0]?.text || "No story generated.";
    console.log("Extracted Story:", story);
  
    res.json({ story });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to generate story." });
  }
  
  
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
