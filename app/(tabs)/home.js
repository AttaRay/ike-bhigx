import React, { useState } from 'react';
import { StyleSheet, Text, View,  Alert, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';

export default function Home({navigation}) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('Maud');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [selectedService, setSelectedService] = useState('Haircut');
  const [extras, setExtras] = useState([
    { name: 'Water', quantity: 0, cost: 4.0 },
    { name: 'Kalypo', quantity: 0, cost: 5.0 },
    { name: 'u-fresh/ Darling lemon/ Bel Ice', quantity: 0, cost: 7.0 },
    { name: 'Beta Malt', quantity: 0, cost: 10 },
    { name: 'Minerals/BB Ctail/Alvaro/Soursop', quantity: 0, cost: 12.0 },
    { name: 'BEER/Malt/Smirnoff', quantity: 0, cost: 15.0 },
    { name: 'Vody/VitaMilk', quantity: 0, cost: 20.0 },
    
    
  ]);
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now();
  const orderNumber= `${timestamp.toString().slice(-6)}${currentMonth}`;

  const handleQuantityChange = (index, delta) => {
    setExtras(prevExtras => {
      const newExtras = [...prevExtras];
      const newQuantity = Math.max(newExtras[index].quantity + delta, 0);
      newExtras[index].quantity = newQuantity;
      return newExtras;
    });
  };

  const staffOptions = ['Maud', 'Eunice', 'RM', 'Diego', 'Joan','Staff 5', 'Staff 6'];
  const PaymentOptions = ['cash', 'MOMO'];
  const serviceOptions = ['Haircut', 'colouring', 'Locks', 'Nails', 'Toe services', 'Pedicure', 'Hair', 'Braids', 'Wigs Making', 'Installation','Item Sale']
  const [ServiceDescritption, setServiceDescritption ]= useState('');
  const [Servicecost, setServicecost ]= useState('');
  
   const selectedExtras = extras.filter(extra => extra.quantity > 0);

   const totalextraCost = selectedExtras.reduce((total, extra) => {
     return total + (extra.quantity * extra.cost);
   }, 0);
  const TotalCost = totalextraCost + parseFloat(Servicecost)

    // Validation function
    const validateInputs = () => {
      if (!customerName.trim() || !phoneNumber.trim() || !ServiceDescritption.trim() || !Servicecost.trim()) {
        Alert.alert('Error', 'All fields are required');
        return false;
      }
  
      // Check if Servicecost is a valid number
      if (isNaN(Servicecost) || parseFloat(Servicecost) <= 0) {
        Alert.alert('Error', 'Service cost must be a valid number greater than 0');
        return false;
      }
  
      // Check if Phone Number is exactly 10 digits and contains only numbers
      if (!/^\d{10}$/.test(phoneNumber)) {
        Alert.alert('Error', 'Phone number must be exactly 10 digits');
        return false;
      }
  
      return true;
    };

  return (
    <View style={styles.container}>
      {/* Fixed Header and Order Details */}
      <View style={styles.header}>
        <Image source={require('./logo.png')} style={styles.img}/>
        <Text style={styles.subLogo}>Payment Counter</Text>
      </View>

      <View style={styles.orderDetailsContainer}>
        <Text style={styles.orderDetailsText}>Order Details</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.detailsBoxx}>
          {/* Order Number at top-right */}
          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          </View>

          {/* Input for Customer Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              placeholderTextColor={'#007bff'}
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          {/* Input for Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Phone:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit phone number"
              placeholderTextColor={'#007bff'}
              keyboardType="numeric"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Staff Selection */}
          <View style={styles.staffSelectionContainer}>
            <Text style={styles.label}>Select Staff:</Text>
            <View style={styles.radioButtonsWrapper}>
              {staffOptions.map((staff, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioButtonContainer}
                  onPress={() => setSelectedStaff(staff)}
                >
                  <View
                    style={[
                      styles.radioButton,
                      selectedStaff === staff && styles.radioButtonSelected
                    ]}
                  />
                  <Text style={styles.radioButtonLabel}>{staff}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
{/* Service Selection */}
          <View style={styles.serviceContainer}>
            <Text style={styles.label}>Select Service:</Text>
            <View style={styles.radioButtonsColumn}>
              {serviceOptions.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioButtonContainer}
                  onPress={() => setSelectedService(service)}
                >
                  <View
                    style={[
                      styles.radioButton,
                      selectedService === service && styles.radioButtonSelected
                    ]}
                  />
                  <Text style={styles.radioButtonLabel}>{service}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Description & Details:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter further details of service"
              value={ServiceDescritption}
              placeholderTextColor={'#007bff'}
              onChangeText={setServiceDescritption}
            />
          </View>

          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Cost:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Cost of the service"
              placeholderTextColor={'#007bff'}
              keyboardType="numeric"
              value={Servicecost}
              onChangeText={setServicecost}
            />
          </View>




          {/* Extras Selection */}
          <View style={styles.extrasContainer}>
            <Text style={styles.label}>Extras:</Text>
            {extras.map((extra, index) => (
              <View key={index} style={styles.extraItem}>
                <Text style={styles.extraLabel}>{extra.name}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      extra.quantity > 0 ? styles.quantityButtonEnabled : styles.quantityButtonDisabled
                    ]}
                    onPress={() => handleQuantityChange(index, -1)}
                    disabled={extra.quantity <= 0}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{extra.quantity}</Text>
                  <TouchableOpacity
                    style={[styles.quantityButton, styles.quantityButtonPlus]}
                    onPress={() => handleQuantityChange(index, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.label}>Select Payment Method:</Text>
            <View style={styles.radioButtonsColumn}>
              {PaymentOptions.map((Payment, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.radioButtonContainer}
                  onPress={() => setSelectedPayment(Payment)}
                >
                  <View
                    style={[
                      styles.radioButton,
                      selectedPayment === Payment && styles.radioButtonSelected
                    ]}
                  />
                  <Text style={styles.radioButtonLabel}>{Payment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (validateInputs()) {
              navigation.navigate('Receipt', {
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
              });
            }
          }}
        >
            <Text style={{textAlign:'center',fontSize:18,color:'white'}} >Confirm Order</Text>
        </TouchableOpacity>
       
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginVertical: 5,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    paddingTop: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign: 'center',
  },
  subLogo: {
    fontSize: 16,
    color: '#666',
  },
  orderDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  orderDetailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  detailsBoxx: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  staffSelectionContainer: {
    marginBottom: 20,
  },
  radioButtonsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioButtonLabel: {
    fontSize: 16,
    color: '#555',
  },
  serviceContainer: {
    marginBottom: 20,
  },
  radioButtonsColumn: {
    flexDirection: 'column',
  },
  extrasContainer: {
    marginBottom: 20,
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    marginRight: 10, // Reduced margin to decrease space
  },
  extraLabel: {
    fontSize: 16,
    color: '#555',
    flexShrink: 1, // Prevents text overflow by allowing it to wrap
    paddingRight: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonEnabled: {
    backgroundColor: '#ff4d4d', // Red color for enabled button
  },
  quantityButtonDisabled: {
    backgroundColor: '#aaa',
  },
  quantityButtonPlus: {
    backgroundColor: '#007bff', // Blue color for the plus button
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  quantityText: {
    fontSize: 16,
    color: '#555',
    width: 40,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 16,
    color: '#666',
  },
  btn:{
    backgroundColor: '#007bff',
    width:'45%',
    marginLeft:'30%',
    marginRight:'30%',
    height:40,
    borderRadius:15,
    justifyContent:'center',
    
   

  },
  img:{
    height:200,
    width:200,
  },
});