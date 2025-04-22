import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import PackingList from "../../components/PackingList";

const durations = ['Weekend', '1 week', '2+ weeks'] as const

const Packing = () => {
  const [selectedDuration, setSelectedDuration] = useState<typeof durations[number]>('Weekend')

  // console.log('🕓 Current trip duration:', selectedDuration);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select trip duration:</Text>
      <View style={styles.buttonRow}>
        {durations.map((duration) => (
          <View key={duration} style={styles.buttonWrapper}>
            <Button
              title={duration}
              onPress={() => setSelectedDuration(duration)}
              color={selectedDuration === duration ? '#007AFF' : '#ccc'}
            />
          </View>
        ))}
      </View>
      <View style={styles.listWrapper}>
        <PackingList duration={selectedDuration} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f6f6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  listWrapper: {
    flex: 1,
  },
})

export default Packing