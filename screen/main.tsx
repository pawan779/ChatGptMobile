import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {allImage} from '../components';
import {generateText} from './api';
import VoiceComponent from './voiceComponent';

const Main = () => {
  const [text, setText] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [setTO, setSetTO] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const flatListRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await generateText({prompt: text + '?'});
    const newData: any[] = [];
    newData.push({
      searchText: text,
      result: res,
    });
    setData([...newData, ...data]);
    setText('');
    setLoading(false);
    setSetTO(!setTO);
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };
  const handleCloseModal = () => {
    setIsListening(false);
  };

  useEffect(() => {
    scrollToTop();
  }, [setTO]);

  return (
    <View style={{flex: 1}}>
      <Image source={allImage.chatGpt} style={styles.imageSty} />

      <View style={{flex: 1}}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          inverted
          renderItem={({item, index}) => (
            <View style={styles.container1}>
              <Text style={styles.searchTxtSty}>
                {data.length - index + '. ' + item?.searchText}
              </Text>
              <Text style={styles.resutlTxtSty}>{item?.result}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.inoutContainer}>
        <TextInput
          value={text}
          onChangeText={(txt: string) => setText(txt)}
          placeholder="Enter text here...."
          placeholderTextColor={'#fefefe'}
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor={'#fff'}
          style={styles.inputSty}
          returnKeyLabel="Search"
          returnKeyType="search"
          multiline={true}
        />
        {!loading ? (
          <>
            <TouchableOpacity
              onPress={() => setIsListening(true)}
              style={{paddingRight: wp(3)}}>
              <Image source={allImage.mic} style={styles.sendSty} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Image source={allImage.send} style={styles.sendSty} />
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator size="small" color="#343642" animating={loading} />
        )}

        {isListening && (
          <Modal animationType="slide" visible={isListening} transparent={true}>
            <TouchableOpacity
              style={{flex: 1, backgroundColor: 'rgba(0,0,0,.2)'}}
              onPress={handleCloseModal}></TouchableOpacity>
            <VoiceComponent
              setText={setText}
              closeModal={handleCloseModal}
              handleSubmit={handleSubmit}
            />
          </Modal>
        )}
      </View>
    </View>
  );
};

export default Main;
const styles = StyleSheet.create({
  sendSty: {
    width: wp(5),
    height: wp(5),
    tintColor: '#cecece',
  },
  inputSty: {
    flex: 1,
    color: '#fff',
    fontSize: wp(3.7),
    paddingRight: wp(2),
  },
  inoutContainer: {
    flexDirection: 'row',
    backgroundColor: '#17956c',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: hp(6),
    padding: wp(4),
    maxHeight: hp(20),
    shadowColor: '#fff',
    shadowOffset: {
      width: 4,
      height: 2,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  resutlTxtSty: {
    fontSize: 15,
    backgroundColor: 'h',
    color: '#fff',
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
  },
  searchTxtSty: {
    fontSize: 15,
    backgroundColor: '#272832',
    color: '#fff',
    padding: wp(4),
  },
  container1: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#272832',
  },
  imageSty: {
    width: wp(10),
    height: wp(10),
    resizeMode: 'contain',
    position: 'absolute',
    top: wp(2),
    right: wp(2),
    zIndex: 99,
  },
});
