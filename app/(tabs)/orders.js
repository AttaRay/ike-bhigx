import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, ActivityIndicator, ScrollView, TextInput, TouchableOpacity
} from 'react-native';
import { db } from './firebaseconfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderNumberQuery, setOrderNumberQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [phoneNumberQuery, setPhoneNumberQuery] = useState('');
  const [paymentQuery, setPaymentQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [monthQuery, setMonthQuery] = useState('');

  const staffOptions = ['Maud', 'Eunice', 'RM', 'Diego', 'Joan', 'Staff 5', 'Staff 6'];

  // Fetch orders from Firestore
  const fetchOrders = async () => {
    setLoading(true); // Show loading indicator
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);

      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersList);
      setFilteredOrders(ordersList); // Initialize filteredOrders with full list
    } catch (error) {
      console.error('Error fetching orders: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch orders when "Orders" tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Filter orders based on search queries and selected staff
  const filterOrders = () => {
    const filteredList = orders.filter((order) => {
      const orderMonth = order.date.split('/')[0]; // Extract month from the date

      return (
        order.orderNumber.toLowerCase().includes(orderNumberQuery.toLowerCase()) &&
        order.date.toLowerCase().includes(dateQuery.toLowerCase()) &&
        order.phoneNumber.toLowerCase().includes(phoneNumberQuery.toLowerCase()) &&
        (selectedStaff === '' || order.selectedStaff === selectedStaff) &&
        order.selectedPayment.toLowerCase().includes(paymentQuery.toLowerCase()) &&
        (monthQuery === '' || orderMonth === monthQuery) // Match month query
      );
    });
    setFilteredOrders(filteredList);
  };

  useEffect(() => {
    filterOrders();
  }, [orderNumberQuery, dateQuery, phoneNumberQuery, selectedStaff, paymentQuery, monthQuery]);

  const totalOrders = filteredOrders.length;
  const totalOrderAmount = filteredOrders.reduce((total, order) => total + order.TotalCost, 0).toFixed(2);
  const totalServiceCost = filteredOrders.reduce((total, order) => total + order.Servicecost, 0).toFixed(2);
  const totalExtrasAmount = (totalOrderAmount - totalServiceCost).toFixed(2);

  const renderOrder = (order) => {
    const extraCost = order.TotalCost - order.Servicecost;

    return (
      <View key={order.id} style={styles.orderContainer}>
        <Text style={styles.label}>Order Number:</Text>
        <Text style={styles.value}>{order.orderNumber}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{order.date}</Text>

        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{order.time}</Text>

        <Text style={styles.label}>Customer:</Text>
        <Text style={styles.value}>{order.customerName}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{order.phoneNumber}</Text>

        <Text style={styles.label}>Service:</Text>
        <Text style={styles.value}>{order.selectedService}</Text>

        <Text style={styles.label}>Served by:</Text>
        <Text style={styles.value}>{order.selectedStaff}</Text>

        <Text style={styles.label}>Cost:</Text>
        <Text style={styles.value}>₵{order.Servicecost.toFixed(2)}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{order.ServiceDescritption}</Text>

        <Text style={styles.label}>Extra Cost:</Text>
        <Text style={styles.value}>₵{extraCost.toFixed(2)}</Text>

        <Text style={styles.label}>Total Cost:</Text>
        <Text style={styles.value}>₵{order.TotalCost.toFixed(2)}</Text>

        <Text style={styles.label}>Payment:</Text>
        <Text style={styles.value}>{order.selectedPayment}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Total Order Stats */}
      <View style={styles.totalStatsContainer}>
        <View style={styles.totalStats}>
          <View style={styles.totalStatBox}>
            <Text style={styles.totalStatText}>Total Orders: {totalOrders}</Text>
          </View>
          <View style={styles.totalStatBox}>
            <Text style={styles.totalStatText}>Total Order Amount: ₵{totalOrderAmount}</Text>
          </View>
          <View style={styles.totalStatBox}>
            <Text style={styles.totalStatText}>Total Service Cost: ₵{totalServiceCost}</Text>
          </View>
          <View style={styles.totalStatBox}>
            <Text style={styles.totalStatText}>Total Extras Amount: ₵{totalExtrasAmount}</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer}>
        {/* Search Inputs */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Order Number"
          placeholderTextColor="black"
          value={orderNumberQuery}
          onChangeText={setOrderNumberQuery}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Date"
          placeholderTextColor="black"
          value={dateQuery}
          onChangeText={setDateQuery}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Phone Number"
          placeholderTextColor="black"
          value={phoneNumberQuery}
          onChangeText={setPhoneNumberQuery}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by Payment Method"
          placeholderTextColor="black"
          value={paymentQuery}
          onChangeText={setPaymentQuery}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by Month (MM)"
          placeholderTextColor="black"
          value={monthQuery}
          onChangeText={setMonthQuery}
        />

        {/* Staff Radio Buttons */}
        <Text style={styles.label}>Filter by Staff:</Text>
        <View style={styles.radioContainer}>
          {staffOptions.map((staff) => (
            <TouchableOpacity
              key={staff}
              style={styles.radioButton}
              onPress={() => setSelectedStaff(staff === selectedStaff ? '' : staff)}
            >
              <View style={[styles.radioCircle, selectedStaff === staff && styles.selectedRadioCircle]} />
              <Text style={styles.radioText}>{staff}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          filteredOrders.map(renderOrder)
        )}
      </ScrollView>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  totalStatsContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexWrap: 'wrap',
  },
  totalStatBox: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '45%', 
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  totalStatText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContainer: { flex: 1 },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  selectedRadioCircle: {
    backgroundColor: '#007bff',
  },
  radioText: { color: '#000' },
  orderContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: { fontWeight: 'bold', color: '#333' },
  value: { color: '#666', marginBottom: 5 },
});
