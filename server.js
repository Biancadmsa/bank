import pkg from "pg";
const { Pool } = pkg;
import chalk from "chalk";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bank",
  password: "postgres",
  port: 5432,
});

// 1- Crear una función asíncrona que registre una nueva transferencia utilizando una transacción SQL. Debe mostrar por consola la última transferencia registrada
async function nuevaTransferencia(
  descripcion,
  fecha,
  monto,
  cuenta_origen,
  cuenta_destino
) {
  const client = await pool.connect(); // Se establece una conexión con la base de datos
  try {
    await client.query("BEGIN"); // Se inicia una transacción SQL

    // Se registra la nueva transferencia en la tabla de transferencias
    await client.query(
      "INSERT INTO transferencias(descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES($1, $2, $3, $4, $5)",
      [descripcion, fecha, monto, cuenta_origen, cuenta_destino]
    );

    // Se obtiene la última transferencia registrada
    const result = await client.query(
      "SELECT * FROM transferencias ORDER BY fecha DESC LIMIT 1"
    );

    await client.query("COMMIT"); // Se confirma la transacción SQL
    console.log(chalk.green("Última transferencia registrada:"), result.rows); // Se muestra por consola la última transferencia registrada
  } catch (e) {
    await client.query("ROLLBACK"); // En caso de error, se revierte la transacción SQL
    console.error(chalk.red("Error en la transacción:"), e); // Se muestra por consola el error
    return e; // Se retorna el error en caso de fallar
  } finally {
    client.release(); // Se libera la conexión con la base de datos
  }
}

// 2- Realizar una función asíncrona que consulte la tabla de transferencias y retorne los últimos 10 registros de una cuenta en específico.
async function ultimasTransferenciasCuenta(cuenta_id) {
  try {
    // Se realiza una consulta a la tabla de transferencias para obtener los últimos 10 registros de una cuenta específica
    const result = await pool.query(
      "SELECT * FROM transferencias WHERE cuenta_origen = $1 OR cuenta_destino = $1 ORDER BY fecha DESC LIMIT 10",
      [cuenta_id]
    );
    return result.rows; // Se retorna el resultado de la consulta
  } catch (e) {
    console.error(chalk.red("Error al consultar las transferencias:"), e); // Se muestra por consola el error en caso de fallar la consulta
    return []; // Se devuelve un arreglo vacío en caso de error
  }
}

// 3-Realizar una función asíncrona que consulte el saldo de una cuenta en específico.
async function consultarSaldo(cuenta_id) {
  try {
    // Se realiza una consulta a la tabla de cuentas para obtener el saldo de una cuenta específica
    const result = await pool.query(
      "SELECT id, saldo FROM cuentas WHERE id = $1",
      [cuenta_id]
    );
    const cuenta = result.rows[0];
    console.log(
      chalk.yellow(`Saldo de la cuenta ${cuenta.id}: ${cuenta.saldo}`)
    ); // Se muestra por consola el saldo de la cuenta
    return cuenta; // Se retorna el saldo de la cuenta
  } catch (e) {
    console.error(chalk.red("Error al consultar el saldo:"), e); // Se muestra por consola el error en caso de fallar la consulta
    return null; // Se devuelve null en caso de error
  }
}

// Ejecutar los registros
async function Ejemplos() {
  
  // Ejemplo 1: Registrar todas las transferencias
  await nuevaTransferencia("transferencia", "2024-06-06", 50, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 50, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 50, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 30, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 14, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 20, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 134, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 67, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 78, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 12, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 14, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 440, 1, 2);
  await nuevaTransferencia("transferencia", "2024-06-06", 5500, 2, 3);

  // Ejemplo 2: Consultar las últimas 10 transferencias de una cuenta
  const ultimasTransferencias = await ultimasTransferenciasCuenta(1);
  console.log(
    chalk.cyan("Últimas 10 transferencias de una misma cuenta:"),
    ultimasTransferencias
  );

  // Ejemplo 3: Consultar saldo de una cuenta
  await consultarSaldo(1);
}

// Ejecutar los ejemplos
Ejemplos();
