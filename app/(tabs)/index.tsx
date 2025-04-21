import React, { useState } from "react";
import { SafeAreaView, View, Text, Button } from "react-native";
import PackingList from "../../components/PackingList";

const durations = ['Weekend', '1 week', '2+ weeks'] as const

const Packing = () => {
  const [selectedDuration, setSelectedDuration] = useState<typeof durations[number]>('Weekend')
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select trip duration:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20, }}>
        {durations.map((duration) =>(
          <Button
            key={duration}
            title={duration}
            onPress={() => setSelectedDuration(duration)}
            color={selectedDuration === duration ? '#007AFF' : '#ccc'}
          />
        ))}
      </View>

      <PackingList duration={selectedDuration} />
    </SafeAreaView>
  )
}

export default Packing