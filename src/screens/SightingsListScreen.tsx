import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/theme';
import { getSightings, getBreedById } from '../services/Database';
import { Sighting } from '../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SightingsListScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const [sightings, setSightings] = useState<Sighting[]>([]);
    const [breedNames, setBreedNames] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused]);

    const loadData = async () => {
        const data = await getSightings();
        setSightings(data);

        // Load breed names
        const names: Record<string, string> = {};
        for (const s of data) {
            if (s.breed_id && !names[s.breed_id]) {
                const b = await getBreedById(s.breed_id);
                if (b) names[s.breed_id] = b.name;
            }
        }
        setBreedNames(names);
    };

    const renderItem = ({ item }: { item: Sighting }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('SightingDetail', { sighting: item, breedName: breedNames[item.breed_id || ''] })}
        >
            <Image source={{ uri: item.photo_uris[0] }} style={styles.thumbnail} />
            <View style={styles.itemContent}>
                <Text style={styles.dogName}>{item.dog_name}</Text>
                <Text style={styles.breedName}>
                    {item.breed_id ? breedNames[item.breed_id] : 'Unknown Breed'}
                </Text>
                <Text style={styles.date}>
                    {new Date(item.timestamp).toLocaleDateString()}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sightings}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No sightings yet. Go find some dogs!</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    list: {
        padding: SPACING.m,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: SPACING.s,
        marginBottom: SPACING.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: SPACING.m,
    },
    itemContent: {
        flex: 1,
    },
    dogName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    breedName: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    date: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    empty: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: 16,
    },
});

export default SightingsListScreen;
