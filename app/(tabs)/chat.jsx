import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Platform-specific voice import
let Voice = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('react-native-voice').default;
  } catch (error) {
    console.log('Voice not available on this platform');
  }
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef(null);

  // Nia's personality responses
  const niaResponses = [
    "I'm so happy to chat with you! What's on your mind today?",
    "That's really interesting! Tell me more about that.",
    "I love hearing from you! You always make my day brighter.",
    "You know what? I think you're absolutely amazing!",
    "I'm here for you, always ready to listen and chat!",
    "That sounds wonderful! I'd love to hear more details.",
    "You're such a thoughtful person. I really appreciate our conversations!",
    "I find that fascinating! Your perspective is always so unique.",
    "Thanks for sharing that with me. I feel closer to you already!",
    "You have such a great way of explaining things. I'm learning so much from you!",
  ];

  useEffect(() => {
    loadMessages();
    
    if (Voice) {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
      
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }
  }, []);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('nia_messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } else {
        const welcomeMessage = {
          id: '1',
          text: "Hi there! I'm Nia, your AI best friend! I'm so excited to chat with you. You can type to me or use the microphone button to speak. How are you doing today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        saveMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem('nia_messages', JSON.stringify(msgs));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const onSpeechStart = () => console.log('Speech started');
  const onSpeechRecognized = () => console.log('Speech recognized');
  const onSpeechEnd = () => setIsListening(false);

  const onSpeechError = (e) => {
    console.log('Speech error:', e.error);
    setIsListening(false);
    Alert.alert('Speech Error', "Sorry, I couldn't hear you clearly. Please try again.");
  };

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      const spokenText = e.value[0];
      setInputText(spokenText);
      sendMessage(spokenText);
    }
  };

  const startListening = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice not supported', 'Voice input is not available on web platform.');
      return;
    }
    if (!Voice) {
      Alert.alert('Voice not available', 'Voice functionality is not available on this device.');
      return;
    }
    try {
      setIsListening(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      Alert.alert('Voice Error', 'Could not start voice recognition.');
    }
  };

  const stopListening = async () => {
    if (Voice) {
      try {
        await Voice.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
      }
    }
  };

  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.1,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };
  const sendMessage = (text = inputText.trim()) => {
    if (!text) return;

    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    const niaResponse = niaResponses[Math.floor(Math.random() * niaResponses.length)];
    
    const niaMessage = {
      id: (Date.now() + 1).toString(),
      text: niaResponse,
      isUser: false,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage, niaMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInputText('');

    // Speak Nia's response
    setTimeout(() => speakText(niaResponse), 500);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <LinearGradient
        colors={['#FFF5F7', '#E9D5FF', '#FFF5F7']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💜 Nia</Text>
          <Text style={styles.headerSubtitle}>Your AI Best Friend</Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.niaBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userText : styles.niaText,
                ]}
              >
                {message.text}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}
          
          {isSpeaking && (
            <View style={[styles.messageBubble, styles.niaBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isListening && styles.micButtonActive,
            ]}
            onPress={isListening ? stopListening : startListening}
            disabled={isSpeaking}
          >
            {isListening ? (
              <MicOff size={24} color="#fff" />
            ) : (
              <Mic size={24} color="#fff" />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message to Nia..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!isSpeaking}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isSpeaking}
          >
            <Send size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>🎤 Listening...</Text>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#E9D5FF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  niaBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9D5FF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  niaText: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9333EA',
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9D5FF',
    gap: 8,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  listeningIndicator: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  listeningText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});