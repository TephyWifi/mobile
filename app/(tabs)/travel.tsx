import { View, StyleSheet } from "react-native";
import TravelInfo from "../../components/TravelInfo";

export default function TravelScreen() {
    return (
        <View style={styles.container}>
            <TravelInfo />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
})