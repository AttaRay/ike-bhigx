import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from './firebaseconfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

export default function Receipt({ route, navigation }) {
  const {
    customerName,
    phoneNumber,
    selectedStaff,
    selectedPayment,
    selectedService,
    selectedExtras,
    ServiceDescritption,
    Servicecost,
    TotalCost,
    orderNumber,
  } = route.params;

  const sendSMS = async (recipient) => {
    const apiKey = 'LivHnG2XFHIjd7xKjdDMZZ5jJ'; 
    const endPoint = 'https://api.mnotify.com/api/sms/quick';
  
    const data = {
      recipient: [recipient], 
      sender: 'IKE-BHIGX', 
      message: `
    Your Receipt:
    Order Number: ${orderNumber}
    Service: ${selectedService}
    Service Description: ${ServiceDescritption}
    You were served by ${selectedStaff}
    Service Cost: GHC${Servicecost}
    Extra Cost: GHC${TotalCost-Servicecost}
    Total Cost: GHC${TotalCost}
    Thank you! SEE YOU AGAIN!
    `, 
      is_schedule: 'false', 
      schedule_date: '', 
    };
  
    const url = `${endPoint}?key=${apiKey}`;
  
    const config = {
      method: 'post',
      url: url,
      headers: {
        'Accept': 'application/json',
      },
      data: data,
    };
  
    try {
      const response = await axios(config);
      console.log('SMS Sent:', response.data);
      Alert.alert('Success', 'Order placed and Receipt sent successfully!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      Alert.alert('Error', 'Order placed but Receipt could not be sent. Please try again later.');
    }
  };

  // Function to save data to Firestore and send SMS
  const saveDataToFirestore = async () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    try {
      // Add order data to Firestore
      const docRef = await addDoc(collection(db, 'orders'), {
        customerName,
        phoneNumber,
        selectedStaff,
        selectedPayment,
        selectedService,
        ServiceDescritption,
        Servicecost: parseFloat(Servicecost),
        TotalCost: parseFloat(TotalCost),
        orderNumber,
        date,
        time,
        createdAt: serverTimestamp(),

      });

      console.log('Document written with ID: ', docRef.id);
      Alert.alert('Success', 'Order saved successfully!');
      
      // Send SMS after order is saved
      sendSMS(phoneNumber);

      // After successful order submission, reset the state and navigate to home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Error saving order. Please try again.');
    }
  };

  return (
    <ScrollView>
      <View>
        <View style={styles.receiptContainer}>
          <Text style={styles.receiptHeader}>ORDER CONFIRMATION</Text>

          <Text style={styles.receiptItem}>Order Number: {orderNumber}</Text>
          <Text style={styles.receiptItem}>Customer Name: {customerName}</Text>
          <Text style={styles.receiptItem}>Customer Number: {phoneNumber}</Text>
          <Text style={styles.receiptItem}>Selected Staff: {selectedStaff}</Text>
          <Text style={styles.receiptItem}>Selected Service: {selectedService}</Text>
          <Text style={styles.receiptItem}>Service Description: {ServiceDescritption}</Text>
          <Text style={styles.receiptItem}>Service Cost: ₵{parseFloat(Servicecost).toFixed(2)}</Text>

          <Text style={styles.receiptItem}>Selected Extras:</Text>
          {selectedExtras.length > 0 ? (
            selectedExtras.map((extra, index) => (
              <Text key={index} style={styles.receiptItem}>
                {extra.name}: {extra.quantity} x ₵{extra.cost} = ₵{(extra.quantity * extra.cost).toFixed(2)}
              </Text>
            ))
          ) : (
            <Text style={styles.receiptItem}>No extras selected</Text>
          )}

          <Text style={styles.receiptItem}>Payment Method: {selectedPayment}</Text>

          <Text style={styles.totalCost}>Total Order Cost: ₵{TotalCost.toFixed(2)}</Text>
        </View>

        <View style={styles.btnscontainer}>
          <TouchableOpacity style={styles.btn1} onPress={() => navigation.goBack()}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={saveDataToFirestore}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  receiptContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  receiptHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  receiptItem: {
    fontSize: 16,
    marginVertical: 7,
    color: '#555',
    marginHorizontal: 5,
  },
  totalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
  btnscontainer: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'center',
    padding: 15,
  },
  btn1: {
    width: '40%',
    backgroundColor: '#ff4d4d',
    marginLeft: 20,
    borderRadius: 10,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
  },
  btn2: {
    width: '40%',
    backgroundColor: '#007bff',
    marginRight: 20,
    marginLeft: 10,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
  },
});
