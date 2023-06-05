import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


export default class Holidays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        countryCode: this.props.route.params.countryCode
    }

    this.props.navigation.setOptions({
        title: this.props.route.params.country
      });

    this.getHolidays()
  }

  async getHolidays() {

  }


  render() {

    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
});