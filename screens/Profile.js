import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

const Profile = ({theme}) => {
  // =========================================
  // STATES
  // =========================================

  const [modalVisible, setModalVisible] = useState(false);

  // Profile Photo Popup
  const [photoPopupVisible, setPhotoPopupVisible] = useState(false);

  const [name, setName] = useState('Shruti');
  const [mobile, setMobile] = useState('+91 9876543210');
  const [email, setEmail] = useState('shruti@gmail.com');

  // Profile photo AsyncStorage मध्ये save होत नाही
  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD PROFILE DATA
  // =========================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile =
        await AsyncStorage.getItem('profileData');

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        setName(profile.name || 'Shruti');

        setMobile(
          profile.mobile || '+91 9876543210',
        );

        setEmail(
          profile.email || 'shruti@gmail.com',
        );
      }
    } catch (error) {
      console.log(
        'Error loading profile:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // OPEN PROFILE PHOTO POPUP
  // =========================================

  const changePhoto = () => {
    setPhotoPopupVisible(true);
  };

  // =========================================
  // OPEN CAMERA
  // =========================================

  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.8,
        saveToPhotos: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          'Error',
          result.errorMessage ||
            'Camera could not be opened.',
        );

        return;
      }

      if (
        result.assets &&
        result.assets.length > 0
      ) {
        setProfileImage(
          result.assets[0].uri,
        );
      }
    } catch (error) {
      console.log(
        'Camera error:',
        error,
      );

      Alert.alert(
        'Error',
        'Something went wrong while opening camera.',
      );
    }
  };

  // =========================================
  // OPEN GALLERY
  // =========================================

  const openGallery = async () => {
    try {
      const result =
        await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          'Error',
          result.errorMessage ||
            'Gallery could not be opened.',
        );

        return;
      }

      if (
        result.assets &&
        result.assets.length > 0
      ) {
        setProfileImage(
          result.assets[0].uri,
        );
      }
    } catch (error) {
      console.log(
        'Gallery error:',
        error,
      );

      Alert.alert(
        'Error',
        'Something went wrong while opening gallery.',
      );
    }
  };

  // =========================================
  // REMOVE PROFILE PHOTO
  // =========================================

  const removePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',

          onPress: () => {
            setProfileImage(null);

            setPhotoPopupVisible(false);
          },
        },
      ],
    );
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const saveProfile = async () => {
    try {
      const profileData = {
        name: name,
        mobile: mobile,
        email: email,
      };

      await AsyncStorage.setItem(
        'profileData',
        JSON.stringify(profileData),
      );

      setModalVisible(false);

      Alert.alert(
        'Success',
        'Profile updated successfully!',
      );
    } catch (error) {
      console.log(
        'Error saving profile:',
        error,
      );

      Alert.alert(
        'Error',
        'Profile save failed.',
      );
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme?.background ||
            '#FFFFFF',
        },
      ]}
    >

      {/* =================================
          PROFILE PHOTO
      ================================= */}

      <TouchableOpacity
        style={styles.profileIcon}
        onPress={changePhoto}
        activeOpacity={0.8}
      >

        {profileImage ? (
          <Image
            source={{
              uri: profileImage,
            }}
            style={styles.profileImage}
          />
        ) : (
          <Ionicons
            name="person"
            size={55}
            color="#635BFF"
          />
        )}

      </TouchableOpacity>

      {/* =================================
          CHANGE PHOTO BUTTON
      ================================= */}

      <TouchableOpacity
        style={styles.changePhotoButton}
        onPress={changePhoto}
      >

        <Ionicons
          name="camera-outline"
          size={20}
          color="#635BFF"
        />

        <Text
          style={styles.changePhotoText}
        >
          Change Photo
        </Text>

      </TouchableOpacity>

      {/* =================================
          TITLE
      ================================= */}

      <Text
        style={[
          styles.title,
          {
            color:
              theme?.text ||
              '#222222',
          },
        ]}
      >
        My Profile
      </Text>

      {/* =================================
          NAME
      ================================= */}

      <View style={styles.infoBox}>

        <Ionicons
          name="person-outline"
          size={22}
          color="#635BFF"
        />

        <View style={styles.infoText}>

          <Text style={styles.label}>
            Name
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  theme?.text ||
                  '#222222',
              },
            ]}
          >
            {name}
          </Text>

        </View>

      </View>

      {/* =================================
          MOBILE
      ================================= */}

      <View style={styles.infoBox}>

        <Ionicons
          name="call-outline"
          size={22}
          color="#635BFF"
        />

        <View style={styles.infoText}>

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  theme?.text ||
                  '#222222',
              },
            ]}
          >
            {mobile}
          </Text>

        </View>

      </View>

      {/* =================================
          EMAIL
      ================================= */}

      <View style={styles.infoBox}>

        <Ionicons
          name="mail-outline"
          size={22}
          color="#635BFF"
        />

        <View style={styles.infoText}>

          <Text style={styles.label}>
            Email
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  theme?.text ||
                  '#222222',
              },
            ]}
          >
            {email}
          </Text>

        </View>

      </View>

      {/* =================================
          EDIT PROFILE BUTTON
      ================================= */}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          setModalVisible(true)
        }
      >

        <Ionicons
          name="create-outline"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Edit Profile
        </Text>

      </TouchableOpacity>

      {/* =================================
          PROFILE PHOTO BOTTOM SHEET
      ================================= */}

      <Modal
        visible={photoPopupVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() =>
          setPhotoPopupVisible(false)
        }
      >

        <View
          style={styles.photoModalBackground}
        >

          {/* Background Overlay */}

          <TouchableOpacity
            style={styles.photoModalOverlay}
            activeOpacity={1}
            onPress={() =>
              setPhotoPopupVisible(false)
            }
          />

          {/* Bottom Sheet */}

          <View
            style={[
              styles.photoBottomSheet,
              {
                backgroundColor:
                  theme?.card ||
                  '#FFFFFF',
              },
            ]}
          >

            {/* Handle */}

            <View
              style={styles.sheetHandle}
            />

            {/* Title */}

            <Text
              style={[
                styles.photoPopupTitle,
                {
                  color:
                    theme?.text ||
                    '#222222',
                },
              ]}
            >
              Profile Photo
            </Text>

            <Text
              style={styles.photoPopupSubtitle}
            >
              Choose an option
            </Text>

            {/* Current Profile Photo */}

            <View
              style={
                styles.popupPhotoContainer
              }
            >

              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={
                    styles.popupProfileImage
                  }
                />
              ) : (
                <View
                  style={
                    styles.popupDefaultImage
                  }
                >

                  <Ionicons
                    name="person"
                    size={45}
                    color="#635BFF"
                  />

                </View>
              )}

            </View>

            {/* =================================
                TAKE PHOTO
            ================================= */}

            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => {
                setPhotoPopupVisible(false);

                openCamera();
              }}
            >

              <View
                style={styles.photoOptionIcon}
              >

                <Ionicons
                  name="camera-outline"
                  size={24}
                  color="#635BFF"
                />

              </View>

              <View
                style={styles.photoOptionText}
              >

                <Text
                  style={
                    styles.photoOptionTitle
                  }
                >
                  Take Photo
                </Text>

                <Text
                  style={
                    styles.photoOptionSubtitle
                  }
                >
                  Take a new photo using camera
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#999999"
              />

            </TouchableOpacity>

            {/* =================================
                GALLERY
            ================================= */}

            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => {
                setPhotoPopupVisible(false);

                openGallery();
              }}
            >

              <View
                style={styles.photoOptionIcon}
              >

                <Ionicons
                  name="images-outline"
                  size={24}
                  color="#635BFF"
                />

              </View>

              <View
                style={styles.photoOptionText}
              >

                <Text
                  style={
                    styles.photoOptionTitle
                  }
                >
                  Choose from Gallery
                </Text>

                <Text
                  style={
                    styles.photoOptionSubtitle
                  }
                >
                  Select a photo from your gallery
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#999999"
              />

            </TouchableOpacity>

            {/* =================================
                REMOVE PHOTO
            ================================= */}

            {profileImage && (
              <TouchableOpacity
                style={styles.photoOption}
                onPress={removePhoto}
              >

                <View
                  style={[
                    styles.photoOptionIcon,
                    styles.removeIcon,
                  ]}
                >

                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color="#E53935"
                  />

                </View>

                <View
                  style={styles.photoOptionText}
                >

                  <Text
                    style={[
                      styles.photoOptionTitle,
                      {
                        color: '#E53935',
                      },
                    ]}
                  >
                    Remove Photo
                  </Text>

                  <Text
                    style={
                      styles.photoOptionSubtitle
                    }
                  >
                    Remove your current profile photo
                  </Text>

                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#999999"
                />

              </TouchableOpacity>
            )}

            {/* =================================
                CANCEL
            ================================= */}

            <TouchableOpacity
              style={
                styles.cancelPhotoButton
              }
              onPress={() =>
                setPhotoPopupVisible(false)
              }
            >

              <Text
                style={styles.cancelPhotoText}
              >
                Cancel
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

      {/* =================================
          EDIT PROFILE MODAL
      ================================= */}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >

        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor:
                  theme?.card ||
                  '#FFFFFF',
              },
            ]}
          >

            {/* =================================
                MODAL HEADER
            ================================= */}

            <View
              style={styles.modalHeader}
            >

              <Text
                style={[
                  styles.modalTitle,
                  {
                    color:
                      theme?.text ||
                      '#222222',
                  },
                ]}
              >
                Edit Profile
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setModalVisible(false)
                }
              >

                <Ionicons
                  name="close"
                  size={28}
                  color={
                    theme?.text ||
                    '#222222'
                  }
                />

              </TouchableOpacity>

            </View>

            {/* =================================
                NAME
            ================================= */}

            <Text
              style={styles.inputLabel}
            >
              Name
            </Text>

            <View
              style={styles.inputContainer}
            >

              <Ionicons
                name="person-outline"
                size={20}
                color="#635BFF"
              />

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999999"
              />

            </View>

            {/* =================================
                MOBILE
            ================================= */}

            <Text
              style={styles.inputLabel}
            >
              Mobile Number
            </Text>

            <View
              style={styles.inputContainer}
            >

              <Ionicons
                name="call-outline"
                size={20}
                color="#635BFF"
              />

              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter mobile number"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
              />

            </View>

            {/* =================================
                EMAIL
            ================================= */}

            <Text
              style={styles.inputLabel}
            >
              Email
            </Text>

            <View
              style={styles.inputContainer}
            >

              <Ionicons
                name="mail-outline"
                size={20}
                color="#635BFF"
              />

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
              />

            </View>

            {/* =================================
                SAVE PROFILE
            ================================= */}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveProfile}
            >

              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#FFFFFF"
              />

              <Text
                style={styles.saveButtonText}
              >
                Save Profile
              </Text>

            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>

      </Modal>

    </View>
  );
};

// =========================================
// STYLES
// =========================================

const styles = StyleSheet.create({

  // =======================================
  // MAIN PROFILE
  // =======================================

  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },

  profileIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    overflow: 'hidden',
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },

  changePhotoText: {
    marginLeft: 8,
    fontSize: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 25,
  },

  // =======================================
  // PROFILE INFORMATION
  // =======================================

  infoBox: {
    width: '88%',
    minHeight: 65,
    borderRadius: 12,
    backgroundColor: '#F8F8FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },

  infoText: {
    marginLeft: 15,
  },

  label: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
  },

  // =======================================
  // EDIT PROFILE BUTTON
  // =======================================

  button: {
    marginTop: 20,
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#635BFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // =======================================
  // PROFILE PHOTO BOTTOM SHEET
  // =======================================

  photoModalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  photoModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  photoBottomSheet: {
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
  },

  sheetHandle: {
    width: 45,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#D5D5D5',
    alignSelf: 'center',
    marginBottom: 20,
  },

  photoPopupTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  photoPopupSubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 18,
  },

  popupPhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  popupProfileImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },

  popupDefaultImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoOption: {
    width: '100%',
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  photoOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeIcon: {
    backgroundColor: '#FFEEEE',
  },

  photoOptionText: {
    flex: 1,
    marginLeft: 14,
  },

  photoOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },

  photoOptionSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  cancelPhotoButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  cancelPhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
  },

  // =======================================
  // EDIT PROFILE MODAL
  // =======================================

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  inputLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 6,
    marginTop: 8,
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 5,
  },

  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#222222',
  },

  saveButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#635BFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

});

export default Profile;