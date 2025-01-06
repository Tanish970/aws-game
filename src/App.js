import React, { useState } from "react";

function StoryGenerator() {
  const [character1, setCharacter1] = useState("");
  const [character2, setCharacter2] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    if (!character1 || !character2) {
      alert("Please select both characters!");
      return;
    }

    setLoading(true);

    try {
      // Call your backend to generate the story
      const response = await fetch("http://localhost:3001/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character1, character2 }),
      });

      const data = await response.json();
      setStory(data.story || "Story could not be generated!");
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Error generating story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Story Generator</h1>
      <div>
        <label>
          Select Character 1:
          <select
            value={character1}
            onChange={(e) => setCharacter1(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          >
            <option value="">--Choose--</option>
            <option value="a brave knight">A Brave Knight</option>
            <option value="a mischievous robot">A Mischievous Robot</option>
            <option value="a clever cat">A Clever Cat</option>
          </select>
        </label>

        <label>
          Select Character 2:
          <select
            value={character2}
            onChange={(e) => setCharacter2(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">--Choose--</option>
            <option value="a wise owl">A Wise Owl</option>
            <option value="a silly dog">A Silly Dog</option>
            <option value="a curious alien">A Curious Alien</option>
          </select>
        </label>
      </div>

      <button
        onClick={generateStory}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Generating Story..." : "Generate Story"}
      </button>

      {story && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h2>Generated Story:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}

export default StoryGenerator;
