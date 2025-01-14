import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ImageList,
  ImageListItem,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import "./index.css"; // Ensure this file contains necessary styles

const characters1 = [
  { id: "knight", name: "A Brave Knight", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/knight.webp" },
  { id: "robot", name: "A Mischievous Robot", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/robot.webp" },
  { id: "cat", name: "A Clever Cat", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/cat.webp" },
];
const characters2 = [
  { id: "owl", name: "A Wise Owl", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/owl.webp" },
  { id: "dog", name: "A Silly Dog", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/dog.webp" },
  { id: "alien", name: "A Curious Alien", img: "https://awsgamechallange.s3.us-east-1.amazonaws.com/alien.webp" },
];

function CharacterCard({ character, selected, onSelect }) {
  return (
    <Card
      sx={{
        border: selected ? "3px solid #1976d2" : "1px solid #ccc",
        boxShadow: selected ? "0 0 10px #1976d2" : "none",
      }}
    >
      <CardActionArea onClick={() => onSelect(character.name)}>
        <CardMedia component="img" height="140" image={character.img} alt={character.name} />
        <CardContent>
          <Typography align="center">{character.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function StoryChat() {
  const [character1, setCharacter1] = useState("");
  const [character2, setCharacter2] = useState("");
  const [story, setStory] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  const sendStoryRequest = useCallback(
    async (userChoice = "", option = 1) => {
      if (!character1 || !character2) {
        alert("Please select both characters!");
        return;
      }

      setLoading(true);

      const sto = story.map((line) => line.text).join(" ") + (userChoice ? ` ${userChoice}` : "");

      try {
        const response = await fetch("https://u6pnx5qgf2.execute-api.us-east-1.amazonaws.com/Dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            character1,
            character2,
            userChoice,
            option,
            sto,
          }),
        });

        const data = await response.json();
        const parsedBody = JSON.parse(data.body);
        const newStory = parsedBody.story || "No story available.";
        const newOptions = parsedBody.options || [];

        setStory((prev) => [...prev, { text: newStory, isAI: true }]);
        setOptions(newOptions);
        setStage((prev) => prev + 1);
      } catch (error) {
        console.error("Error generating story:", error);
      } finally {
        setLoading(false);
      }
    },
    [character1, character2, story]
  );

  const handleOptionClick = (choice) => {
    setStory((prev) => [...prev, { text: choice, isAI: false }]);
    sendStoryRequest(choice, 2);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        AI Interactive Story
      </Typography>

      {stage === 0 ? (
        <>
          <Typography variant="h5" gutterBottom>
            Select Character 1:
          </Typography>
          <ImageList cols={3} gap={16} rowHeight={200}>
            {characters1.map((char) => (
              <ImageListItem key={char.id}>
                <CharacterCard
                  character={char}
                  selected={character1 === char.name}
                  onSelect={setCharacter1}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <Typography variant="h5" gutterBottom>
            Select Character 2:
          </Typography>
          <ImageList cols={3} gap={16} rowHeight={200}>
            {characters2.map((char) => (
              <ImageListItem key={char.id}>
                <CharacterCard
                  character={char}
                  selected={character2 === char.name}
                  onSelect={setCharacter2}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <Button
            variant="contained"
            color="primary"
            onClick={() => sendStoryRequest("", 1)}
            sx={{ display: "block", margin: "20px auto" }}
          >
            Start Story
          </Button>
        </>
      ) : (
        <>
          <Paper sx={{ padding: "10px", marginBottom: "20px", height: "300px", overflow: "auto" }}>
            <List>
              {story.map((line, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={line.text}
                    primaryTypographyProps={{
                      align: line.isAI ? "left" : "right",
                      style: { color: line.isAI ? "#000" : "#1976d2" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          {loading && <CircularProgress sx={{ display: "block", margin: "10px auto" }} />}
          {!loading &&
            options.map((option, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleOptionClick(option)}
                sx={{ textAlign: "center", padding: "10px", fontSize: "16px" }}
              >
                {option}
              </Button>
            ))}
        </>
      )}
    </Box>
  );
}

export default StoryChat;
