import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Task, updateTask, deleteTask } from '../services/storageService';
import { notificationService } from '../services/notificationService';

interface Props {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate: () => void;
}

const TaskDetailsModal = ({ visible, onClose, task, onTaskUpdate }: Props) => {
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    if (task) {
      setTaskText(task.title);
    }
  }, [task]);

  if (!task) return null;

  const handleSaveChanges = async () => {
    if (taskText.trim() === '') return;
    const updated = { ...task, title: taskText };
    await updateTask(updated);
    onTaskUpdate();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (task.notificationId) {
              notificationService.cancelNotification(task.notificationId);
            }
            await deleteTask(task.id);
            onTaskUpdate();
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
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
            <Text style={styles.headerText}>Edit Task</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={taskText}
            onChangeText={setTaskText}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
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
      input: {
        width: '100%',
        backgroundColor: '#101922',
        color: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
      },
      saveButton: {
        backgroundColor: '#0d7ff2',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
      },
      saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      deleteButton: {
        backgroundColor: '#f44336',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
      },
      deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default TaskDetailsModal;