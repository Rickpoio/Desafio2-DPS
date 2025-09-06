import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import shortid from "react-id-generator";
import colors from "../utils/colors";
const Formulario = ({
  citas,
  setCitas,
  guardarMostrarForm,
  guardarCitasStorage,
}) => {
  //variables para el formulario
  const [paciente, guardarPaciente] = useState("");
    const [personas, guardarPersonas] = useState("");
  const [zonaSeleccionada, guardarZonaSeleccionada] = useState("");
  const [telefono, guardarTelefono] = useState("");
  const [fecha, guardarFecha] = useState("");
  const [hora, guardarHora] = useState("");
  

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const confirmarFecha = (date) => {
    const opciones = { year: "numeric", month: "long", day: "2-digit" };
    guardarFecha(date.toLocaleDateString("es-ES", opciones));
    hideDatePicker();
  }; // Muestra u oculta el Time Picker
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const confirmarHora = (hora) => {
    const opciones = { hour: "numeric", minute: "2-digit", hour12: false };
    guardarHora(hora.toLocaleString("es-ES", opciones));
    hideTimePicker();
  }; // Crear nueva cita
  const crearNuevaCita = () => {
    // Validar
    if (
      paciente.trim() === "" ||
       personas.trim() === "" ||
      zonaSeleccionada.trim() === "" ||
      telefono.trim() === "" ||
      fecha.trim() === "" ||
      hora.trim() === "" 
    ) {
      // Falla la validación
      mostrarAlerta();
      return;
    }
    // Crear una nueva cita
    const cita = {
      paciente,
      personas,
      zonaSeleccionada,
      telefono,
      fecha,
      hora,

    };
    cita.id = shortid();
    // console.log(cita);
    // Agregar al state
    const citasNuevo = [...citas, cita];
    setCitas(citasNuevo);
    // Pasar las nuevas citas a storage
    guardarCitasStorage(JSON.stringify(citasNuevo));
    // Ocultar el formulario
    guardarMostrarForm(false);
    // Resetear el formulario

    guardarZonaSeleccionada("");
    guardarPaciente("");
    guardarPersonas("");
    guardarHora("");
    guardarFecha("");
    guardarTelefono("");
  };
  // Muestra la alerta si falla la validación
  const mostrarAlerta = () => {
    Alert.alert(
      "Error", // Titulo
      "Todos los campos son obligatorios", // mensaje
      [
        {
          text: "OK", // Arreglo de botones
        },
      ]
    );
  };
  return (
    <>
      <ScrollView style={styles.formulario}>
        <View>
          <Text style={styles.label}>Cliente:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(texto) => guardarPaciente(texto)}
          />
        </View>
        <View>
          <Text style={styles.label}>Cantidad de personas:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(texto) => guardarPersonas(texto)}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>Seleciona una zona:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={zonaSeleccionada}
              onValueChange={(itemValue) => guardarZonaSeleccionada(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Selecciona --" value="" />
              <Picker.Item label="Zona de fumadores" value="fumadores" />
              <Picker.Item label="Zona de no fumadores" value="no_fumadores" />
            </Picker>
          </View>
          {zonaSeleccionada !== "" && (
            <Text style={styles.resultado}>
              Has seleccionado:{" "}
              {zonaSeleccionada === "fumadores"
                ? "Zona de fumadores"
                : "Zona de no fumadores"}
            </Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Teléfono Contacto:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(texto) => guardarTelefono(texto)}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Text style={styles.label}>Fecha:</Text>
          <Button title="Seleccionar Fecha" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={confirmarFecha}
            onCancel={hideDatePicker}
            locale="es_ES"
            headerTextIOS="Elige la fecha"
            cancelTextIOS="Cancelar"
            confirmTextIOS="Confirmar"
          />
          <Text>{fecha}</Text>
        </View>
        <View>
          <Text style={styles.label}>Hora:</Text>
          <Button title="Seleccionar Hora" onPress={showTimePicker} />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={confirmarHora}
            onCancel={hideTimePicker}
            locale="es_ES"
            headerTextIOS="Elige una Hora"
            cancelTextIOS="Cancelar"
            confirmTextIOS=" Confirmar"
          />
          <Text>{hora}</Text>
        </View>
      
        <View>
          <TouchableHighlight
            onPress={() => crearNuevaCita()}
            style={styles.btnSubmit}
          >
            <Text style={styles.textoSubmit}>Crear Nueva Cita</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  formulario: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    marginTop: 10,
    height: 50,
    borderColor: "#e1e1e1",
    borderWidth: 1,
    borderStyle: "solid",
  },
  btnSubmit: {
    padding: 10,
    backgroundColor: colors.BUTTON_COLOR,
    marginVertical: 10,
  },
  textoSubmit: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  resultado: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
export default Formulario;
