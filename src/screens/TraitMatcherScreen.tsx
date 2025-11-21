import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/theme';
import { getBreeds } from '../services/Database';
import { Breed } from '../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STEPS = [
    { id: 'size', title: 'What size is the dog?', options: ['toy', 'small', 'medium', 'large', 'giant'] },
    { id: 'coat_length', title: 'How long is the coat?', options: ['short', 'medium', 'long'] },
    { id: 'ears', title: 'What shape are the ears?', options: ['droopy', 'pricked', 'semi-pricked', 'folded'] },
];

const TraitMatcherScreen = () => {
    const navigation = useNavigation<any>();
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [matches, setMatches] = useState<Breed[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (option: string) => {
        const stepId = STEPS[currentStep].id;
        const newSelections = { ...selections, [stepId]: option };
        setSelections(newSelections);

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            findMatches(newSelections);
        }
    };

    const findMatches = async (finalSelections: Record<string, string>) => {
        const allBreeds = await getBreeds();
        const results = allBreeds.filter(b => {
            return (
                (!finalSelections.size || b.size === finalSelections.size) &&
                (!finalSelections.coat_length || b.coat_length === finalSelections.coat_length) &&
                (!finalSelections.ears || b.ears === finalSelections.ears)
            );
        });
        setMatches(results);
        setShowResults(true);
    };

    const reset = () => {
        setCurrentStep(0);
        setSelections({});
        setShowResults(false);
        setMatches([]);
    };

    if (showResults) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Found {matches.length} Matches</Text>
                    <TouchableOpacity onPress={reset}>
                        <Text style={styles.resetText}>Start Over</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={matches}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.matchItem}
                            onPress={() => navigation.navigate('BreedDetail', { breedId: item.id })}
                        >
                            <Text style={styles.matchName}>{item.name}</Text>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No breeds match these traits exactly.</Text>
                        </View>
                    }
                />
            </View>
        );
    }

    const step = STEPS[currentStep];

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                {STEPS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            index <= currentStep ? styles.activeDot : null
                        ]}
                    />
                ))}
            </View>

            <Text style={styles.question}>{step.title}</Text>

            <ScrollView contentContainerStyle={styles.optionsContainer}>
                {step.options.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={styles.optionButton}
                        onPress={() => handleSelect(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.l,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
    },
    question: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    optionsContainer: {
        alignItems: 'stretch',
    },
    optionButton: {
        backgroundColor: '#fff',
        padding: SPACING.l,
        borderRadius: 12,
        marginBottom: SPACING.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    optionText: {
        fontSize: 18,
        color: COLORS.text,
        textTransform: 'capitalize',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    resetText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    matchItem: {
        backgroundColor: '#fff',
        padding: SPACING.m,
        borderRadius: 8,
        marginBottom: SPACING.s,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    matchName: {
        fontSize: 16,
        color: COLORS.text,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: 16,
    },
});

export default TraitMatcherScreen;
