import React from "react";
import { TouchableHighlight, Text, StyleSheet } from "react-native";

export default function Button({ label, handlePress, type }) {
  // Set button background color based on the type
  const getTextColor = type === "operator" ? "white": type === "equal" ? "white" : type === "clear" ? "white" : "#fff";
  const getButtonColor =
    type === "equal"
      ? { backgroundColor: "#4CAF50" }
      : type === "operator"
      ? { backgroundColor: "#616161" }
      : type === "clear"
      ? { backgroundColor: "#616161" }
      : { backgroundColor: "#333" }; // Default color for other buttons
//#616161

  return (
    <TouchableHighlight
      underlayColor={type === "equal" ? "#04ac04" : "#444444"}
      style={[styles.button, getButtonColor]}
      onPress={() => handlePress(label)}
    >
      <Text style={{ fontSize: 30, color: getTextColor, fontWeight: "bold" }}>
        {label}
      </Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  backButton: {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  width: '100%',
  height: '100%',
  borderRadius: 50,
  padding: 10,
  
},

  button: {
    borderRadius: 50, // Round button edges like iPhone calc
    width: 70, // Adjust width of button
    height: 70, // Adjust height of button
    alignItems: "center", // Center text or icon
    justifyContent: "center", // Center text or icon vertically
    margin:3, // Space between buttons
   
  },

  buttonText: {
    fontSize: 28, // Font size for the button text
    fontWeight: "bold", // Bold text for buttons
  },
});

