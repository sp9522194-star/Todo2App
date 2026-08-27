import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import { Fonts } from '../theme/font';
import { FontSize } from '../theme/size';

function BottomSheet({
  visible,
  onClose,
  onView,
  onEdit,
  onDelete,
  theme,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>

        <Pressable
          style={styles.background}
          onPress={onClose}
        />

       
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
            },
          ]}
        >

       
          <View style={styles.handle} />

          <Text
            style={[
              styles.title,
              {
                color: theme.text,
              },
            ]}
          >
            Task Options
          </Text>

         
          <TouchableOpacity
            style={styles.option}
            onPress={onView}
            activeOpacity={0.7}
          >
            <Ionicons
              name="eye-outline"
              size={24}
              color={theme.text}
            />

            <Text
              style={[
                styles.optionText,
                {
                  color: theme.text,
                },
              ]}
            >
              View Details
            </Text>
          </TouchableOpacity>

          
          <TouchableOpacity
            style={styles.option}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={theme.text}
            />

            <Text
              style={[
                styles.optionText,
                {
                  color: theme.text,
                },
              ]}
            >
              Edit Task
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color="#E53935"
            />

            <Text
              style={[
                styles.optionText,
                {
                  color: '#E53935',
                },
              ]}
            >
              Delete Task
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  handle: {
    width: 45,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#AAAAAA',
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.title,
    marginBottom: 15,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 15,
  },

  optionText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.medium,
  },

  cancelButton: {
    marginTop: 10,
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontSize: FontSize.medium,
  },
});

export default BottomSheet;