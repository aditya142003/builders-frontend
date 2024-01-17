import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef();
  const mediaRecorderRef = useRef();

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        });
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }

    enableStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const downloadRecording = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.mp4";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const uploadFile = async (blob) => {
    const data = new FormData();
    data.append("file", blob);
    data.append("upload_preset", "videos");
    try {
      let cloudName = "dscmtg4tx";
      let resourceType = "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      // console.log(res);
      const { secure_url } = res.data;
      // console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadVideo = async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const formData = new FormData();
      formData.append("file", blob, "recording.mp4");

      try {
        const imageUrl = await uploadFile(blob);

        formData.append("imageUrl", JSON.stringify(imageUrl));
        formData.append("type", JSON.stringify("video"));

        const response = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/bigVideos`,
          formData
        );
        console.log("Video uploaded successfully:", response);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <div>
        {recording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        <button onClick={downloadRecording} disabled={!recordedChunks.length}>
          Download
        </button>
        <button onClick={uploadVideo} disabled={!recordedChunks.length}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default VideoRecorder;
