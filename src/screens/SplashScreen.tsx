import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SplashScreen = () => {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Main');
    }, 3500);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false, // width animation not supported by native driver
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    return () => clearTimeout(timer);
  }, [navigation, pulseAnim]);

  const barWidth = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['33%', '66%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101922" />
      <LinearGradient
        colors={['rgba(13, 127, 242, 0.05)', 'transparent']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <View style={styles.logo}>
            <Icon name="bolt" size={50} color="#0d7ff2" />
          </View>
        </View>

        <View style={styles.headlines}>
          <Text style={styles.title}>StartNow</Text>
          <Text style={styles.subtitle}>Voice-First Productivity</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressIndicator, { width: barWidth }]} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Icon name="auto-awesome" size={14} color="#0d7ff2" />
        <Text style={styles.footerText}>Powered by Gemini AI</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101922',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(13, 127, 242, 0.2)',
    borderRadius: 60,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#1a2c3d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headlines: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#90adcb',
  },
  progressContainer: {
    width: 160,
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#314d68',
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#0d7ff2',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 32,
    opacity: 0.8,
  },
  footerText: {
    color: '#90adcb',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;