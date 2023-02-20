import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import Main from './screen/main';

const App = () => {
  return (
    <SafeAreaView
      style={{backgroundColor: '#343642', flex: 1}}
      edges={['bottom']}>
      <StatusBar barStyle={'light-content'} />
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
        <Main />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;
