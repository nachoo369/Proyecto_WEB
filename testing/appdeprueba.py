from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import psycopg2
import time
from flask import jsonify


app = Flask(__name__)
app.secret_key = 'asd369'

# Configuración de la base de datos
db_config = {
    'dbname': 'clinica',
    'user': 'postgres',
    'password': 'asd369',
    'host': 'localhost',
    
}
#Ruta para index
@app.route('/')
def index():
    return render_template('index.html')
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
        "INSERT INTO cliente (rutPac, nombre, apellido, fechanac, region, ciudad, sexo, telefono, contraseña) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
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

@app.route('/procesar_login', methods=['POST'])
def procesar_login():
    try:
        rut = request.form['rut']
        contraseña = request.form['clave']

        # Conectarse a la base de datos
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        # Verificar las credenciales en la base de datos
        cursor.execute("SELECT * FROM cliente WHERE rutPac = %s AND contraseña = %s", (rut, contraseña))
        usuario = cursor.fetchone()

        conn.close()

        time.sleep(2)

        if usuario:
            # Usuario autenticado con éxito, puedes almacenar información en la sesión
            session['rut'] = usuario[0]  # Almacena el RUT en la sesión, o cualquier otro dato que desees
            return jsonify({'valid': True})
        else:
            return jsonify({'valid': False, 'error': 'Credenciales inválidas'})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 500  # Devuelve un código de estado 500 para indicar un error interno del servidor
    
# Función para obtener la información del Centro de Ayuda desde la base de datos
def obtener_informacion_centro_ayuda_desde_bd():
    # Conectar a la base de datos
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    # Ejecutar una consulta para obtener la información del Centro de Ayuda
    cursor.execute("SELECT tipo, titulo, descripcion FROM CentroDeAyuda WHERE tipo = 'Centro de Ayuda'")
    informacion_centro_ayuda = cursor.fetchone()

    # Cerrar la conexión a la base de datos
    conn.close()

    return informacion_centro_ayuda

# Función para obtener la información de Mi Clínica desde la base de datos
def obtener_informacion_mi_clinica_desde_bd():
    # Conectar a la base de datos
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    # Ejecutar una consulta para obtener la información de Mi Clínica
    cursor.execute("SELECT descripcion FROM MiClinica")
    informacion_mi_clinica = cursor.fetchone()

    # Cerrar la conexión a la base de datos
    conn.close()

    return informacion_mi_clinica

# Rutas
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/centro_ayuda')
def centro_ayuda():
    informacion_centro_ayuda = obtener_informacion_centro_ayuda_desde_bd()
    return render_template('centro_ayuda.html', informacion=informacion_centro_ayuda)

@app.route('/mi_clinica')
def mi_clinica():
    informacion_mi_clinica = obtener_informacion_mi_clinica_desde_bd()
    return render_template('mi_clinica.html', informacion=informacion_mi_clinica)

@app.route("/home")
def home():
    return render_template("home.html")
if __name__ == '__main__':
    app.run(debug=True)
