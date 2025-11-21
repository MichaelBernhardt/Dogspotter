import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SPACING, FONTS } from '../utils/theme';
import Card from '../components/Card';
import { getSightings, getBreeds } from '../services/Database';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const [stats, setStats] = useState({ sightings: 0, uniqueBreeds: 0, totalBreeds: 0 });

    useEffect(() => {
        if (isFocused) {
            loadStats();
        }
    }, [isFocused]);

    const loadStats = async () => {
        const sightings = await getSightings();
        const breeds = await getBreeds();
        const uniqueSeen = new Set(sightings.map(s => s.breed_id).filter(id => id)).size;
        setStats({
            sightings: sightings.length,
            uniqueBreeds: uniqueSeen,
            totalBreeds: breeds.length,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>DogSpotter</Text>
                <Text style={styles.subtitle}>Your field guide to dogs</Text>
            </View>

            <Card style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.sightings}</Text>
                    <Text style={styles.statLabel}>Sightings</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.uniqueBreeds}</Text>
                    <Text style={styles.statLabel}>Unique Breeds</Text>
                </View>
            </Card>

            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionGrid}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('SightingForm')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#E8F8F5' }]}>
                        <Ionicons name="camera" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={styles.actionText}>Log Sighting</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Breeds')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#FEF9E7' }]}>
                        <Ionicons name="search" size={32} color="#F1C40F" />
                    </View>
                    <Text style={styles.actionText}>Browse Breeds</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('TraitMatcher')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#EBDEF0' }]}>
                        <Ionicons name="paw" size={32} color="#9B59B6" />
                    </View>
                    <Text style={styles.actionText}>Identify Dog</Text>
                </TouchableOpacity>
            </View>

            <Card style={styles.tipCard}>
                <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
                <Text style={styles.tipText}>
                    Tip: Use the "Identify Dog" tool to narrow down breeds by size, coat, and ears!
                </Text>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.l,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: SPACING.m,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: SPACING.xs,
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: -SPACING.xl,
        marginHorizontal: SPACING.l,
    },
    statItem: {
        alignItems: 'center',
        padding: SPACING.s,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: SPACING.l,
        marginTop: SPACING.l,
        marginBottom: SPACING.s,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: SPACING.m,
    },
    actionButton: {
        alignItems: 'center',
        width: 100,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.l,
        marginBottom: SPACING.xl,
    },
    tipText: {
        flex: 1,
        marginLeft: SPACING.m,
        color: COLORS.text,
        fontSize: 14,
    },
});

export default HomeScreen;
