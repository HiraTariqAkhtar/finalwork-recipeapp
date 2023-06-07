import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import axios from "axios";
import {HOLIDAYS_API_KEY} from '@env'



export default class Holidays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        holidays: [{
            name: "Independence day",
            description: "This is the description",
            locations: "All",
            datetime: {
                year: 2023,
                month: 8,
                day: 14
            },
            holidayType: "Public holiday"
        }]
    }

    this.props.navigation.setOptions({
        title: this.props.route.params.country
      });

    //this.getHolidays()
  }

  async getHolidays() {
      let date = new Date()
      let currentDay = date.getDate()
      let currentMonth = date.getMonth()+1
      let currentYear = date.getFullYear()

      let holidaysThisMonth = []

      for(let i = currentMonth; i <= 12; i++) {
          axios.get(`https://calendarific.com/api/v2/holidays?api_key=${HOLIDAYS_API_KEY}&country=${this.props.route.params.countryCode}&month=${i}&year=${currentYear}`)
          .then((res) => {
              //console.log(res.data.response.holidays)
              let holidays = res.data.response.holidays
              holidays.forEach((holiday) => {
                  if(holiday.date.datetime.day >= currentDay){
                      holidaysThisMonth.push({
                          name: holiday.name,
                          description: holiday.description,
                          locations: holiday.locations,
                          datetime: holiday.date.datetime,
                          holidayType: holiday.primary_type
                      })
                  }
              });
              holidaysThisMonth.sort((a,b) => a.datetime.month - b.datetime.month)
              this.setState({holidays: holidaysThisMonth})
            })
      }
  }


  render() {
     
      
      let holidays = this.state.holidays.map((holiday) => (
          <View style={styles.holiday}>
              <Text style={styles.holidayName}>{holiday.name} ({holiday.holidayType})</Text>
              <Text style={styles.holidayDate}>{holiday.datetime.day} - {holiday.datetime.month} - {holiday.datetime.year}</Text>

              {holiday.description &&
                  <View style={styles.iconText}>
                <Ionicons
                    name={"information-circle"}
                    size={hp("3%")}
                    marginRight={wp("2%")}
                />
                <Text style={styles.text}>{holiday.description}</Text>
              </View>}

             {holiday.locations &&
                 <View style={styles.iconText}>
                <Ionicons
                    name={"location"}
                    size={hp("3%")}
                    marginRight={wp("2%")}
                />
                <Text style={styles.text}>{holiday.locations}</Text>
              </View>}
          </View>
      ))

    return (
      <View style={styles.container}>
          <ScrollView style={{marginBottom: hp("5%")}}>
              {holidays}
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  holiday: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    width: wp("90%"),
    borderRadius: 10,
    marginTop: hp("3%"),
    marginHorizontal: wp ("5%")
  },
  holidayName: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2.5%"),
  },
  holidayDate: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2%"),
  },
  text: {
    fontFamily: "Nunito_400Regular",
    fontSize: hp("2%"),
    width:wp("75%")
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("1%"),
  },
});