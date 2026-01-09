import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-voice/voice';
import { geminiAIService } from '../services/geminiService';
import { notificationService } from '../services/notificationService';
import { saveTask } from '../services/storageService';
import { parse, set, addDays } from 'date-fns';

const AddTaskModal = ({ visible, onClose }) => {
  const [taskText, setTaskText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskTime, setTaskTime] = useState('');

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = async (e) => {
    const transcribedText = e.value[0];
    setIsProcessing(true);
    try {
      const result = await geminiAIService.processTextInput(transcribedText);
      setTaskText(result.description);
      setTaskTime(result.time);
    } catch (error) {
      console.error(error);
      setTaskText(transcribedText); // Fallback to transcribed text on error
    } finally {
      setIsProcessing(false);
    }
  };

  const onSpeechError = (e) => {
    console.error(e);
    setIsListening(false);
  };

  const startListening = async () => {
    setTaskText('');
    setIsListening(true);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleScheduleTask = () => {
    if (taskText.trim() === '') return;

    let fireDate = new Date();
    // Basic time parsing logic
    if (taskTime.toLowerCase().includes('tomorrow')) {
        fireDate = addDays(fireDate, 1);
    }
    const timeMatch = taskTime.match(/(\d{1,2}:\d{2})\s*(am|pm)/i);
    if (timeMatch) {
        const parsedTime = parse(timeMatch[0], 'h:mm a', new Date());
        fireDate = set(fireDate, { hours: parsedTime.getHours(), minutes: parsedTime.getMinutes(), seconds: 0 });
    }


    const notificationId = notificationService.scheduleNotification(fireDate, 'Task Reminder', taskText);

    const newTask = {
      id: Date.now().toString(),
      title: taskText,
      time: fireDate.toLocaleTimeString(),
      status: 'Pending',
      icon: 'schedule',
      notificationId,
    };

    saveTask(newTask);
    setTaskText('');
    onClose();
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>New Task</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.micContainer}>
            <TouchableOpacity style={styles.micButton} onPress={toggleListening} disabled={isProcessing}>
              {isListening || isProcessing ? <ActivityIndicator size="large" color="#FFFFFF" /> : <Icon name="mic" size={48} color="#FFFFFF" />}
            </TouchableOpacity>
            <Text style={styles.micHelperText}>{isListening ? 'Listening...' : (isProcessing ? 'Processing...' : 'Tap to Speak')}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Your transcribed task will appear here..."
            placeholderTextColor="#90adcb"
            value={taskText}
            onChangeText={setTaskText}
          />

          <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleTask}>
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalView: {
        backgroundColor: '#182430',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      headerText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
      },
      micContainer: {
        alignItems: 'center',
        marginVertical: 30,
      },
      micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0d7ff2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      },
      micHelperText: {
        color: '#90adcb',
        fontSize: 16,
      },
      input: {
        width: '100%',
        backgroundColor: '#101922',
        color: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
      },
      scheduleButton: {
        backgroundColor: '#0d7ff2',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
      },
      scheduleButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default AddTaskModal;