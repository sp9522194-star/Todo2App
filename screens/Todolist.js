import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import DateTimePicker from '@react-native-community/datetimepicker';

import Ionicons from '@react-native-vector-icons/ionicons';

import {Fonts} from '../src/theme/font';
import {FontSize} from '../src/theme/size';

import BottomSheet from '../src/components/BottomSheet';

const TASKS_STORAGE_KEY = '@todo_tasks';

function Todolist({navigation, theme}) {
  const [employeeName, setEmployeeName] = useState('shruti');
  const [taskName, setTaskName] = useState('');
  const [date, setDate] = useState('');

  const [employeeError, setEmployeeError] = useState('');
  const [taskError, setTaskError] = useState('');
  const [dateError, setDateError] = useState('');

  const [tasks, setTasks] = useState([]);

  // SEARCH
  const [searchText, setSearchText] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [validationPopup, setValidationPopup] =
    useState(false);

  const [validationMessage, setValidationMessage] =
    useState('');

  const [showBottomSheet, setShowBottomSheet] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [selectedTaskIndex, setSelectedTaskIndex] =
    useState(null);

  const [editingIndex, setEditingIndex] =
    useState(null);

  const [popupType, setPopupType] =
    useState('add');

  // ==================================================
  // LOAD TASKS
  // ==================================================

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks =
        await AsyncStorage.getItem(
          TASKS_STORAGE_KEY,
        );

      if (savedTasks !== null) {
        const parsedTasks =
          JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }
    } catch (error) {
      console.log(
        'Error loading tasks:',
        error,
      );

      Alert.alert(
        'Error',
        'Tasks could not be loaded.',
      );
    }
  };

  // ==================================================
  // SAVE TASKS
  // ==================================================

  const saveTasks = async updatedTasks => {
    try {
      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(updatedTasks),
      );

      return true;
    } catch (error) {
      console.log(
        'Error saving tasks:',
        error,
      );

      Alert.alert(
        'Storage Error',
        'Task could not be saved.',
      );

      return false;
    }
  };

  // ==================================================
  // DATE PICKER
  // ==================================================

  const onDateChange = (
    _event,
    selectedDate,
  ) => {
    setShowCalendar(false);

    if (selectedDate) {
      setDate(
        selectedDate.toLocaleDateString(),
      );

      setDateError('');

      Keyboard.dismiss();
    }
  };

  // ==================================================
  // OPEN TASK OPTIONS
  // ==================================================

  const openTaskOptions = (
    task,
    index,
  ) => {
    Keyboard.dismiss();

    setSelectedTask(task);
    setSelectedTaskIndex(index);

    setShowBottomSheet(true);
  };

  // ==================================================
  // ADD / UPDATE TASK
  // ==================================================

  const addTask = async () => {
    try {
      Keyboard.dismiss();

      // EMPLOYEE VALIDATION
      if (employeeName.trim() === '') {
        setEmployeeError(
          'Please enter employee name',
        );

        setValidationMessage(
          'Please enter employee name',
        );

        setValidationPopup(true);

        return;
      }

      // TASK VALIDATION
      if (taskName.trim() === '') {
        setTaskError(
          'Please enter task name',
        );

        setValidationMessage(
          'Please enter task name',
        );

        setValidationPopup(true);

        return;
      }

      // DATE VALIDATION
      if (date === '') {
        setDateError(
          'Please select task date',
        );

        setValidationMessage(
          'Please select task date',
        );

        setValidationPopup(true);

        return;
      }

      setEmployeeError('');
      setTaskError('');
      setDateError('');

      const updatedTask = {
        name: taskName.trim(),
        employee: employeeName.trim(),
        date: date,
      };

      // =================================================
      // UPDATE TASK
      // =================================================

      if (editingIndex !== null) {
        const updatedTasks = [...tasks];

        updatedTasks[editingIndex] =
          updatedTask;

        const saved =
          await saveTasks(updatedTasks);

        if (!saved) {
          return;
        }

        setTasks(updatedTasks);

        setPopupType('edit');

        setEditingIndex(null);

        setTaskName('');

        setDate('');

        setShowPopup(true);

        return;
      }

      // =================================================
      // ADD NEW TASK
      // =================================================

      const updatedTasks = [
        ...tasks,
        updatedTask,
      ];

      const saved =
        await saveTasks(updatedTasks);

      if (!saved) {
        return;
      }

      setTasks(updatedTasks);

      setTaskName('');

      setDate('');

      setPopupType('add');

      setShowPopup(true);

    } catch (error) {
      console.log(
        'Add/Update Task Error:',
        error,
      );

      Alert.alert(
        'Error',
        'Something went wrong while saving the task.',
      );
    }
  };

  // ==================================================
  // VIEW TASK
  // ==================================================

  const viewTask = () => {
    try {
      setShowBottomSheet(false);

      if (!selectedTask) {
        return;
      }

      Alert.alert(
        'Task Details',
        `Task: ${selectedTask.name}\nEmployee: ${selectedTask.employee}\nDate: ${selectedTask.date}`,
        [
          {
            text: 'OK',
          },
        ],
      );
    } catch (error) {
      console.log(
        'View Task Error:',
        error,
      );

      Alert.alert(
        'Error',
        'Task details could not be displayed.',
      );
    }
  };

  // ==================================================
  // EDIT TASK
  // ==================================================

  const editTask = () => {
    try {
      setShowBottomSheet(false);

      if (!selectedTask) {
        return;
      }

      if (selectedTaskIndex === null) {
        return;
      }

      setEmployeeName(
        selectedTask.employee,
      );

      setTaskName(
        selectedTask.name,
      );

      setDate(
        selectedTask.date,
      );

      setEditingIndex(
        selectedTaskIndex,
      );

      setEmployeeError('');
      setTaskError('');
      setDateError('');

      Keyboard.dismiss();

    } catch (error) {
      console.log(
        'Edit Task Error:',
        error,
      );

      Alert.alert(
        'Error',
        'Task could not be edited.',
      );
    }
  };

  // ==================================================
  // DELETE TASK
  // ==================================================

  const deleteTask = () => {
    setShowBottomSheet(false);

    if (selectedTaskIndex === null) {
      Alert.alert(
        'Error',
        'No task selected.',
      );

      return;
    }

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              const updatedTasks =
                tasks.filter(
                  (_, index) =>
                    index !==
                    selectedTaskIndex,
                );

              const saved =
                await saveTasks(
                  updatedTasks,
                );

              if (!saved) {
                return;
              }

              setTasks(updatedTasks);

              setSelectedTask(null);

              setSelectedTaskIndex(null);

            } catch (error) {
              console.log(
                'Delete Task Error:',
                error,
              );

              Alert.alert(
                'Error',
                'Task could not be deleted.',
              );
            }
          },
        },
      ],
    );
  };

  // ==================================================
  // OPEN APP
  // ==================================================

  const openApp = async () => {
    try {
      await Linking.openURL(
        'https://www.youtube.com',
      );
    } catch (error) {
      console.log(
        'Open App Error:',
        error,
      );

      Alert.alert(
        'Error',
        'App could not be opened.',
      );
    }
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const filteredTasks = tasks.filter(task => {
    const search =
      searchText.toLowerCase().trim();

    return (
      task.name
        ?.toLowerCase()
        .includes(search) ||
      task.employee
        ?.toLowerCase()
        .includes(search) ||
      task.date
        ?.toLowerCase()
        .includes(search)
    );
  });

  // ==================================================
  // RENDER TASK
  // ==================================================

  const renderTask = ({
    item,
    index,
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          openTaskOptions(
            item,
            index,
          )
        }>

        <View
          style={[
            styles.taskCard,
            {
              backgroundColor:
                theme.card,
            },
          ]}>

          {/* TASK NAME */}

          <View style={styles.taskRow}>

            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={theme.text}
            />

            <Text
              style={[
                styles.taskName,
                {
                  color: theme.text,
                },
              ]}>
              {item.name}
            </Text>

            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={theme.text}
            />

          </View>

          {/* EMPLOYEE */}

          <View style={styles.infoRow}>

            <Ionicons
              name="person-outline"
              size={18}
              color={theme.text}
            />

            <Text
              style={[
                styles.taskInfo,
                {
                  color: theme.text,
                },
              ]}>
              Employee: {item.employee}
            </Text>

          </View>

          {/* DATE */}

          <View style={styles.infoRow}>

            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.text}
            />

            <Text
              style={[
                styles.taskInfo,
                {
                  color: theme.text,
                },
              ]}>
              Date: {item.date}
            </Text>

          </View>

        </View>

      </TouchableOpacity>
    );
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }>

        <View
          style={[
            styles.container,
            {
              backgroundColor:
                theme.background,
            },
          ]}>

          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.headerRow}>

            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}>
             
            My Tasks
            </Text>

            <TouchableOpacity
              style={styles.openAppButton}
              onPress={openApp}
              activeOpacity={0.7}>

              <Ionicons
                name="open-outline"
                size={16}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.openAppText
                }>
                Open App
              </Text>

            </TouchableOpacity>

          </View>

          {/* =================================================
              EMPLOYEE
          ================================================= */}

          <View style={styles.labelRow}>

            <Ionicons
              name="person-outline"
              size={20}
              color={theme.text}
            />

            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}>
              Employee Name
            </Text>

          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  theme.card,
                color: theme.text,
                borderColor:
                  employeeError !== ''
                    ? '#E53935'
                    : '#DDD',
              },
            ]}
            placeholder="Enter employee name"
            placeholderTextColor="#999"
            value={employeeName}
            onChangeText={text => {
              setEmployeeName(text);

              if (
                text.trim() !== ''
              ) {
                setEmployeeError('');
              }
            }}
          />

          {employeeError !== '' && (
            <Text
              style={
                styles.errorText
              }>
              {employeeError}
            </Text>
          )}

          {/* =================================================
              TASK NAME
          ================================================= */}

          <View style={styles.labelRow}>

            <Ionicons
              name="create-outline"
              size={20}
              color={theme.text}
            />

            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}>
              Task Name
            </Text>

          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  theme.card,
                color: theme.text,
                borderColor:
                  taskError !== ''
                    ? '#E53935'
                    : '#DDD',
              },
            ]}
            placeholder="Enter task name"
            placeholderTextColor="#999"
            value={taskName}
            onChangeText={text => {
              setTaskName(text);

              if (
                text.trim() !== ''
              ) {
                setTaskError('');
              }
            }}
          />

          {taskError !== '' && (
            <Text
              style={
                styles.errorText
              }>
              {taskError}
            </Text>
          )}

          {/* =================================================
              DATE
          ================================================= */}

          <View style={styles.labelRow}>

            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.text}
            />

            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}>
              Task Date
            </Text>

          </View>

          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor:
                  theme.card,
                borderColor:
                  dateError !== ''
                    ? '#E53935'
                    : '#DDD',
              },
            ]}
            onPress={() => {
              Keyboard.dismiss();
              setShowCalendar(true);
            }}>

            <View
              style={
                styles.dateRow
              }>

              <Ionicons
                name="calendar"
                size={20}
                color={theme.text}
              />

              <Text
                style={[
                  styles.dateText,
                  {
                    color: theme.text,
                  },
                ]}>
                {date ||
                  'Select Date'}
              </Text>

            </View>

          </TouchableOpacity>

          {dateError !== '' && (
            <Text
              style={
                styles.errorText
              }>
              {dateError}
            </Text>
          )}

          {showCalendar && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="calendar"
              onChange={
                onDateChange
              }
            />
          )}

          {/* =================================================
              ADD BUTTON
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor:
                  theme.button,
              },
            ]}
            onPress={addTask}>

            <Ionicons
              name={
                editingIndex !== null
                  ? 'checkmark-circle-outline'
                  : 'add-circle-outline'
              }
              size={23}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.addButtonText
              }>
              {editingIndex !== null
                ? 'Update Task'
                : 'Add Task'}
            </Text>

          </TouchableOpacity>

          {/* =================================================
              SEARCH BAR
          ================================================= */}

          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor:
                  theme.card,
              },
            ]}>

            <Ionicons
              name="search-outline"
              size={25}
              color={theme.text}
            />

            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                },
              ]}
              placeholder="Search tasks..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={
                setSearchText
              }
            />

            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  setSearchText('')
                }>

                <Ionicons
                  name="close-circle"
                  size={22}
                  color={theme.text}
                />

              </TouchableOpacity>
            )}

          </View>

          {/* =================================================
              YOUR TASKS
          ================================================= */}

          <View
            style={
              styles.taskListHeader
            }>

            <Ionicons
              name="list-outline"
              size={25}
              color={theme.text}
            />

            <Text
              style={[
                styles.taskListTitle,
                {
                  color: theme.text,
                },
              ]}>
              Your Tasks
            </Text>

          </View>

          {/* =================================================
              FLATLIST
          ================================================= */}

          <FlatList
            style={styles.taskList}
            data={filteredTasks}
            keyExtractor={(
              item,
              index,
            ) =>
              index.toString()
            }
            renderItem={renderTask}
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.listContainer,

              filteredTasks.length ===
                0 &&
                styles.emptyList,
            ]}
            ListEmptyComponent={
              <View
                style={
                  styles.emptyContainer
                }>

                <Ionicons
                  name={
                    searchText.length > 0
                      ? 'search-outline'
                      : 'clipboard-outline'
                  }
                  size={45}
                  color={theme.text}
                />

                <Text
                  style={[
                    styles.emptyText,
                    {
                      color:
                        theme.text,
                    },
                  ]}>

                  {searchText.length > 0
                    ? 'No matching tasks found.'
                    : 'No tasks added yet.'}

                </Text>

              </View>
            }
          />

          {/* =================================================
              VALIDATION POPUP
          ================================================= */}

          <Modal
            visible={
              validationPopup
            }
            transparent={true}
            animationType="fade"
            onRequestClose={() =>
              setValidationPopup(
                false,
              )
            }>

            <View
              style={
                styles.popupBackground
              }>

              <View
                style={[
                  styles.popupBox,
                  {
                    backgroundColor:
                      theme.card,
                  },
                ]}>

                <Ionicons
                  name="alert-circle"
                  size={55}
                  color="#E53935"
                />

                <Text
                  style={[
                    styles.popupTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}>
                  Form Validation
                </Text>

                <View
                  style={
                    styles.popupLine
                  }
                />

                <Text
                  style={[
                    styles.popupMessage,
                    {
                      color:
                        theme.text,
                    },
                  ]}>
                  {validationMessage}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.popupButton,
                    {
                      backgroundColor:
                        '#E53935',
                    },
                  ]}
                  onPress={() =>
                    setValidationPopup(
                      false,
                    )
                  }>

                  <Text
                    style={
                      styles.popupButtonText
                    }>
                    OK
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          </Modal>

          {/* =================================================
              SUCCESS POPUP
          ================================================= */}

          <Modal
            visible={showPopup}
            transparent={true}
            animationType="fade"
            onRequestClose={() =>
              setShowPopup(false)
            }>

            <View
              style={
                styles.popupBackground
              }>

              <View
                style={[
                  styles.popupBox,
                  {
                    backgroundColor:
                      theme.card,
                  },
                ]}>

                <Ionicons
                  name="checkmark-circle"
                  size={55}
                  color="#4CAF50"
                />

                <Text
                  style={[
                    styles.popupTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}>
                  {popupType ===
                  'edit'
                    ? 'Task Updated Successfully!'
                    : 'Task Added Successfully!'}
                </Text>

                <View
                  style={
                    styles.popupLine
                  }
                />

                <Text
                  style={[
                    styles.popupMessage,
                    {
                      color:
                        theme.text,
                    },
                  ]}>
                  {popupType ===
                  'edit'
                    ? 'Your task has been updated.'
                    : 'Your task has been added\n' +
                      'to the To-Do List.'}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.popupButton,
                    {
                      backgroundColor:
                        theme.button,
                    },
                  ]}
                  onPress={() =>
                    setShowPopup(false)
                  }>

                  <Text
                    style={
                      styles.popupButtonText
                    }>
                    Great!
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          </Modal>

          {/* =================================================
              BOTTOM SHEET
          ================================================= */}

          <BottomSheet
            visible={
              showBottomSheet
            }
            theme={theme}
            onClose={() => {
              setShowBottomSheet(
                false,
              );
            }}
            onView={viewTask}
            onEdit={editTask}
            onDelete={deleteTask}
          />

        </View>

      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  // ==================================================
  // HEADER
  // ==================================================

  headerRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },

  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.heading,
    flex: 1,
  },

  openAppButton: {
    backgroundColor: '#635BFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  openAppText: {
    color: '#FFFFFF',
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.small,
  },

  // ==================================================
  // LABEL
  // ==================================================

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
    marginBottom: 7,
  },

  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.medium,
  },

  // ==================================================
  // INPUT
  // ==================================================

  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSize.medium,
    justifyContent: 'center',
  },

  errorText: {
    color: '#E53935',
    fontFamily: Fonts.regular,
    fontSize: FontSize.small,
    marginTop: 5,
    marginLeft: 5,
  },

  // ==================================================
  // DATE
  // ==================================================

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  dateText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.medium,
  },

  // ==================================================
  // ADD BUTTON
  // ==================================================

  addButton: {
    height: 52,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    gap: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: FontSize.large,
  },

  // ==================================================
  // SEARCH
  // ==================================================

  searchContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 15,
    marginBottom: 5,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts.regular,
    fontSize: FontSize.normal,
  },

  // ==================================================
  // TASK LIST HEADER
  // ==================================================

  taskListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
    marginBottom: 8,
  },

  taskListTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.large,
  },

  // ==================================================
  // FLATLIST
  // ==================================================

  taskList: {
    flex: 1,
  },

  listContainer: {
    paddingTop: 5,
    paddingBottom: 120,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.medium,
    opacity: 0.6,
    marginTop: 10,
    textAlign: 'center',
  },

  // ==================================================
  // TASK CARD
  // ==================================================

  taskCard: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  taskName: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.large,
    flex: 1,
    marginLeft: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  taskInfo: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.normal,
    marginLeft: 8,
  },

  // ==================================================
  // POPUP
  // ==================================================

  popupBackground: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupBox: {
    width: '78%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },

  popupTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.large,
    textAlign: 'center',
    marginTop: 10,
  },

  popupLine: {
    width: '90%',
    height: 1,
    backgroundColor: '#D9B7E8',
    marginTop: 15,
    marginBottom: 15,
  },

  popupMessage: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.normal,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 22,
  },

  popupButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  popupButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: FontSize.medium,
  },
});

export default Todolist;