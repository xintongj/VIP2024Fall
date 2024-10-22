// SpeechToText.js
import React, { useState, useEffect, useRef } from 'react';

const SpeechToText = ({ setParticleColor }) => {
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const audioContextRef = useRef(null); // Audio context for frequency analysis
  const analyserRef = useRef(null); // Audio analyser node
  const dataArrayRef = useRef(null); // Array to hold frequency data

  const apiKey = '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'; // Replace with your ChatGPT API key
  const chatGPTApiUrl = 'https://api.openai.com/v1/chat/completions';

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Adjust based on your needs
      recognitionRef.current.lang = 'en-US'; // Adjust language as needed

      recognitionRef.current.onresult = (event) => {
        if (event.results && event.results.length > 0 && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          callChatGPTAPI(transcript);
          // callGoogleSentimentAnalysis(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      // Initialize AudioContext and AnalyserNode for frequency detection
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Smaller size gives more detailed frequency information
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength); // Data array for frequency values
    
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
  };

  const callChatGPTAPI = (text) => {
    fetch(chatGPTApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }],
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      const reply = data.choices[0].message.content;
      setReply(reply);
      textToSpeech(reply);
    })
    .catch((error) => console.error('Error calling ChatGPT API:', error));
  };

  const textToSpeech = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices()[1]; // Adjust as needed
    utterance.rate = 1.0; // Adjust speed

    // Start frequency monitoring
    monitorFrequency();

    synth.speak(utterance);
  };

  // Define the updateParticleColor function to update the particle color based on sentiment score
  // const updateParticleColor = (score) => {
  // // Assuming the score is between -1 and 1
  // // Normalize the score to be between 0 and 1 for color interpolation
  // const normalizedScore = (score + 1) / 2; // Now 0 to 1 (0 being most negative, 1 being most positive)
  // // Interpolate between red and green based on the normalized score
  // let colorEnd = score < 0 ? '#ff0000' : '#00ff00'
  // // You can create more complex gradients with more colors if you like
  // transitionColor(currentColor, colorEnd, score, true);
  // // setParticleColor(color); // Update the color state in the parent component
  // };


  // Helper function to interpolate between two colors
  const lerpColor = (a, b, amount) => { 
    const ah = parseInt(a.replace(/#/g, ''), 16),
          ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
          bh = parseInt(b.replace(/#/g, ''), 16),
          br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);
  
    return '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
  };

  // Monitor frequency changes and update the particle color
  const monitorFrequency = () => {
    const checkFrequency = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current); // Get the frequency data
      // The frequency data is all zeros
      const dominantFrequency = getDominantFrequency(dataArrayRef.current); // Find the dominant frequency
      updateParticleColorByFrequency(dominantFrequency); // Update particle color based on frequency

      if (window.speechSynthesis.speaking) {
        requestAnimationFrame(checkFrequency); // Keep checking frequency during speech
      }
    };

    requestAnimationFrame(checkFrequency);
  };

  // Get the dominant frequency from the frequency data array
  const getDominantFrequency = (dataArray) => {
    let maxAmplitude = -Infinity;
    let dominantFrequencyIndex = 0;

    // Find the frequency bin with the highest amplitude
    dataArray.forEach((value, index) => {
      if (value > maxAmplitude) {
        maxAmplitude = value;
        dominantFrequencyIndex = index;
      }
    });

    // Convert the index to an actual frequency in Hz
    const nyquist = audioContextRef.current.sampleRate / 2;
    const dominantFrequency = (dominantFrequencyIndex / dataArray.length) * nyquist;

    return dominantFrequency;
  };

  // Update particle color based on frequency value
  const updateParticleColorByFrequency = (frequency) => {
    // Normalize frequency (20Hz - 20kHz) to (0-1)
    const minFrequency = 20;
    const maxFrequency = 20000;
    const normalizedFrequency = (frequency - minFrequency) / (maxFrequency - minFrequency);

    // Map frequency to a color range (e.g., from blue to red)
    const colorStart = '#00f'; // Blue for low frequencies
    const colorEnd = '#f00'; // Red for high frequencies
    const interpolatedColor = lerpColor(colorStart, colorEnd, normalizedFrequency);
    // setParticleColor(interpolatedColor);
  };











  // // Applies color transition
  // const transitionColor = (start, end, score, transitionBack) => {
  //   let transitionTime = 3000; // Time in milliseconds
  //   let steps = 40; // Number of steps in transition
  //   let stepTime = transitionTime / steps;
  //   let stepIndex = 0;
  //   let interval = setInterval(() => {
  //     if (stepIndex < steps) {
  //       let t = stepIndex / steps;
  //       let color = lerpColor(start, end, Math.abs(score) * t);
  //       currentColor = color;
  //       setParticleColor(color);
  //       stepIndex++;
  //     } else {
  //       clearInterval(interval);
  //       if (transitionBack) {
  //         setTimeout(() => {
  //           transitionColor(currentColor, '#00fff0', 1, false);
  //         }, 1000); // Delay before transitioning back
  //       }
  //     }
  //   }, stepTime);
  // };

  // Helper function to interpolate between two colors
  
// const lerpColor = (a, b, amount) => { 
//     const ah = parseInt(a.replace(/#/g, ''), 16),
//           ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
//           bh = parseInt(b.replace(/#/g, ''), 16),
//           br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
//           rr = ar + amount * (br - ar),
//           rg = ag + amount * (bg - ag),
//           rb = ab + amount * (bb - ab);
  
//     return '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
//   };

  // // Call the Google Sentiment Analysis API and handle the response
  // const callGoogleSentimentAnalysis = (text) => {
  //   fetch('http://localhost:3001/analyze-sentiment', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ text }),
  //   })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     const score = data.documentSentiment.score;
  //     updateParticleColor(score);
  //   })
  //   .catch((error) => {
  //     console.error('Error with sentiment analysis:', error);
  //   });
  // };

  return (
    <div className="speech-to-text-container">
      <textarea value={transcript} readOnly placeholder="Transcription will appear here" className="transcript-output"></textarea>
      <textarea value={reply} readOnly placeholder="Response will appear here" className="reply-output"></textarea>
      <div className="button-container">
        <button onClick={startListening} disabled={isListening}>Start Listening</button>
        <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>
      </div>
    </div>
  );
};

export default SpeechToText;