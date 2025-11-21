import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/theme';
import { Sighting } from '../types';

const SightingDetailScreen = () => {
    const route = useRoute<any>();
    const { sighting, breedName } = route.params;
    const item = sighting as Sighting;

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.photo_uris[0] }} style={styles.image} resizeMode="cover" />

            <View style={styles.content}>
                <Text style={styles.dogName}>{item.dog_name}</Text>
                <Text style={styles.breedName}>{breedName || 'Unknown Breed'}</Text>

                <Text style={styles.date}>
                    Seen on {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                </Text>

                {item.notes ? (
                    <View style={styles.section}>
                        <Text style={styles.label}>Notes</Text>
                        <Text style={styles.text}>{item.notes}</Text>
                    </View>
                ) : null}

                {item.latitude && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Location</Text>
                        <Text style={styles.text}>{item.latitude.toFixed(4)}, {item.longitude?.toFixed(4)}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: SPACING.l,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
    },
    dogName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    breedName: {
        fontSize: 18,
        color: COLORS.primary,
        marginBottom: SPACING.s,
    },
    date: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: SPACING.l,
    },
    section: {
        marginTop: SPACING.m,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    text: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
});

export default SightingDetailScreen;
