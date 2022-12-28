import React, { useState, useEffect } from 'react';
import { AppState, Text, View, Button } from 'react-native';
import Voice from 'react-native-voice';
import { openApp } from './utils'; // Function to open the app

function VoiceCommand({ command, onTrigger }) {
  // Declare state variables for listening status, error, and results
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  // Use effect hook to set up event listeners for speech recognition results and errors
  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      setResults(event.value);
    };

    Voice.onSpeechError = (event) => {
      setError(event.error);
    };

    // Start listening for speech when the component mounts
    startListening();

    // Return a cleanup function that stops listening for speech when the component unmounts
    return stopListening;
  }, []);

  // Function to start listening for speech
  const startListening = () => {
    setIsListening(true);
    Voice.start('en-US');
  };

  // Function to stop listening for speech
  const stopListening = () => {
    setIsListening(false);
    Voice.stop();
  };

  // Use effect hook to check if the command has been spoken and trigger the callback function
  useEffect(() => {
    if (results.includes(command)) {
      onTrigger();
    }
  }, [results, command, onTrigger]);

  return (
    <View>
      {error ? <Text>Error: {error}</Text> : null}
      {results.map((result) => (
        <Text key={result}>{result}</Text>
      ))}
    </View>
  );
}

const VoiceTrigger = () => {
  // Declare state variable for current app state and a function to update it
  const [appState, setAppState] = useState(AppState.currentState);

  // Function to open the app
  const openAppTrigger = () => {
    openApp();
  };

  return (
    <View>
      {/* Render the VoiceCommand component, passing the command and a callback function for opening the app */}
      <VoiceCommand command="open app" onTrigger={openAppTrigger} />
      <Text>App state: {appState}</Text>
    </View>
  );
};

export default VoiceTrigger;