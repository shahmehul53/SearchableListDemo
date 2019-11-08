import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import { setAutoFocusEnabled } from 'expo/build/AR';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      contacts: []
    };
  }

  loadContacts = async () => {
    const permission = await Permissions.getAsync(
      Permissions.CONTACTS
    );

    if (permission.status !== 'granted') {
      alert('Hey! You might want to enable contacts for my app, they are good.');
      //return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers]
    });

    console.log(data);
    this.setState({ contacts: data, inMemoryContacts: data, isLoading: false });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this.loadContacts();
  }

  searchContacts = (value) => {
    const filteredContacts = this.state.inMemoryContacts.filter(contact=>{
      let contactLowercase = (
        contact.firstName + ' '+ contact.lastName
      ).toLowerCase();

      let searchTermLowercase = value.toLowerCase();
      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    this.setState({contacts: filteredContacts});
  };

  renderItem = ({item})=> (
    <View style = {{minHeight :70,padding: 5}}>
      <Text style={{color: '#bada55', fontWeight: 'bold',fontSize: 26}}>
        {item.firstName + ' '}
        {item.lastName}
      </Text>
      {/* <Text style={{color: 'white', fontWeight: 'bold'}}>
        {item.phoneNumbers[0].digits}
      </Text> */}

      {Platform.OS === 'android' ?
        <Text style={{ color: 'gray', fontWeight: 'bold' }}>
          {!item.phoneNumbers ? 'Nahi Hai' : item.phoneNumbers[0].number}
        </Text> :
        <Text style={{ color: 'gray', fontWeight: 'bold' }}>
          {!item.phoneNumbers ? 'Nahi Hai' : item.phoneNumbers[0].digits}
        </Text>
      }
    </View>
  );

  render() {

    return (
      <View style={{ flex: 1,backgroundColor: 'black',justifyContent:'center',paddingTop:5}}>
        <SafeAreaView style={{ backgroundColor: 'black',margin:10, }} />
        
        <TextInput
          placeholder="Search"
          placeholderTextColor="#dddddd"
          style={{
            backgroundColor: '#2f363c',
            height: 60,
            fontSize: 36,
            padding: 10,
            color: 'white',
            borderBottomWidth: 0.5,
            borderBottomColor: '#7d90a0',
          }}
          onChangeText={value => this.searchContacts(value)}
        />

        <View style={{ flex: 1, backgroundColor: '#black' }}>
          {this.state.isLoading ? (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : null}
          <FlatList

            data={this.state.contacts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 50
                }}
              >
                <Text style={{ color: 'gray' }}>No Contacts Found</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});