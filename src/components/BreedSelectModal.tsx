import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Breed } from '../types';
import { COLORS, SPACING } from '../utils/theme';

interface BreedSelectModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (breed: Breed) => void;
    breeds: Breed[];
}

const BreedSelectModal: React.FC<BreedSelectModalProps> = ({ visible, onClose, onSelect, breeds }) => {
    const [search, setSearch] = useState('');
    const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>(breeds);

    useEffect(() => {
        if (search) {
            const lowerSearch = search.toLowerCase();
            const filtered = breeds.filter(b =>
                b.name.toLowerCase().includes(lowerSearch) ||
                b.alt_names.some(an => an.toLowerCase().includes(lowerSearch))
            );
            setFilteredBreeds(filtered);
        } else {
            setFilteredBreeds(breeds);
        }
    }, [search, breeds]);

    const renderItem = ({ item }: { item: Breed }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                onSelect(item);
                onClose();
                setSearch('');
            }}
        >
            <Text style={styles.itemText}>{item.name}</Text>
            {item.alt_names.length > 0 && (
                <Text style={styles.itemSubText}>{item.alt_names.join(', ')}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Select Breed</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search breeds..."
                        value={search}
                        onChangeText={setSearch}
                        autoCorrect={false}
                    />
                </View>

                <FlatList
                    data={filteredBreeds}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    closeButton: {
        padding: SPACING.s,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: SPACING.m,
        paddingHorizontal: SPACING.m,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 44,
    },
    searchIcon: {
        marginRight: SPACING.s,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    item: {
        padding: SPACING.m,
        backgroundColor: '#fff',
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    itemSubText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.border,
    },
});

export default BreedSelectModal;
