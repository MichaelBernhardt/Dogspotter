import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/theme';
import { getBreeds } from '../services/Database';
import { Breed } from '../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BreedListScreen = () => {
    const navigation = useNavigation<any>();
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadBreeds();
    }, []);

    const loadBreeds = async () => {
        const data = await getBreeds();
        setBreeds(data);
        setFilteredBreeds(data);
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        if (!text) {
            setFilteredBreeds(breeds);
            return;
        }
        const lower = text.toLowerCase();
        const filtered = breeds.filter(b =>
            b.name.toLowerCase().includes(lower) ||
            b.alt_names.some(alt => alt.toLowerCase().includes(lower))
        );
        setFilteredBreeds(filtered);
    };

    const renderItem = ({ item }: { item: Breed }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('BreedDetail', { breedId: item.id })}
        >
            <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.size} • {item.coat_length} coat</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search breeds..."
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filteredBreeds}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: SPACING.m,
        paddingHorizontal: SPACING.m,
        borderRadius: 8,
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchIcon: {
        marginRight: SPACING.s,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    list: {
        paddingBottom: SPACING.xl,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    itemSub: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2,
        textTransform: 'capitalize',
    },
});

export default BreedListScreen;
