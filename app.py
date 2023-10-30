from flask import Flask, render_template, request, redirect, url_for
import psycopg2

app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    'dbname': 'nombre_de_tu_base_de_datos',
    'user': 'tu_usuario',
    'password': 'tu_contraseña',
    'host': 'localhost'
}

# Ruta para mostrar el formulario de registro
@app.route('/registro')
def registro():
    return render_template('registro.html')

# Ruta para procesar el registro
@app.route('/procesar_registro', methods=['POST'])
def procesar_registro():
    nombre = request.form['nombre']
    apellidos = request.form['apellidos']
    rut = request.form['rut']
    clave = request.form['clave']
    confirmar_clave = request.form['confirmar-clave']
    fecha_nacimiento = request.form['fecha-nacimiento']
    region = request.form['region']
    ciudad = request.form['ciudad']
    sexo = request.form['sexo']
    telefono = request.form['telefono']

    # Conectarse a la base de datos
    conn = psycopg2.connect(database="clinica", user="postgres", password="asd369", host="localhost", port="5432", options="-c client_encoding=UTF8")
    cursor = conn.cursor()

    # Insertar datos en la base de datos
    cursor.execute(
        "INSERT INTO cliente (rutPac, nombre, apellido, fechanac, region, ciudad, sexo, telefono, clave) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (rut, nombre, apellidos, fecha_nacimiento, region, ciudad, sexo, telefono, clave)
    )

    conn.commit()
    conn.close()

    return "Registro exitoso"

# INICIO DE SESION
#mostrar formulario de inciio
@app.route('/login')
def inicio_sesion():
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)
