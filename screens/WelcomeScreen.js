import * as React from 'react';
import { ScrollView, Text, StyleSheet, Image, View, Pressable, FlatList, Animated, TextInput } from 'react-native';
import Header from '../components/Header';
import hero from '../img/Hero image.png';
import search from '../img/search.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { debounce } from 'lodash';

export default function WelcomeScreen({navigation}) {
  const [menuData, setMenuData] = useState(null);
  const db = SQLite.openDatabase('little_lemon.db');
  const [searchString, setSearchString] = useState('');
  const [categories, setCategories] = useState([
    { name: 'starters', pressed: false },
    { name: 'mains', pressed: false },
    { name: 'desserts', pressed: false },
    { name: 'drinks', pressed: false },
    { name: 'specials', pressed: false },
  ]);
  const [searchWidth, setSearchWidth] = useState(new Animated.Value(0));

  const handlePress = (category, searchText) => {
    // Create a new array that represents the updated state
    let updatedCategories;
    let activeCategories;
    if(category !== undefined) {
      updatedCategories = categories.map(item =>
        item.name === category.name
          ? { ...item, pressed: !item.pressed }
          : item
      );
    
      // Update the state with the new array
      setCategories(updatedCategories);
    }
  
    // Get the names of all active categories from the updated array
    if(updatedCategories !== undefined) {
      activeCategories = updatedCategories
      .filter(item => item.pressed)
      .map(item => item.name);
    }
    
  
    // Execute SQL query to get data for the active categories
    db.transaction(tx => {
      if (activeCategories !== undefined && activeCategories.length > 0) {
        tx.executeSql(
          `SELECT * FROM menu WHERE category IN (${activeCategories.map(() => '?').join(',')}) AND name LIKE ?`,
          [...activeCategories, `%${searchText}%`],
          (_, { rows: { _array } }) => setMenuData(_array),
          (_, error) => console.log(error)
        );
      } else {
        tx.executeSql(
          'SELECT * FROM menu WHERE name LIKE ?',
          [`%${searchText}%`],
          (_, { rows: { _array } }) => setMenuData(_array),
          (_, error) => console.log(error)
        );
      }
    });
  };

  const debouncedHandlePress = debounce(handlePress, 500);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, category TEXT, description TEXT, image TEXT, name TEXT, price REAL);',
        [],
        () => {
        },
        (_, error) => {
          console.error('Failed to create table', error);
          return true; // Stop the transaction
        }
      );
      tx.executeSql('SELECT * FROM menu', [], (_, { rows }) => {
        if (rows.length > 0) {
          setMenuData(rows._array);
        } else {
          axios.get('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json')
            .then(response => {
              setMenuData(response.data.menu);
              db.transaction(tx => {
                response.data.menu.forEach(item => {
                  tx.executeSql('INSERT INTO menu (category, description, image, name, price) values (?, ?, ?, ?, ?)', [item.category, item.description, item.image, item.name, item.price]);
                });
              });
            })
            .catch(error => {
              console.error('There was an error!', error);
            });
        }
      });
    });
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const animateSearchBar = () => {
    Animated.timing(searchWidth, {
      toValue: isSearchOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      // Update the state variable after the animation is complete
      setIsSearchOpen(!isSearchOpen);
      setSearchString('');
      debouncedHandlePress(undefined, '');
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <View style={styles.headerView }>
          <View style={styles.textHeaderContainer}>
            <Text style={styles.subtitleText}>Chicago</Text>
            <Text style={styles.regularText}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image source={hero} style={styles.headerImage} />
        </View> 
        <Animated.View style={{ width: searchWidth.interpolate({ inputRange: [0, 1], outputRange: ['5%', '97%'] }) }}>
          <Pressable onPress={animateSearchBar} style={{flexDirection: "row" }}>
            <Image source={search} style={styles.searchIcon} />
            <TextInput style={[styles.searchInput]} placeholder="Search..." value={searchString}
            onChangeText={text => {
              setSearchString(text);
              debouncedHandlePress(undefined, text);
            }
            }/>
          </Pressable>
        </Animated.View>
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.sectionText}>Order for Delivery!</Text>
        <ScrollView style={styles.filterContainer} horizontal={true} showsHorizontalScrollIndicator={false}> 
          {categories.map((category) => (
            <Pressable 
              onPress={() => handlePress(category,searchString)}
              key={category.name} 
              style={category.pressed ? styles.filterButtonActive : styles.filterButton}
            >
              <Text style={category.pressed ? styles.regularText : styles.regularTextInactive}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {menuData === null ? <Text>Loading...</Text> : null}
        <FlatList
          style={styles.menuList}
          data={menuData}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemHeaderContainer}>
                <Text style={styles.itemHeader}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <Image source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`}} style={styles.itemImage} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#495E57',
    width: '100%',
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 64,
    paddingHorizontal: 10,
    marginVertical: 0,
    fontWeight: 'medium',
    color: '#F4CE14',
    fontFamily: 'MarkaziText',
  },
  subtitleText: {
    fontSize: 40,
    color: '#EDEFEE',
    textAlign: 'center',
    fontFamily: 'MarkaziText',
  },
  regularText: {
    fontSize: 16,
    color: '#EDEFEE',
    textAlign: 'left',
    fontFamily: 'Karla',
    fontWeight: 'medium',
  },
  regularTextInactive: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'Karla',
    fontWeight: 'medium',
  },
  sectionText: {
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'Karla',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textHeaderContainer: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 0.6,
  },
  headerImage: {
    width: 150,
    height: 150,
    borderRadius: 16,
    alignSelf: 'flex-end',
    margin: 10,
    flex: 0.4,
  },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDEFEE',
    marginHorizontal: 10,
    marginVertical: 10,
    zIndex:1,
  },
  itemHeader: {
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'Karla',
  },
  itemHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'Karla',
    color: "#495E57",
  },
  itemPrice: {
    fontSize: 26,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'Karla',
    color: "#495E57",
    marginVertical: 15,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  item: {
    paddingVertical: 10,
    height: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  filterButtonActive: { 
    backgroundColor: '#495E57',
    borderRadius: 16,
    margin: 5,
    marginLeft: 0,
    padding: 10,
    height: 40,
  },
  filterButton: { 
    backgroundColor: '#DDDDDD',
    borderRadius: 16,
    margin: 5,
    marginLeft: 0,
    padding: 10,
    height: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDEFEE',
    paddingBottom: 0,
    height: 50,
    maxHeight: 50,
    flex: 0.6,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  menuList: {
    backgroundColor: '#EDEFEE',
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#EDEFEE',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
    padding: 10,
  },
  mainContainer: {
    backgroundColor: '#EDEFEE',
    flexDirection: 'column',
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 30,
    marginLeft: -30,
    marginTop: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1,
    backgroundColor: '#EDEFEE',
    zIndex:0,
    borderWidth: 0,
  },
});
