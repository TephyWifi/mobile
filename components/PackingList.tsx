import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import client from '../lib/sanity'

type PackingItem = {
    label: string
    essential?: boolean
    done?: boolean
}

type Props = {
    duration: 'Weekend' | '1 week' | '2+ weeks'
}

const PackingList: React.FC<Props> = ({ duration }) => {
    const [items, setItems] = useState<PackingItem[]>([])

    const storageKey = `packingList-${duration}`

    useEffect(() => {
        const loadData = async () => {
            try {
                const saved = await AsyncStorage.getItem(storageKey)
                if (saved) {
                    const parsed: PackingItem[] = JSON.parse(saved)
                    setItems(parsed)
                } else {
                    const doc = await client.fetch(
                        `*[_type == "packingList" && tripDuration == $duration][0]`,
                        { duration }
                    )
                    const safeItems = doc?.items ?? []
                    const withStatus = safeItems.map((items: PackingItem) => ({
                        ...items,
                        done: false,
                    }))
                    setItems(withStatus)
                }
            } catch (err) {
                console.error('❌ Failed to load packing list:', err)
            }
        }
        loadData()
    }, [duration])

    useEffect(() => {
        AsyncStorage.setItem(storageKey, JSON.stringify(items)).catch((err) =>
            console.error('❌ Failed to save packing list:', err)
        )
    }, [items])

    const toggleItem = useCallback((index: number) => {
        const updated = [...items];
        updated[index].done = !updated[index].done;
        setItems([
            ...updated.filter((i) => !i.done),
            ...updated.filter((i) => i.done),
        ]);
    }, [items]);

    const checkAll = () => {
        const updated = items.map(item => ({ ...item, done: true }))
        setItems(updated)
    }

    const uncheckAll = () => {
        const updated = items.map(item => ({ ...item, done: false }))
        setItems(updated)
    }

    return (
        <View>
            <Text style={styles.header}>Packing List ({duration})</Text>
            {items.length === 0 ? (
                <Text>Loading items...</Text>
            ) : (
                <>
                    <View style={styles.buttonRow}>
                        <Pressable onPress={checkAll} style={styles.button}>
                            <Text style={styles.buttonText}>✅ Check All</Text>
                        </Pressable>
                        <Pressable onPress={uncheckAll} style={styles.button}>
                            <Text style={styles.buttonText}>⬜ Uncheck All</Text>
                        </Pressable>
                    </View>

                    <FlatList
                        data={items}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.item}>
                                <Pressable onPress={() => toggleItem(index)} style={styles.checkbox}>
                                    <Text style={{ fontSize: 18 }}>{item.done ? '✅' : '⬜'}</Text>
                                </Pressable>
                                <Text style={[styles.text, item.done && styles.done]}>
                                    {item.label}
                                </Text>
                            </View>
                        )}
                    />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    checkbox: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
    },
    done: {
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

})

export default PackingList
