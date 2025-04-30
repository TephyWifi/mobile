import { Tabs } from 'expo-router'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: "pink", 
            tabBarStyle: { backgroundColor: "#1c1429" },
            headerStyle: { backgroundColor: "#1c1429" },
            headerTintColor: "pink",
            headerTitleStyle: { fontFamily: "monospace", fontWeight: 900 },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'PACKING LIST',
                    headerTitleAlign: 'center',
                }}
            />
            <Tabs.Screen
                name="travel"
                options={{
                    title: 'Travel Info'
                }}
            />
        </Tabs>
    )
}
