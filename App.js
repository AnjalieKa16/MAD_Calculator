//            IM/2021/016 - P.K.A.E Karunarathne


import { useEffect, useState } from "react"; 
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons"; 
import Button from "./Components/Button"; // Import the custom Button component
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Import icons

// Checks if the value contains a valid operator or parentheses
function valueHasOp(text) {
  if (text.length === 0) return false; // No operators in an empty string

  const operators = ["+", "-", "*", "/", "%", "(", ")"];
  if (operators.includes(text[text.length - 1])) return false; // Return false if the last character is an operator.

  return operators.some((op) => text.includes(op));
}

export default function App() {
  const [input, setInput] = useState(""); // State to store user input
  const [history, setHistory] = useState([]); // State to store calculation history
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
  const [previewValue, setPreviewValue] = useState("");
  const [isResult, setIsResult] = useState(false); // Track if the last input was a result


  
  const handlePress = (value) => {

    const operators = ["+", "-", "*", "/", "%"];
  
    setInput((prevInput) => {

     // If the last input was a result and a number is pressed, start fresh
     // if 1st calculation is 7+5 = 12,and after getting result if I press new number ,start as new calculation
     // not will happen 7+5=12 ,if I press 4 not show 124
    if (isResult && !operators.includes(value)) {
      setIsResult(false); // Reset the result flag
      return value; // Start a new input
    }

    // If the previous input was a result and an operator is pressed, allow chaining
    if (isResult && operators.includes(value)) {
      setIsResult(false); // Reset the result flag
      return prevInput + value; // Append the operator to the result
    }

    // If the previous input was a result (contains "="), reset the input.
    if (prevInput.includes("=")) {
      return value === "=" ? prevInput : value; // If it's "=" don't change; otherwise, reset to the new value.
    }

    // Prevent multiple leading zeros (like "000")
    if (prevInput === "0" && value === "0") {
      return prevInput;
    }

     // If the input is '0' and a decimal point is pressed, display '0.'
     if (prevInput === "0" && value === ".") {
      return "0."; // Shows '0.' instead of just '.'
  }

    // If the input is "0" and any other number is pressed, replace "0" with the number
    if (prevInput === "0" && !operators.includes(value)) {
      return value; // Replaces 0 with the number pressed
    }

    // If the input is "0" and an operator is pressed, display "0" followed by the operator
    // 0 - 3
    if (prevInput === "0" && operators.includes(value)) {
      return "0" + value; // Show 0 followed by the operator (e.g., "0/")
    }


    // If the last character is an operator and another operator is pressed, do nothing
    // avoid countinuously press same operator in same time like ++++,-----)
    if (operators.includes(prevInput.slice(-1)) && operators.includes(value)) {
      return prevInput;
    }


      // Handle square root (√)
      if (value === "√") {
        if (prevInput === "") return ""; // Avoid error on empty input
        const result = Math.sqrt(parseFloat(prevInput));
        return result.toString();
      }
  
      // Handle percentage (%)
      if (value === "%") {
        if (prevInput === "") return ""; // Avoid error on empty input
        const result = parseFloat(prevInput) / 100;
        return result.toString();
      }

       // Handle the "0" case where you want to replace the initial 0 with a valid number
    if (prevInput === "0" && value !== "=") {
      return "0" + value; // Replace "0" with the first valid number
    }

      // Append valid input
      return prevInput + value;
    });
  };
  


  // Function to calculate the result
  const calculateResult = () => {
  
      try {
        // Check if there's a division by zero in the input
        if (input.includes("/0")) {
          setInput("Cannot divide by zero");
          setIsResult(true); // Treat as a completed result
          return;
        }

      const result = eval(input); // Evaluate the input string
      setHistory([...history, `${input} = ${result}`]); // Add the calculation to history
      setInput(result === 0 ? "0" : result.toString()); // If the result is 0, show "0"
      setIsResult(true); // Mark the result as finalized
      
    } catch (e) {
      setInput("Error"); // Handle invalid expressions
      setIsResult(true); // Prevent further appending until reset
    }

      
  };

  // Function to clear the input
  const clearInput = () => {
    setInput("");
  };

  // Function for backspace
  const handleBackSpace = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  // Function to toggle the history modal
  const handleMenuPress = () => {
    setModalVisible(true); // Show modal
  };

  const closeModal = () => {
    setModalVisible(false); // Hide modal
  };

  // Calculate font size dynamically based on the input length
  const calculateFontSize = (text) => {
    const baseFontSize = 40; // Default font size
    const maxFontSize = 48; // Maximum font size
    const minFontSize = 24; // Minimum font size
    const maxLength = 12; // Max text length

    // Reduce font size if the text length exceeds `maxLength`
    if (text.length > maxLength) {
      return Math.max(minFontSize, maxFontSize - (text.length - maxLength) * 2);
    }
    return maxFontSize; // Default font size for shorter inputs
  };

  {/* Update the previewValue whenever calValue changes and contains a valid operator */}
  useEffect(() => {
    if (valueHasOp(input)) {
      try {
        const prevAns = Function(`return ${input}`)();
        setPreviewValue(`${prevAns}`);
      } catch (error) {
        setPreviewValue("");
      }
    } else {
      setPreviewValue("");
    }
  }, [input]);

  // Handle the "=" button

  return (
    <View style={styles.container}>
      {/* Three-Dot Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Ionicons name="ellipsis-vertical" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Display */}
      
      {/*
      <View style={styles.display}>
        <Text style={styles.displayText}>{input || "0"}</Text>
      </View>*/}

      <View style={styles.display}>
      <ScrollView
      horizontal
      contentContainerStyle={{ justifyContent: "flex-end" }}
      showsHorizontalScrollIndicator={false}
    >
    <Text
      style={[
        styles.displayText,
        { fontSize: calculateFontSize(input) }, // Adjusts font size dynamically
      ]}
    >
          {input || "0"}
        </Text>
      </ScrollView>
    </View>

      {/* Preview input */}
      <TextInput
        value={previewValue}
        onChangeText={setPreviewValue}
        cursorColor="#8ad8d1"
        textAlign="right"
        caretHidden={true}
        showSoftInputOnFocus={false}
        style={[styles.input, styles.prevInput]}
      />
      <View style={{ height: 2, backgroundColor: "#575757", marginVertical: 20 }} />

      {/* Calculator Buttons */}
      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <Button label="AC" handlePress={clearInput} type="clear" />
          <Button label="÷" handlePress={() => handlePress("/")} type="operator"/>
          <Button label="×" handlePress={() => handlePress("*")} type="operator" />
          <TouchableOpacity onPress={handleBackSpace} style={styles.backButton}>
            <Ionicons name="backspace-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <Button label="7" handlePress={() => handlePress("7")} />
          <Button label="8" handlePress={() => handlePress("8")} />
          <Button label="9" handlePress={() => handlePress("9")} />
          <Button label="-" handlePress={() => handlePress("-")} type="operator" />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <Button label="4" handlePress={() => handlePress("4")} />
          <Button label="5" handlePress={() => handlePress("5")} />
          <Button label="6" handlePress={() => handlePress("6")} />
          <Button label="+" handlePress={() => handlePress("+")} type="operator" />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <Button label="1" handlePress={() => handlePress("1")} />
          <Button label="2" handlePress={() => handlePress("2")} />
          <Button label="3" handlePress={() => handlePress("3")} />
          <Button label="√" handlePress={handlePress} type="operator" /> 
          
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <Button label="0" handlePress={() => handlePress("0")} />
          <Button label="." handlePress={() => handlePress(".")} />
          <Button handlePress={handlePress} label={"%"} type="operator" icon={<FontAwesome5 name="percent" size={24} color="white" />} />
         <Button label="=" handlePress={calculateResult} type="equal" />

        </View>
      </View>

      {/* History Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calculation History</Text>
            <ScrollView style={styles.historyList}>
              {history.length === 0 ? (
                <Text style={styles.historyItem}>No history available</Text>
              ) : (
                history.map((item, index) => (
                  <Text key={index} style={styles.historyItem}>
                    {item}
                  </Text>
                ))
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  menuButton: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 0,
  },
  display: {
    width: "85%",
    height: 120, 
    backgroundColor: "#333",
    padding: 20,
    top: 70,
    marginBottom: 0,
    borderRadius: 10,
    overflow: "hidden",      // Prevents text overflow from affecting layout
  },
  displayText: {
    fontSize: 40,
    color: "#fff",
    textAlign: "right",
  },
  buttonContainer: {
    width: "80%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#616161",    // #202020
    borderRadius: 50, // Round button edges 
    width: 70, // Adjust width of button
    height: 70, // 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  historyItem: {
    fontSize: 18,
    marginVertical: 5,
    color: "#333",
  },

  prevInput: {
    fontSize: 24,
    marginTop: 70,
    marginBottom: 0,
    textAlign:"right",
    color: "#616161",
    width: "85%",        // Ensure width matches the container width
    alignSelf: "center", // Align the TextInput itself to the end of the parent
    paddingRight: 10, 
    backgroundColor: "transparent", // Remove any background interference
    borderWidth: 0, 
  },

  closeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
