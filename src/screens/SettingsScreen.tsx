import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, StatusBar, AppState } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { permissionService } from '../services/permissionService';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [micPermission, setMicPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const micStatus = await permissionService.checkMicrophonePermission();
      const notifStatus = await permissionService.requestNotificationPermission();
      setMicPermission(micStatus);
      setNotificationPermission(notifStatus);
    };

    checkPermissions();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          checkPermissions();
        }
      });

      return () => {
        subscription.remove();
      };
  }, []);

  const handleMicRequest = async () => {
    const granted = await permissionService.requestMicrophonePermission();
    setMicPermission(granted);
  };

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );

  const Item = ({ icon, color, text, rightContent }) => (
    <View style={styles.item}>
      <View style={[styles.itemIconContainer, { backgroundColor: `${color}1A` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.itemText}>{text}</Text>
      {rightContent}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color="#0d7ff2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Section title="Permissions">
          <Item
            icon="mic"
            color={micPermission ? '#4caf50' : '#f44336'}
            text="Microphone Access"
            rightContent={
              !micPermission && (
                <TouchableOpacity style={styles.grantButton} onPress={handleMicRequest}>
                  <Text style={styles.grantButtonText}>Grant</Text>
                </TouchableOpacity>
              )
            }
          />
          <View style={styles.separator} />
          <Item
            icon="notifications"
            color={notificationPermission ? '#4caf50' : '#ff9800'}
            text="Notifications"
            rightContent={
                !notificationPermission && (
                  <TouchableOpacity style={styles.grantButton} onPress={() => {}}>
                    <Text style={styles.grantButtonText}>Grant</Text>
                  </TouchableOpacity>
                )
              }
          />
        </Section>
        <Section title="Legal">
          <TouchableOpacity>
            <Item icon="policy" color="#9e9e9e" text="Privacy Policy" rightContent={<Icon name="chevron-right" size={24} color="#38383a" />} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity>
            <Item icon="description" color="#9e9e9e" text="Terms of Service" rightContent={<Icon name="chevron-right" size={24} color="#38383a" />} />
          </TouchableOpacity>
        </Section>
        <Section title="App Info">
          <Item icon="info" color="#2196f3" text="Version" rightContent={<Text style={styles.versionText}>1.0.2</Text>} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#38383a',
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    backButton: { flexDirection: 'row', alignItems: 'center' },
    backButtonText: { color: '#0d7ff2', fontSize: 17, marginLeft: 4 },
    headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
    scrollViewContent: { paddingVertical: 24, paddingHorizontal: 16 },
    section: { marginBottom: 32 },
    sectionTitle: {
      color: '#98989d',
      fontSize: 13,
      textTransform: 'uppercase',
      marginBottom: 8,
      marginLeft: 16,
    },
    card: { backgroundColor: '#1c1c1e', borderRadius: 12, overflow: 'hidden' },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    itemIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    itemText: { flex: 1, color: '#FFFFFF', fontSize: 17 },
    versionText: { color: '#98989d', fontSize: 17 },
    separator: { height: 1, backgroundColor: '#38383a', marginLeft: 64 },
    grantButton: {
      backgroundColor: '#0d7ff2',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    grantButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  });

export default SettingsScreen;