// SpeechToText.js
import React, { useState, useEffect, useRef } from 'react';

const SpeechToText = ({ setParticleColor }) => {
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const audioContextRef = useRef(null); // Audio context for frequency analysis
  const analyserRef = useRef(null);       // Audio analyser node
  const dataArrayRef = useRef(null);      // Array to hold frequency data
  const animationFrameIdRef = useRef(null); // To store requestAnimationFrame ID

  const apiKey = ''; // Replace with your ChatGPT API key
  const chatGPTApiUrl = 'https://api.openai.com/v1/chat/completions';

  // Helper function to convert HSL to HEX
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r, g, b;
    if (h < 60) {
      r = c; g = x; b = 0;
    } else if (h < 120) {
      r = x; g = c; b = 0;
    } else if (h < 180) {
      r = 0; g = c; b = x;
    } else if (h < 240) {
      r = 0; g = x; b = c;
    } else if (h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  useEffect(() => {
    setParticleColor(0xffffff); // Set default color

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Adjust based on your needs
      recognitionRef.current.lang = 'en-US'; // Adjust language as needed

      recognitionRef.current.onresult = (event) => {
        if (event.results && event.results.length > 0 && event.results[0][0]) {
          const transcriptText = event.results[0][0].transcript;
          setTranscript(transcriptText);
          callChatGPTAPI(transcriptText);
          // callGoogleSentimentAnalysis(transcriptText);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current.start();

    // Start the audio stream for frequency analysis.
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Create a new audio context
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        // Create and configure the analyser node
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Connect the audio stream to the analyser
        source.connect(analyserRef.current);

        // Function to update the particle color based on dominant frequency
        const updateFrequency = () => {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const bufferLength = dataArrayRef.current.length;
          let weightedSum = 0;
          let total = 0;
          
          // Loop through frequency bins
          for (let i = 0; i < bufferLength; i++) {
            const amplitude = dataArrayRef.current[i];
            // Use a threshold to filter out low-amplitude noise
            if (amplitude > 50) { 
              weightedSum += i * amplitude;
              total += amplitude;
            }
          }
          
          // Calculate a weighted average index
          let dominantIndex = total ? weightedSum / total : 0;
          let normalizedFrequency = dominantIndex / bufferLength;
          
          // Map normalized frequency to a hue between 0 (red) and 240 (blue)
          let hue = normalizedFrequency * 240;
          let hexColor = hslToHex(hue, 100, 50);
          
          // Convert hex string to number and update the particle color
          setParticleColor(parseInt(hexColor.replace('#', '0x'), 16));
          
          // Continue updating
          animationFrameIdRef.current = requestAnimationFrame(updateFrequency);
        };
        

        updateFrequency();
      })
      .catch(error => {
        console.error("Error accessing microphone for frequency analysis:", error);
      });
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();

    // Cancel the frequency analysis loop
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    // Optionally close the audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const callChatGPTAPI = (text) => {
    fetch(chatGPTApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: 'user', content: text }],
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      const replyText = data.choices[0].message.content;
      setReply(replyText);
      textToSpeech(replyText);
    })
    .catch((error) => console.error('Error calling ChatGPT API:', error));
  };

  const textToSpeech = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    // You might want to adjust voice selection based on availability
    utterance.voice = synth.getVoices()[1];
    utterance.rate = 1.0;
    synth.speak(utterance);
  };

  return (
    <div className="speech-to-text-container">
      <textarea value={transcript} readOnly placeholder="Transcription will appear here" className="transcript-output" ></textarea>
      <textarea value={reply} readOnly placeholder="Response will appear here" className="reply-output" ></textarea>
      <div className="button-container">
        <button onClick={startListening} disabled={isListening}>Start Listening</button>
        <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>
      </div>
    </div>
  );
};

export default SpeechToText;
