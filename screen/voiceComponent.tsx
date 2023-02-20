import {useEffect, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {allImage} from '../components';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const VoiceComponent = ({
  setText = () => {},
  handleSubmit = () => {},
  closeModal = () => {},
}) => {
  const [results, setResults] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  useEffect(() => {
    function onSpeechResults(e: SpeechResultsEvent) {
      setResults(e.value ?? []);
    }
    function onSpeechError(e: SpeechErrorEvent) {
      console.error(e);
    }
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    toggleListening();
    return function cleanup() {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleListening = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        setResults([]);
        await Voice.start('en-US');
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isSubmit) {
      handleSubmit();
      closeModal();
    }
  }, [isSubmit]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleListening}
        style={{paddingVertical: wp(4)}}>
        {!isListening ? (
          <View style={{alignItems: 'center'}}>
            <Image
              source={allImage.mic}
              style={{...styles.styMic, tintColor: '#17956c'}}
            />
            <Text style={styles.micTxt}>Start Listening...</Text>
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Image source={allImage.stop} style={styles.styMic} />
            <Text style={styles.micTxt}> Stop Listening...</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={{paddingTop: wp(4), paddingHorizontal: wp(4)}}>
        {results.length > 0 && (
          <Text>
            "
            {results.map((result, index) => {
              return (
                <Text
                  key={`result-${index}`}
                  style={{
                    letterSpacing: 2,
                  }}>
                  {result}
                </Text>
              );
            })}
            "
          </Text>
        )}

        {!isListening && results.length !== 0 && (
          <Button
            title="Search this"
            onPress={() => {
              setText(results.join(' '));
              setIsSubmit(true);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  micTxt: {
    fontWeight: 'bold',
    fontSize: wp(4),
  },
  styMic: {
    width: wp(30),
    height: wp(30),
    marginBottom: wp(4),
  },
  container: {
    paddingVertical: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default VoiceComponent;
