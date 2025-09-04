import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Use backend URL from env, fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunks = useRef([]);

  // Fetch recordings on load
  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/recordings`);
      setRecordings(res.data);
    } catch (err) {
      console.error("❌ Error fetching recordings:", err);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => chunks.current.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        chunks.current = [];

        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "video/webm",
        });

        const formData = new FormData();
        formData.append("video", file);

        try {
          await axios.post(`${API_URL}/api/recordings`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          fetchRecordings();
        } catch (err) {
          console.error("❌ Upload failed:", err);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("❌ Could not start recording:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🎥 Screen Recorder</h1>

      {!recording ? (
        <button onClick={startRecording} style={btnStyle}>
          ⏺ Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={btnStyle}>
          ⏹ Stop Recording
        </button>
      )}

      <h2 style={{ marginTop: "20px" }}>📂 Saved Recordings</h2>
      {recordings.length === 0 ? (
        <p>No recordings found</p>
      ) : (
        recordings.map((rec) => (
          <div key={rec.id} style={cardStyle}>
            <p>{rec.filename}</p>
            <video
              controls
              width="400"
              src={`${API_URL}/api/recordings/${rec.id}`}
            ></video>
          </div>
        ))
      )}
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  margin: "10px 0",
  fontSize: "16px",
  cursor: "pointer",
};

const cardStyle = {
  margin: "15px 0",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

export default App;
