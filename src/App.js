import React, { useState } from "react";
import { Button, Box, Typography, TextField, CircularProgress } from "@mui/material";
import "./index.css";

function StoryGenerator() {
  const [character1, setCharacter1] = useState("");
  const [character2, setCharacter2] = useState("");
  const [customCharacter1, setCustomCharacter1] = useState("");
  const [customCharacter2, setCustomCharacter2] = useState("");
  const [characters, setCharacters] = useState([
    { id: "knight", name: "A Brave Knight", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/knight.webp" },
    { id: "robot", name: "A Mischievous Robot", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/robot.webp" },
    { id: "cat", name: "A Clever Cat", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/cat.webp" },
    { id: "owl", name: "A Wise Owl", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/owl.webp" },
    { id: "dog", name: "A Silly Dog", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/dog.webp" },
    { id: "alien", name: "A Curious Alien", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/alien.webp" },
  ]);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCharacterSelection = (charName, setCharacter, setCustomCharacter) => {
    setCustomCharacter(""); // Clear any text input when an image is selected
    setCharacter(charName);
  };

  const handleTextInputChange = (text, setCustomCharacter, setCharacter) => {
    setCharacter(""); // Clear any image selection when text is entered
    setCustomCharacter(text);
  };

  const fetchStory = async () => {
    if (!character1 && !customCharacter1) {
      alert("Please select or enter Character 1!");
      return;
    }
    if (!character2 && !customCharacter2) {
      alert("Please select or enter Character 2!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("https://u6pnx5qgf2.execute-api.us-east-1.amazonaws.com/Dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character1: customCharacter1 || character1,
          character2: customCharacter2 || character2,
        }),
      });
  
      const data = await response.json();
      console.log(data);
  
      // Parse the body field and extract the story
      const parsedBody = JSON.parse(data.body);
      setStory(parsedBody.story || "Story could not be generated!");
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Error generating story. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Box sx={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h3" gutterBottom>
        Story Generator
      </Typography>
      <Box>
        {/* Character 1 */}
        <Typography variant="h5" gutterBottom>
          Select Character 1:
        </Typography>
        <Box className="character-grid">
          {characters.slice(0, 3).map((char) => (
            <Box
              key={char.id}
              className="character-box"
              onClick={() =>
                handleCharacterSelection(char.name, setCharacter1, setCustomCharacter1)
              }
            >
              <img
                src={char.img}
                alt={char.name}
                className={`character-image ${character1 === char.name ? "selected" : ""}`}
              />
              <Typography>{char.name}</Typography>
            </Box>
          ))}
          <Box className="add-character-box">
            <TextField
              label="Enter Character 1"
              value={customCharacter1}
              onChange={(e) =>
                handleTextInputChange(e.target.value, setCustomCharacter1, setCharacter1)
              }
              size="small"
              sx={{ marginBottom: "10px" }}
            />
          </Box>
        </Box>

        {/* Character 2 */}
        <Typography variant="h5" gutterBottom>
          Select Character 2:
        </Typography>
        <Box className="character-grid">
          {characters.slice(3).map((char) => (
            <Box
              key={char.id}
              className="character-box"
              onClick={() =>
                handleCharacterSelection(char.name, setCharacter2, setCustomCharacter2)
              }
            >
              <img
                src={char.img}
                alt={char.name}
                className={`character-image ${character2 === char.name ? "selected" : ""}`}
              />
              <Typography>{char.name}</Typography>
            </Box>
          ))}
          <Box className="add-character-box">
            <TextField
              label="Enter Character 2"
              value={customCharacter2}
              onChange={(e) =>
                handleTextInputChange(e.target.value, setCustomCharacter2, setCharacter2)
              }
              size="small"
              sx={{ marginBottom: "10px" }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchStory}
          sx={{ padding: "10px 20px", fontSize: "16px" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Story"}
        </Button>
        {story && (
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchStory}
            sx={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Regenerate Story
          </Button>
        )}
      </Box>

      {story && (
        <Box
          sx={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Generated Story:
          </Typography>
          <Typography>{story}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default StoryGenerator;
