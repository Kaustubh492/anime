import { Box, Image, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import videojs from "video.js";
import "videojs-contrib-quality-levels";
import qualitySelector from "videojs-hls-quality-selector";
import "video.js/dist/video-js.css";
import "videojs-hotkeys";
import ExternalPlayerPopup from "./externalPopup";
import { useDispatch, useSelector } from "react-redux";
// function getWindowSize() {
//   const { innerWidth, innerHeight } = window;
//   return { innerWidth, innerHeight };
// }
import hlsQualitySelector from "videojs-hls-quality-selector";
import { downloadVideo } from "../actions/downloadActions";

const VideoPlayer = ({
  url,
  epDetails,
  player,
  setPlayer,
  prevTime,
  nextEpHandler,
  streamLoading,
  setQualityOptions,
  qualityOptions,
}) => {
  const toast = useToast();

  const { details } = useSelector((state) => state.animeStreamDetails);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [language, setLanguage] = useState("jpn");
  const videoRef = useRef();
  const [callFinishVideoAPI, setCallFinishVideoAPI] = useState(false);
  const [vidDuration, setVidDuration] = useState(50000);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    if (player && url) {
      player.src({
        src: url,
        type: "application/x-mpegURL",
        withCredentials: false,
      });
      player.poster("");
      setCallFinishVideoAPI(false);
    }

    if (player && prevTime) {
      if (prevTime) {
        player?.currentTime(prevTime);
        player?.play();
      } else {
        player?.currentTime(0);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (callFinishVideoAPI) {
      nextEpHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFinishVideoAPI]);

  useEffect(() => {
    videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);

    const videoJsOptions = {
      autoplay: false,
      preload: "metadata",
      playbackRates: [0.5, 1, 1.5, 2],

      controls: true,
      poster: epDetails?.details?.snapshot,
      controlBar: {
        pictureInPictureToggle: false,
      },
      fluid: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
          withCredentials: false,
        },
      ],
      html5: {
        nativeAudioTracks: true,
        nativeVideoTracks: true,
        nativeTextTracks: true,
      },
    };

    const plyer = videojs(
      videoRef.current,
      videoJsOptions,
      function onPlayerReady() {
        this.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
        });
      }
    );
    var fullscreen = plyer.controlBar.getChild("FullscreenToggle");
    var index = plyer.controlBar.children().indexOf(fullscreen);
    var externalPlayerButton = plyer.controlBar.addChild("button", {}, index);

    var externalPlayerButtonDom = externalPlayerButton.el();
    if (externalPlayerButtonDom) {
      externalPlayerButtonDom.innerHTML = "external";

      externalPlayerButtonDom.onclick = function () {
        if (plyer.isFullscreen()) {
          fullscreen.handleClick();
        }
        onOpen();
      };
    }

    let qualityLevels = plyer.qualityLevels();

    console.log(qualityLevels);
    console.log(qualityLevels?.levels_?.length);
    console.log(typeof qualityLevels);
    console.log(qualityLevels.levels_.forEach((x) => console.log(x)));
    setQualityOptions(qualityLevels.levels_);

    // qualityLevels.on('change', function() {
    //   console.log('Quality Level changed!');
    //   console.log('New level:', qualityLevels[qualityLevels.selectedIndex]);
    // });
    // var downloadButton = plyer.controlBar.addChild("button", {}, index);

    // var downloadButtonDom = downloadButton.el();
    // if (downloadButtonDom) {
    //   downloadButtonDom.style.width = "2em";
    //   downloadButtonDom.innerHTML = `<img style={{margin: "0 auto"}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAjklEQVQ4je2UsQkCQRBF34iBVRjYhsZygZ3YxKYWYEdnGwY2oUbPZEHxzpMbBRMfTLDM8ubDsAtfIoaa6gpY1uMhItrUFLV4pwzdnaQm/EUpOutX58AemAGLWgDHWhdgGxGnt3Z1rZ7tclU3o6L2yMZLemR5yYOsUZuPJL/j6XGOpQBMq6sFdskcua/lFTf9ZKaqnDiZAAAAAABJRU5ErkJggg==">`;

    //   downloadButtonDom.onclick = function () {

    // }

    setPlayer(plyer);

    return () => {
      if (player) player.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epDetails]);
  console.log(downloadUrl);

  useEffect(() => {
    if (player && player.hlsQualitySelector) {
      player.hlsQualitySelector = hlsQualitySelector;

      player.hlsQualitySelector({ displayCurrentQuality: true });
      let qualityLevels = player.qualityLevels();
      setQualityOptions(qualityLevels.levels_);
      console.log(qualityLevels.levels_);
      qualityLevels.levels_.forEach(element => {
          console.log(element)
      });
    }
  }, [player]);

  // useEffect(() => {

  //   if (player && prevTime) {
  //     if (prevTime) {
  //       player?.currentTime(prevTime);
  //       player?.play();
  //     } else {
  //       console.log("kokoko")
  //       player?.currentTime(0);
  //     }
  //   }

  //   return () => {
  //     if (player) player.dispose();
  //   };
  // }, [prevTime]);

  return (
    <Box p={3} width="100%">
      <div data-vjs-player>
        <video
          ref={videoRef}
          lan
          onLoadedMetadata={(e, px) => {
            setVidDuration(e.target.duration);
          }}
          onTimeUpdate={(e) => {
            if (e.target.currentTime >= vidDuration - 1) {
              setCallFinishVideoAPI(true);
            }
          }}
          className="vidPlayer video-js vjs-default-skin vjs-big-play-centered"
          id="my-video"
        ></video>
      </div>

      <ExternalPlayerPopup
        isOpen={isOpen}
        onClose={onClose}
        language={language}
      />
    </Box>
  );
};

export default VideoPlayer;
