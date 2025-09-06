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
  const [paciente, guardarPaciente] = useState("");
  const [personas, guardarPersonas] = useState("");
  const [zonaSeleccionada, guardarZonaSeleccionada] = useState("");
  const [telefono, guardarTelefono] = useState("");
  const [fecha, guardarFecha] = useState(null);
  const [hora, guardarHora] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const confirmarFecha = (date) => {
    guardarFecha(date);
    hideDatePicker();
  };

  const confirmarHora = (time) => {
    guardarHora(time);
    hideTimePicker();
  };

  const mostrarAlerta = (mensaje = "Todos los campos son obligatorios") => {
    Alert.alert("Error", mensaje, [{ text: "OK" }]);
  };

  const crearNuevaCita = () => {
    if (
      paciente.trim() === "" ||
      personas.trim() === "" ||
      zonaSeleccionada.trim() === "" ||
      telefono.trim() === "" ||
      !fecha ||
      !hora
    ) {
      mostrarAlerta();
      return;
    }

    // Validar teléfono
    const telefonoNum = parseInt(telefono, 10);
    if (isNaN(telefonoNum) || telefonoNum < 0) {
      mostrarAlerta("El teléfono debe ser un número positivo");
      return;
    }

    // Validar cantidad de personas
    const personasNum = parseInt(personas, 10);
    if (isNaN(personasNum) || personasNum <= 0) {
      mostrarAlerta("La cantidad de personas debe ser mayor a 0");
      return;
    }

    // Validar fecha y hora futura
    const fechaHoraCompleta = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      hora.getHours(),
      hora.getMinutes()
    );

    const ahora = new Date();
    if (fechaHoraCompleta <= ahora) {
      mostrarAlerta("La fecha y hora deben ser posteriores a la actual");
      return;
    }

    const cita = {
      id: shortid(),
      paciente,
      personas: personasNum,
      zonaSeleccionada,
      telefono: telefonoNum,
      fecha: fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      hora: hora.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const citasNuevo = [...citas, cita];
    setCitas(citasNuevo);
    guardarCitasStorage(JSON.stringify(citasNuevo));
    guardarMostrarForm(false);

    // Reset formulario
    guardarPaciente("");
    guardarPersonas("");
    guardarZonaSeleccionada("");
    guardarTelefono("");
    guardarFecha(null);
    guardarHora(null);
  };

  return (
    <ScrollView style={styles.formulario}>
      <View>
        <Text style={styles.label}>Cliente:</Text>
        <TextInput
          style={styles.input}
          value={paciente}
          onChangeText={guardarPaciente}
        />
      </View>

      <View>
        <Text style={styles.label}>Cantidad de personas:</Text>
        <TextInput
          style={styles.input}
          value={personas}
          onChangeText={guardarPersonas}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Selecciona una zona:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={zonaSeleccionada}
            onValueChange={guardarZonaSeleccionada}
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
          value={telefono}
          onChangeText={guardarTelefono}
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
          minimumDate={new Date()} // Desactiva fechas pasadas
        />
        {fecha && (
          <Text style={styles.resultado}>
            {fecha.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "2-digit",
            })}
          </Text>
        )}
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
        />
        {hora && (
          <Text style={styles.resultado}>
            {hora.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>

      <View>
        <TouchableHighlight onPress={crearNuevaCita} style={styles.btnSubmit}>
          <Text style={styles.textoSubmit}>Crear Nueva Reserva</Text>
        </TouchableHighlight>
      </View>
    </ScrollView>
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
    paddingHorizontal: 10,
  },
  btnSubmit: {
    padding: 10,
    backgroundColor: "#cf7272ff",
    marginVertical: 10,
    borderRadius: 5,
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
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Formulario;
