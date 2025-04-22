import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';

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
                    title: 'Packing List',
                    tabBarIcon: ({color}) => <MaterialIcons size={20} name='checklist' color={color}/>
                }}
            />
            <Tabs.Screen
                name="travel"
                options={{
                    title: 'Travel Info',
                    tabBarIcon: ({color}) => <MaterialIcons size={20} name='airplane-ticket' color={color}/>
                }}
            />
        </Tabs>
    )
}
