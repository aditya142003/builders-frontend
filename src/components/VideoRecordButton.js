import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const VideoRecordButton = () => {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        recorder.onstop = () => {
          // Create a Blob with the recorded data
          const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          // Ensure URL object remains valid until playback
          const recordedVideoUrl = URL.createObjectURL(recordedBlob);
          videoRef.current.src = recordedVideoUrl;
          videoRef.current.play(); // Start playback immediately
        };

        recorder.onerror = (error) => {
          console.error("MediaRecorder error:", error);
        };

        setMediaRecorder(recorder);
      })
      .catch((error) => console.error("Error accessing media devices:", error));
  }, [recordedChunks]);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const uploadVideo = async () => {
    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", blob);
      console.log(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/bigVideos`,
        formData
      );
      // const response = await fetch("http://localhost:5000/api/videos", {
      //   method: "POST",
      //   body: formData,
      // });

      if (response.ok) {
        console.log("Video uploaded successfully!");
      } else {
        console.error("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <video ref={videoRef} playsInline autoPlay muted controls={true} />
      </div>
      <div style={{ textAlign: "center" }}>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={downloadVideo}>Download Video</button>
        <button onClick={uploadVideo}>Upload Video</button>
      </div>
    </div>
  );
};

export default VideoRecordButton;
