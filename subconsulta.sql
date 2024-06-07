-- Se creo la base de datos bank
CREATE TABLE transferencias (
    descripcion varchar(50),
    fecha varchar(10),
    monto DECIMAL,
    cuenta_origen INT,
    cuenta_destino INT
);

CREATE TABLE cuentas (
    id INT,
    saldo DECIMAL CHECK (saldo >= 0)
);

INSERT INTO cuentas values (1, 20000);
INSERT INTO cuentas values (2, 10000);

SELECT * FROM cuentas;

SELECT * FROM transferencias;

DELETE FROM transferencias 
WHERE (fecha, monto) IN (
    SELECT fecha, monto
    FROM transferencias 
    ORDER BY fecha DESC 
    LIMIT 15
);

