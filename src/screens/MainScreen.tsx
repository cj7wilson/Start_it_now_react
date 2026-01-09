import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { useNavigation } from '@react-navigation/native';
import { getTasks, Task } from '../services/storageService';

const MainScreen = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await getTasks();
      if (storedTasks.length === 0) {
        const mockTasks = [
          { id: '1', title: 'Draft quarterly report', time: '2:00 PM', status: 'Pending', icon: 'assignment' },
          { id: '2', title: 'Call with Gemini team', time: '4:30 PM', status: 'Zoom', icon: 'call' },
          { id: '3', title: 'Buy groceries', time: '6:00 PM', status: 'Completed', icon: 'shopping-cart' },
          { id: '4', title: 'Morning Gym', time: 'Tomorrow 7:00 AM', status: '', icon: 'fitness-center' },
        ];
        setTasks(mockTasks);
      } else {
        setTasks(storedTasks);
      }
    };
    loadTasks();
  }, []);

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsModalVisible(true);
  };

  const getIconColor = (icon: string) => {
    switch (icon) {
      case 'assignment': return '#0d7ff2';
      case 'call': return '#9c27b0';
      case 'shopping-cart': return '#4caf50';
      default: return '#90adcb';
    }
  };

  const getIconBackgroundColor = (icon: string) => {
    switch (icon) {
      case 'assignment': return 'rgba(13, 127, 242, 0.1)';
      case 'call': return 'rgba(156, 39, 176, 0.1)';
      case 'shopping-cart': return 'rgba(76, 175, 80, 0.1)';
      default: return 'rgba(144, 173, 203, 0.1)';
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskItem} onPress={() => openTaskDetails(item)}>
      <View style={[styles.taskIconContainer, { backgroundColor: getIconBackgroundColor(item.icon) }]}>
        <Icon name={item.icon} size={24} color={getIconColor(item.icon)} />
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskTimeContainer}>
          <Icon name="schedule" size={14} color="#90adcb" />
          <Text style={styles.taskTime}>{item.time}</Text>
        </View>
      </View>
      {item.status ? (
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(13, 127, 242, 0.1)' }]}>
          <Text style={[styles.statusText, { color: item.status === 'Pending' ? '#ff9800' : '#0d7ff2' }]}>{item.status}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101922" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StartNow</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color="#90adcb" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.dateHeader}>Today</Text>
        {tasks.filter(t => !t.time.startsWith('Tomorrow')).map(task => renderTaskItem({ item: task }))}

        <Text style={styles.dateHeader}>Tomorrow</Text>
        {tasks.filter(t => t.time.startsWith('Tomorrow')).map(task => renderTaskItem({ item: task }))}

        <Text style={styles.dateHeader}>Overdue</Text>
        <View style={styles.overdueContainer}>
            <View style={styles.overdueIconContainer}>
                <Icon name="check-circle" size={32} color="#4caf50" />
            </View>
            <Text style={styles.overdueTitle}>All caught up!</Text>
            <Text style={styles.overdueSubtitle}>You have no overdue tasks pending.</Text>
        </View>

      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Icon name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
      <AddTaskModal visible={isAddModalVisible} onClose={() => setAddModalVisible(false)} />
      <TaskDetailsModal visible={isDetailsModalVisible} onClose={() => setDetailsModalVisible(false)} task={selectedTask} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101922',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    settingsButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    scrollView: {
        paddingHorizontal: 16,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#90adcb',
        marginTop: 24,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#182430',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    taskIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    taskTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    taskTime: {
        fontSize: 14,
        color: '#90adcb',
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    overdueContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    overdueIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    overdueTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    overdueSubtitle: {
        fontSize: 14,
        color: '#90adcb',
        textAlign: 'center',
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#0d7ff2',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#0d7ff2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default MainScreen;