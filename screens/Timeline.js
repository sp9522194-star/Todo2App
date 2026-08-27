import React, { useState, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import { Fonts } from '../src/theme/font';
import { FontSize } from '../src/theme/size';

function Timeline({ navigation, route, theme }) {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);

  const tasks = route.params?.tasks || [];

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getDays = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);

      date.setDate(startDate.getDate() + i);

      days.push({
        day: date.toLocaleDateString('en-US', {
          weekday: 'short',
        }),
        date: date.getDate(),
        fullDate: formatDate(date),
      });
    }

    return days;
  };

  const days = getDays();

  const nextDates = () => {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + 7);

    setStartDate(date);
    setSelectedDate(0);
  };

  const previousDates = () => {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() - 7);

    setStartDate(date);
    setSelectedDate(0);
  };

  const selectedFullDate = days[selectedDate]?.fullDate;

  const filteredTasks = tasks.filter(
    (item) => item.date === selectedFullDate
  );

  const toggleTask = (index) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(
        completedTasks.filter(
          (item) => item !== index
        )
      );
    } else {
      setCompletedTasks([
        ...completedTasks,
        index,
      ]);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="time-outline"
            size={28}
            color={theme.text}
          />

          <Text
            style={[
              styles.title,
              {
                color: theme.text,
              },
            ]}
          >
            Timeline
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('Todo List')
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.addText}>
            Add Task
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateSection}>
        <TouchableOpacity
          style={[
            styles.smallArrow,
            {
              backgroundColor: theme.card,
            },
          ]}
          onPress={previousDates}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#635BFF"
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {days.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayBox,
                {
                  backgroundColor: theme.card,
                },
                selectedDate === index &&
                  styles.selectedDay,
              ]}
              onPress={() =>
                setSelectedDate(index)
              }
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: theme.text,
                  },
                  selectedDate === index &&
                    styles.selectedDayText,
                ]}
              >
                {item.day}
              </Text>

              <Text
                style={[
                  styles.dateText,
                  {
                    color: theme.text,
                  },
                  selectedDate === index &&
                    styles.selectedDateText,
                ]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.smallArrow,
            {
              backgroundColor: theme.card,
            },
          ]}
          onPress={nextDates}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#635BFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.taskScroll}
        contentContainerStyle={styles.taskContent}
        showsVerticalScrollIndicator={true}
      >
        {filteredTasks.length === 0 ? (
          <View
            style={[
              styles.noTaskBox,
              {
                backgroundColor: theme.card,
              },
            ]}
          >
            <Ionicons
              name="clipboard-outline"
              size={45}
              color={theme.text}
            />

            <Text
              style={[
                styles.noTaskText,
                {
                  color: theme.text,
                },
              ]}
            >
              No tasks added for this date
            </Text>
          </View>
        ) : (
          filteredTasks.map((item, index) => (
            <AnimatedTask
              key={index}
              item={item}
              index={index}
              completed={completedTasks.includes(index)}
              onToggle={() =>
                toggleTask(index)
              }
              isLast={
                index ===
                filteredTasks.length - 1
              }
              theme={theme}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function AnimatedTask({
  item,
  index,
  completed,
  onToggle,
  isLast,
  theme,
}) {
  const slideAnimation = useRef(
    new Animated.Value(30)
  ).current;

  const fadeAnimation = useRef(
    new Animated.Value(0)
  ).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(
        slideAnimation,
        {
          toValue: 0,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        fadeAnimation,
        {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.taskRow,
        {
          opacity: fadeAnimation,
          transform: [
            {
              translateY: slideAnimation,
            },
          ],
        },
      ]}
    >
      <View style={styles.timeline}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              backgroundColor: theme.card,
            },
            completed &&
              styles.completedCheckbox,
          ]}
          onPress={onToggle}
        >
          {completed ? (
            <Ionicons
              name="checkmark"
              size={19}
              color="#FFFFFF"
            />
          ) : (
            <Ionicons
              name="ellipse-outline"
              size={20}
              color="#635BFF"
            />
          )}
        </TouchableOpacity>

        {!isLast && (
          <View style={styles.line} />
        )}
      </View>

      <View
        style={[
          styles.taskCard,
          {
            backgroundColor: theme.card,
          },
          completed &&
            styles.completedCard,
        ]}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.text}
            />

            <Text
              style={[
                styles.taskTitle,
                {
                  color: theme.text,
                },
                completed &&
                  styles.completedText,
              ]}
            >
              {item.name}
            </Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={theme.text}
            />

            <Text
              style={[
                styles.time,
                {
                  color: theme.text,
                },
              ]}
            >
              {item.date}
            </Text>
          </View>
        </View>

        <View style={styles.employeeRow}>
          <Ionicons
            name="person-outline"
            size={16}
            color={theme.text}
          />

          <Text
            style={[
              styles.employee,
              {
                color: theme.text,
              },
            ]}
          >
            {item.employee}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.heading,
  },

  addButton: {
    backgroundColor: '#635BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  addText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: FontSize.small,
  },

  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  smallArrow: {
    width: 32,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  daysContainer: {
    paddingHorizontal: 5,
  },

  dayBox: {
    width: 55,
    height: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },

  selectedDay: {
    backgroundColor: '#E9E5FF',
  },

  dayText: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.small,
  },

  selectedDayText: {
    color: '#635BFF',
    fontFamily: Fonts.bold,
  },

  dateText: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.medium,
    marginTop: 5,
  },

  selectedDateText: {
    color: '#635BFF',
  },

  taskScroll: {
    flex: 1,
  },

  taskContent: {
    paddingBottom: 30,
  },

  taskRow: {
    flexDirection: 'row',
    minHeight: 90,
  },

  timeline: {
    width: 40,
    alignItems: 'center',
  },

  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#635BFF',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 2,
  },

  completedCheckbox: {
    backgroundColor: '#635BFF',
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E05B7A',
    marginTop: 2,
  },

  taskCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },

  completedCard: {
    backgroundColor: '#b9a8b4',
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },

  taskTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.medium,
    flex: 1,
  },

  completedText: {
    textDecorationLine: 'line-through',
    color: '#777',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  time: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.small,
    marginLeft: 5,
  },

  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 7,
  },

  employee: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.normal,
  },

  noTaskBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  noTaskText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.normal,
    marginTop: 10,
  },
});

export default Timeline;