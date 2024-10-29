import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';

const mainApi = "https://www.mapquestapi.com/directions/v2/route?";
const key = "arhaArR8A7wX8lxvSKao4iF2rZm5STjM";

const App = () => {
  const [orig, setOrig] = useState('');
  const [dest, setDest] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'

  const handleRequest = async () => {
    const url = `${mainApi}key=${key}&from=${orig}&to=${dest}`;
    try {
      const response = await axios.get(url);
      const jsonStatus = response.data.info.statuscode;
      if (jsonStatus === 0) {
        setRouteData(response.data.route);
      } else {
        Alert.alert("Error", `Status Code: ${jsonStatus}`);
      }
    } catch (error) {
      console.error("API request error:", error);
      Alert.alert("Error", "An error occurred while fetching data.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sol Directions</Text>
      <TextInput
        style={styles.input}
        placeholder="Starting Location"
        value={orig}
        onChangeText={setOrig}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={dest}
        onChangeText={setDest}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRequest}>
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
      {routeData && (
        <RouteDetails routeData={routeData} unit={unit} />
      )}
    </SafeAreaView>
  );
};

const RouteDetails = ({ routeData, unit }) => {
  const distance = unit === 'metric' 
    ? (routeData.distance * 1.61).toFixed(2) 
    : routeData.distance.toFixed(2);
  const formattedTime = routeData.formattedTime;

  return (
    <ScrollView style={styles.detailsContainer}>
      <Text style={styles.detailsHeader}>
        Directions from {routeData.locations[0].adminArea5} to {routeData.locations[1].adminArea5}
      </Text>
      <Text>Trip Duration: {formattedTime}</Text>
      <Text>{unit === 'metric' ? 'Kilometers' : 'Miles'}: {distance} {unit === 'metric' ? 'km' : 'mi'}</Text>
      <Text style={styles.maneuversHeader}>Maneuvers:</Text>
      {routeData.legs[0].maneuvers.map((maneuver, index) => {
        const maneuverDistance = maneuver.distance || 0; // Default to 0 if undefined
        const displayDistance = unit === 'metric' 
          ? (maneuverDistance * 1.61).toFixed(2) 
          : maneuverDistance.toFixed(2);

        return (
          <Text key={index}>
            {maneuver.narrative} ({displayDistance} {unit === 'metric' ? 'km' : 'mi'})
          </Text>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    paddingHorizontal: 120,
  },
  button: {
    backgroundColor: '#007BFF', // Set your desired color here
    borderRadius: 5, // Corner radius
    paddingVertical: 10,
    alignItems: 'center',
    
  },
  buttonText: {
    color: '#FFF', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 1,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  maneuversHeader: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default App;