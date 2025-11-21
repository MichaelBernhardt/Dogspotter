import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/theme';
import { getBreedById } from '../services/Database';
import { getBreedImages } from '../services/ImageService';
import { Breed } from '../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BreedDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { breedId } = route.params;
    const [breed, setBreed] = useState<Breed | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(true);

    useEffect(() => {
        loadData();
    }, [breedId]);

    const loadData = async () => {
        const data = await getBreedById(breedId);
        setBreed(data);
        if (data) {
            setLoadingImages(true);
            const imgs = await getBreedImages(data.name);
            setImages(imgs);
            setLoadingImages(false);
        }
    };

    if (!breed) return null;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                {loadingImages ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : images.length > 0 ? (
                    <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="paw" size={64} color={COLORS.textLight} />
                        <Text style={styles.placeholderText}>No image available</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{breed.name}</Text>
                <Text style={styles.origin}>{breed.origin}</Text>

                <View style={styles.tags}>
                    <View style={styles.tag}><Text style={styles.tagText}>{breed.size}</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>{breed.coat_length} coat</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>{breed.ears} ears</Text></View>
                </View>

                <Text style={styles.sectionHeader}>Description</Text>
                <Text style={styles.description}>{breed.description}</Text>

                <Text style={styles.sectionHeader}>Temperament</Text>
                <View style={styles.tags}>
                    {breed.temperament.map(t => (
                        <View key={t} style={[styles.tag, styles.tempTag]}>
                            <Text style={[styles.tagText, styles.tempTagText]}>{t}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logButton}
                    onPress={() => navigation.navigate('SightingForm', { preselectedBreedId: breed.id })}
                >
                    <Ionicons name="camera" size={24} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.logButtonText}>Log Sighting</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        height: 250,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        color: COLORS.textLight,
        marginTop: 8,
    },
    content: {
        padding: SPACING.l,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    origin: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: SPACING.m,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.m,
    },
    tag: {
        backgroundColor: '#E8F6F3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: COLORS.secondary,
        fontSize: 14,
        textTransform: 'capitalize',
    },
    tempTag: {
        backgroundColor: '#FEF9E7',
    },
    tempTagText: {
        color: '#F39C12',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
    logButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.m,
        borderRadius: 12,
        marginTop: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    logButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BreedDetailScreen;
