import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import client from '../lib/sanity'
import { Colors } from 'react-native/Libraries/NewAppScreen'

type PackingItem = {
    label: string
    number: number
    essential?: boolean
    done?: boolean
    category?: string
}

type Props = {
    duration: 'Weekend' | '1 week' | '2+ weeks'
}

const PackingList: React.FC<Props> = ({ duration }) => {
    const [items, setItems] = useState<PackingItem[]>([])
    const [newItemLabel, setNewItemLabel] = useState('')
    const [newItemNumber, setNewItemNumber] = useState<number>(0)
    const [newCategory, setNewCategory] = useState('')

    const storageKey = `packingList-${duration}`

    useEffect(() => {
        const loadData = async () => {
            try {
                const saved = await AsyncStorage.getItem(storageKey)
                if (saved) {
                    const parsed: PackingItem[] = JSON.parse(saved)
                    // console.log('📂 Loaded from AsyncStorage:', parsed);
                    setItems(parsed)
                } else {
                    const doc = await client.fetch(
                        `*[_type == "packingList" && tripDuration == $duration][0]`,
                        { duration }
                    )
                    // console.log('📦 Sanity response:', doc);
                    const safeItems = doc?.items ?? []
                    // console.log('📋 Safe items:', safeItems);
                    const withStatus = safeItems.map((item: PackingItem) => ({
                        ...item,
                        done: false,
                        category: item.category || 'Uncategorized',
                    }))
                    // console.log('✅ Setting items:', withStatus);
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

    const addItem = () => {
        if (!newItemLabel.trim()) return;

        const parsedNumber = parseInt(newItemNumber as unknown as string);
        if (isNaN(parsedNumber)) return;

        const newItem: PackingItem = {
            label: newItemLabel,
            number: parsedNumber,
            done: false,
            category: newCategory.trim() || 'Uncategorized',
        }
        setItems(prev => [...prev, newItem])
        setNewItemLabel('')
        setNewItemNumber(0)
        setNewCategory('')
    }

    const removeItem = (index: number) => {
        const updated = [...items]
        updated.splice(index, 1)
        setItems(updated)
    }

    const groupedItems = items.reduce((groups, item) => {
        const category = item.category || 'Uncategorized'
        if (!groups[category]) groups[category] = []
        groups[category].push(item)
        return groups
    }, {} as Record<string, PackingItem[]>)


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Packing List ({duration})</Text>
            {items.length === 0 ? (
                <Text style={{ color: 'white' }}>Loading items...</Text>
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


                    <ScrollView style={styles.listContainer}>
                        {Object.entries(groupedItems).map(([category, group]) => (
                            <View key={category}>
                                <Text style={styles.categoryTitle}>{category}</Text>
                                {group.map((item, index) => (
                                    <View style={styles.item} key={index}>
                                        <Pressable onPress={() => toggleItem(items.indexOf(item))} style={styles.checkbox}>
                                            <Text style={{ fontSize: 18 }}>{item.done ? '✅' : '⬜'}</Text>
                                        </Pressable>
                                        <Text style={[styles.text, item.done && styles.done]}>
                                            {(item.number ?? 1)} x {item.label}
                                        </Text>
                                        <TouchableOpacity onPress={() => removeItem(items.indexOf(item))}>
                                            <Text style={styles.removeText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    <TextInput
                        placeholder='Add new item'
                        value={newItemLabel}
                        onChangeText={setNewItemLabel}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Add amount'
                        value={newItemNumber.toString()}
                        onChangeText={(input) => {
                            const num = parseInt(input)
                            setNewItemNumber(isNaN(num) ? 0 : num)
                        }}
                        keyboardType='numeric'
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Category (e.g. Clothing, Tech)'
                        value={newCategory}
                        onChangeText={setNewCategory}
                        style={styles.input}
                    />
                    <Button
                    title='Add Item' 
                    onPress={addItem} 
                    />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    listContainer: {
        flex: 1,
        marginBottom: 12,
        // backgroundColor: 'yellow'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'pink',
        display: 'none'
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
        flex: 1,
        color: 'white'
    },
    done: {
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
    removeText: {
        color: 'deeppink',
        marginLeft: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        // backgroundColor: 'pink',
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#1c1429',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'
    },
    input: {
        borderWidth: 1,
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: 'white'
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
        color: 'pink'
    },

})

export default PackingList
