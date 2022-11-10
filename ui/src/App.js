import React, { useContext, useEffect } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnimeDetailsScreen from "./screens/animeDetailsScreen";
import SettingScreen from "./screens/settingScreen";
import { HomeScreen } from "./screens/homeScreen";
import Navbar from "./components/navbar";
import DownloadScreen from "./screens/downloadsScreen";
import InbuiltPlayerScreen from "./screens/inbuiltPlayerScreen";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import ExploreScreen from "./screens/exploreScreen";
import VideoPlayer from "./components/video-player";
import { SocketContext } from "./socket";

// const { app } = window.require("@electron/remote");

function App() {
  const client = useContext(SocketContext);

  useEffect(() => {
    if (!client) return;
    console.log(client)
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      client.send(JSON.stringify({ type: "connect" }));

    };
  }, [client]);

  return (
    <BrowserRouter>
      <Grid
        templateColumns="repeat(1, 0.04fr 1fr)"
        w={"100%"}
        h={"100%"}
        overflow={"hidden"}
      >
        <GridItem
          w="100%"
          h={"100vh"}
          maxWidth={"70px"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Navbar />
        </GridItem>
        <GridItem
          w="100%"
          h={"100vh"}
          bg={"gray.900"}
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
              borderRadius: "8px",
              backgroundColor: `rgba(255, 255, 255, 0.2)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `rgba(255, 255, 255, 0.2)`,
            },
          }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="anime-details" element={<AnimeDetailsScreen />} />
              <Route path="setting" element={<SettingScreen />} />
              <Route path="download" element={<DownloadScreen />} />
              <Route path="play" element={<InbuiltPlayerScreen />} />
              <Route path="explore" element={<ExploreScreen />} />
            </Routes>
          </Box>
        </GridItem>
      </Grid>
    </BrowserRouter>
  );
}

export default App;
