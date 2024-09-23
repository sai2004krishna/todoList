import React, { useState, useEffect } from 'react';
import { Keyboard, ScrollView, TouchableOpacity, Button, View } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/Task';

const Container = styled.View`
  flex: 1;
  background-color: #1E3A8A;
  padding-horizontal: 20px;
`;

const Header = styled.View`
  padding-top: 60px;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #FFFFFF;
`;

const ClearBtn = styled.TouchableOpacity`
  background-color: #F59E0B;
  padding: 10px 15px;
  border-radius: 5px;
`;

const ClearBtnText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
`;

const TasksContainer = styled.View`
  margin-top: 20px;
`;

const TaskInputWrapper = styled.View`
  position: absolute;
  bottom: 60px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 20px;
`;

const Input = styled.TextInput`
  padding: 15px;
  background-color: #F3F4F6;
  border-radius: 60px;
  border: 1px solid #93C5FD;
  flex: 1;
  margin-right: 10px;
  color: #374151;
`;

const AddButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: #F59E0B;
  border-radius: 60px;
  justify-content: center;
  align-items: center;
`;

const AddButtonText = styled.Text`
  font-size: 24px;
  color: #FFFFFF;
`;

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) setTasks(JSON.parse(saved));
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  
  const addTask = () => {
    if (task.trim()) {
      Keyboard.dismiss();
      setTasks([...tasks, { text: task, done: false }]);
      setTask('');
    }
  };

 
  const toggleTask = (index) => {
    let updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

 
  const clearAll = () => setTasks([]);

 
  const displayedTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return filter === 'Completed' ? task.done : !task.done;
  });

  return (
    <Container>
      <Header>
        <Title>Today's tasks</Title>
        <ClearBtn onPress={clearAll}>
          <ClearBtnText>Clear All</ClearBtnText>
        </ClearBtn>
      </Header>

      <ScrollView>
        <TasksContainer>
          {displayedTasks.map((task, index) => (
            <TouchableOpacity key={index} onPress={() => toggleTask(index)}>
              <Task text={task.text} done={task.done} />
            </TouchableOpacity>
          ))}
        </TasksContainer>
      </ScrollView>

      <TaskInputWrapper>
        <Input
          placeholder="Write a task"
          placeholderTextColor="#9CA3AF"
          value={task}
          onChangeText={setTask}
        />
        <AddButton onPress={addTask}>
          <AddButtonText>+</AddButtonText>
        </AddButton>
      </TaskInputWrapper>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 10 }}>
        <Button title="All" color="#93C5FD" onPress={() => setFilter('All')} />
        <Button title="Completed" color="#14B8A6" onPress={() => setFilter('Completed')} />
        <Button title="Pending" color="#F59E0B" onPress={() => setFilter('Pending')} />
      </View>
    </Container>
  );
}
