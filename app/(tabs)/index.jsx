import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MessageCircle, Sparkles, Mic, Heart } from 'lucide-react-native';

export default function HomeScreen() {
  const handleChatPress = () => {
    router.push('/(tabs)/chat');
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Text Chat',
      description: 'Have conversations with Nia through typing',
    },
    {
      icon: Mic,
      title: 'Voice Chat',
      description: 'Speak naturally and hear Nia respond',
    },
    {
      icon: Sparkles,
      title: 'AI Powered',
      description: 'Smart responses that understand context',
    },
    {
      icon: Heart,
      title: 'Your Best Friend',
      description: 'Always here to chat and support you',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8b5cf6', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Sparkles size={40} color="white" />
            </View>
            <Text style={styles.title}>Meet Nia</Text>
            <Text style={styles.subtitle}>
              Your AI software best friend{'\n'}Ready to chat anytime
            </Text>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>What I can do</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <IconComponent size={20} color="white" />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity onPress={handleChatPress} style={styles.ctaButton}>
            <View style={styles.ctaContent}>
              <MessageCircle size={24} color="#8b5cf6" />
              <Text style={styles.ctaText}>Start Chatting with Nia</Text>
            </View>
            <Text style={styles.ctaSubtext}>Tap to begin your conversation</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  ctaButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#8b5cf6',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    fontFamily: 'Inter',
  },
  ctaSubtext: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter',
  },
});