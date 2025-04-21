import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import client from "../lib/sanity";

type FlightInfo = {
    airline: string
    flightNumber: string
    departureTime: string
    arrivalTime: string
    departureAirport: string
    arrivalAirport: string
    gate?: string
    checkInNeeded?: boolean
}

const TravelInfo = () => {
    const [flight, setFlight] = useState<FlightInfo | null>(null)

    useEffect(() => {
        client
        .fetch(`*[_type == "flightInfo"][0]`)
        .then((data: FlightInfo) => {
            setFlight(data)
        })
        .catch(console.error)
    }, [])
    if (!flight) return <Text style={styles.loading}>Loading flight info...</Text>

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Flight Info</Text>
            <Text style={styles.label}>Airline: {flight.airline}</Text>
            <Text style={styles.label}>Flight: {flight.flightNumber}</Text>
            <Text style={styles.label}>From: {flight.departureAirport}</Text>
            <Text style={styles.label}>To: {flight.arrivalAirport}</Text>
            <Text style={styles.label}>Arrival: {new Date(flight.airline).toLocaleString()}</Text>
            {flight.gate && <Text style={styles.label}>Gate: {flight.gate}</Text>}
            {flight.checkInNeeded && <Text style={styles.alert}>Self Check-In Required</Text>}
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginVertical: 2,
    },
    alert: {
        fontSize: 16,
        color: 'orange',
        marginTop: 10,
    },
    loading: {
        fontSize: 16,
        padding: 20,
    },
})

export default TravelInfo