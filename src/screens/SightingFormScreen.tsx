import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { addSighting, getBreeds } from '../services/Database';
import { COLORS, SPACING } from '../utils/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { v4 as uuidv4 } from 'uuid';
import { Breed } from '../types';
import BreedSelectModal from '../components/BreedSelectModal';

const SightingFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { preselectedBreedId } = route.params || {};

    const [dogName, setDogName] = useState('');
    const [notes, setNotes] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [selectedBreedId, setSelectedBreedId] = useState<string | null>(preselectedBreedId || null);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [location, setLocation] = useState<{ lat: number, long: number } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        loadBreeds();
    }, []);

    const loadBreeds = async () => {
        const data = await getBreeds();
        setBreeds(data);
    };

    const handlePhoto = async (type: 'camera' | 'library') => {
        const options: any = {
            mediaType: 'photo',
            quality: 0.8,
            saveToPhotos: true,
        };

        if (Platform.OS === 'android' && type === 'camera') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission denied', 'Camera permission is required.');
                return;
            }
        }

        const callback = (response: any) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Error', response.errorMessage);
                return;
            }
            if (response.assets && response.assets.length > 0) {
                setPhotoUri(response.assets[0].uri);
            }
        };

        if (type === 'camera') {
            launchCamera(options, callback);
        } else {
            launchImageLibrary(options, callback);
        }
    };

    const handleSave = async () => {
        if (!photoUri) {
            Alert.alert('Photo Required', 'Please take a photo or select one from the gallery.');
            return;
        }

        const newSighting = {
            id: uuidv4(),
            breed_id: selectedBreedId,
            dog_name: dogName || 'Unnamed Dog',
            photo_uris: [photoUri],
            timestamp: Date.now(),
            latitude: location?.lat || null,
            longitude: location?.long || null,
            notes: notes,
        };

        try {
            await addSighting(newSighting);
            Alert.alert('Success', 'Sighting logged!', [
                { text: 'OK', onPress: () => navigation.navigate('Sightings') }
            ]);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save sighting.');
        }
    };

    const handleLocation = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission denied', 'Location permission is required.');
                return;
            }
        }

        setLoadingLocation(true);
        Geolocation.getCurrentPosition(
            (position: Geolocation.GeoPosition) => {
                setLocation({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                });
                setLoadingLocation(false);
            },
            (error: Geolocation.GeoError) => {
                console.error(error);
                Alert.alert('Error', 'Failed to get location.');
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const selectedBreedName = breeds.find(b => b.id === selectedBreedId)?.name || 'Unknown / Mixed';

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.photoContainer} onPress={() => {
                Alert.alert('Add Photo', 'Choose source', [
                    { text: 'Camera', onPress: () => handlePhoto('camera') },
                    { text: 'Gallery', onPress: () => handlePhoto('library') },
                    { text: 'Cancel', style: 'cancel' },
                ]);
            }}>
                {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Ionicons name="camera" size={48} color={COLORS.textLight} />
                        <Text style={styles.photoText}>Tap to add photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.form}>
                <Text style={styles.label}>Dog's Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Buster"
                    value={dogName}
                    onChangeText={setDogName}
                />

                <Text style={styles.label}>Breed</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{ color: selectedBreedId ? COLORS.text : COLORS.textLight }}>
                        {selectedBreedName}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Where did you see it? Any special traits?"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />

                <TouchableOpacity style={styles.locationButton} onPress={handleLocation} disabled={loadingLocation}>
                    <Ionicons name="location" size={20} color={COLORS.primary} />
                    <Text style={styles.locationText}>
                        {loadingLocation ? 'Getting Location...' : (location ? `Location: ${location.lat.toFixed(4)}, ${location.long.toFixed(4)}` : 'Add Location')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Sighting</Text>
                </TouchableOpacity>
            </View>

            <BreedSelectModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={(breed) => setSelectedBreedId(breed.id)}
                breeds={breeds}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    photoContainer: {
        height: 250,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        alignItems: 'center',
    },
    photoText: {
        color: COLORS.textLight,
        marginTop: 8,
    },
    form: {
        padding: SPACING.l,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        marginTop: SPACING.m,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.m,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.m,
        padding: SPACING.s,
    },
    locationText: {
        color: COLORS.primary,
        marginLeft: 8,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SightingFormScreen;
