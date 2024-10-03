// // Semtiment analysis
// import React, { useState } from 'react';
// import sentiment from 'sentiment';

// function SentimentAnalysis() {
//   const [sentence, setSentence] = useState('');
//   const [sentimentScore, setSentimentScore] = useState(0);

//   const handleSentenceChange = (event) => {
//     const newSentence = event.target.value;
//     setSentence(newSentence);

//     // Perform sentiment analysis
//     const result = sentiment(newSentence);
//     setSentimentScore(result.score);
//   };

//   // Use sentimentScore to determine color in shaders

//   return (
//     <div>
//       <textarea placeholder="Enter a sentence..." onChange={handleSentenceChange} />
//       <p>Sentiment Score: {sentimentScore}</p>
//     </div>
//   );
// }

// export default SentimentAnalysis;
