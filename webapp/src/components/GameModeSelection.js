"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Button,
  Paper,
  Box,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Game from "./Game"

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
}))

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: "100%",
  background: "linear-gradient(to right, #f5f7fa, #e4e8f0)",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: "bold",
  color: theme.palette.primary.main,
  textAlign: "center",
  textTransform: "uppercase",
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: "1.2rem",
  fontWeight: "bold",
  borderRadius: 30,
  background: "linear-gradient(to right, #3f51b5, #7e57c2)",
  "&:hover": {
    background: "linear-gradient(to right, #303f9f, #5e35b1)",
    transform: "scale(1.03)",
  },
  "&.Mui-disabled": {
    background: theme.palette.grey[300],
    color: theme.palette.text.disabled,
  },
  transition: theme.transitions.create(["background", "transform"], {
    duration: theme.transitions.duration.short,
  }),
}))

const TopicOption = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ theme, isSelected }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: isSelected ? "linear-gradient(to right, #2196f3, #9c27b0)" : theme.palette.background.paper,
  color: isSelected ? theme.palette.common.white : theme.palette.text.primary,
  width: "100%",
  margin: 0,
  transition: theme.transitions.create(["background", "color"], {
    duration: theme.transitions.duration.short,
  }),
  "& .MuiFormControlLabel-label": {
    fontWeight: "bold",
  },
}))

function GameModeSelection() {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [isWild, setIsWild] = useState(false)
  const [selectedMode, setSelectedMode] = useState(null)
  const [showGame, setShowGame] = useState(false)

  const handleTopicChange = (topic) => {
    if (!isWild) {
      setSelectedTopic(topic === selectedTopic ? null : topic)
    }
  }

  const handleWildSelection = () => {
    setIsWild(true)
    setSelectedTopic("all")
  }

  const handleCustomSelection = () => {
    setIsWild(false)
    setSelectedTopic(null)
  }

  const handleModeChange = (mode) => {
    setSelectedMode(mode === selectedMode ? null : mode)
  }

  const handleStartGame = () => {
    setShowGame(true)
  }

  const isStartDisabled = !selectedTopic || !selectedMode

  if (showGame) {
    return <Game />
  }

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5" }}>
        TRIVIA GAME
      </Typography>

      <SectionPaper elevation={3}>
        <SectionTitle variant="h5">SELECT THE TOPIC</SectionTitle>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={isWild ? "wild" : "custom"}>
            <TopicOption
              value="custom"
              control={<Radio color="primary" />}
              label="CUSTOM"
              onChange={handleCustomSelection}
              isSelected={!isWild}
            />

            <Box sx={{ ml: 4, display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
              <FormControlLabel
                disabled={isWild}
                control={
                  <Checkbox
                    checked={selectedTopic === "movies"}
                    onChange={() => handleTopicChange("movies")}
                    color="primary"
                  />
                }
                label="MOVIES"
              />
              <FormControlLabel
                disabled={isWild}
                control={
                  <Checkbox
                    checked={selectedTopic === "flags"}
                    onChange={() => handleTopicChange("flags")}
                    color="primary"
                  />
                }
                label="FLAGS"
              />
              <FormControlLabel
                disabled={isWild}
                control={
                  <Checkbox
                    checked={selectedTopic === "music"}
                    onChange={() => handleTopicChange("music")}
                    color="primary"
                  />
                }
                label="MUSIC"
              />
            </Box>

            <TopicOption
              value="wild"
              control={<Radio color="primary" />}
              label="WILD - EVERYTHING ALL AT ONCE!"
              onChange={handleWildSelection}
              isSelected={isWild}
            />
          </RadioGroup>
        </FormControl>
      </SectionPaper>

      <SectionPaper elevation={3}>
        <SectionTitle variant="h5">SELECT THE MODE</SectionTitle>
        <FormControl component="fieldset" fullWidth>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedMode === "rounds"}
                  onChange={() => handleModeChange("rounds")}
                  color="primary"
                />
              }
              label="ROUNDS"
            />
            <FormControlLabel
              control={
                <Checkbox checked={selectedMode === "time"} onChange={() => handleModeChange("time")} color="primary" />
              }
              label="TIME"
            />
            <FormControlLabel
              control={
                <Checkbox checked={selectedMode === "hide"} onChange={() => handleModeChange("hide")} color="primary" />
              }
              label="HIDE"
            />
          </Box>
        </FormControl>
      </SectionPaper>

      <StyledButton
        variant="contained"
        color="primary"
        size="large"
        onClick={handleStartGame}
        disabled={isStartDisabled}
        fullWidth
      >
        NEXT
      </StyledButton>
    </StyledContainer>
  )
}

export default GameModeSelection

