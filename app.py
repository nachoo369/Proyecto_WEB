from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import psycopg2
import time

app = Flask(__name__)
app.secret_key = 'asd369'

# Configuración de la base de datos
db_config = {
    'dbname': 'clinica',
    'user': 'postgres',
    'password': 'asd369',
    'host': 'localhost'
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


@app.route("/home")
def home():
    return render_template("home.html")


@app.route('/registro_consulta')
def consulta():
    # Conectarse a la base de datos para obtener la lista de médicos
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    # Obtener la lista de médicos
    cursor.execute("SELECT rutP, nombre FROM profesionales")
    medicos = cursor.fetchall()

    # Cerrar la conexión a la base de datos
    conn.close()

    # Renderizar el template con la lista de médicos
    return render_template("registro_consulta.html", medicos=medicos)

# Ruta para procesar el formulario de registro de consulta
@app.route('/procesar_registro_consulta', methods=['POST'])
def procesar_registro_consulta():
    # Recuperar datos del formulario
    nombre = request.form['nombre']
    apellidos = request.form['apellidos']
    rut = request.form['rut']
    tipo_consulta = request.form['tipo-consulta']
    consultorio = request.form['consultorio']
    medico = request.form['medico']
    fecha = request.form['fecha']
    horario = request.form['horario']

    # Conectarse a la base de datos
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    # Insertar datos en la base de datos (tabla de consultas)
    cursor.execute(
        "INSERT INTO consultas (nombre, apellidos, rut, tipo_consulta, consultorio, medico, fecha, horario) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (nombre, apellidos, rut, tipo_consulta, consultorio, medico, fecha, horario)
    )

    conn.commit()
    conn.close()

    # Aquí deberías implementar la lógica para obtener los horarios disponibles según el médico y la fecha seleccionados
    # Puedes almacenar estos horarios en una lista y devolverla como respuesta al cliente

    # Devolver una respuesta indicando que la consulta se registró correctamente y la lista de horarios disponibles
    return jsonify({'mensaje': 'Consulta registrada con éxito', 'horarios': obtener_horarios_disponibles()})

# Función para obtener horarios disponibles desde la base de datos
@app.route('/obtener_horarios_disponibles', methods=['POST'])
def obtener_horarios_disponibles():
    try:
        rut_medico = request.form['rut_medico']  # Asegúrate de tener este campo en tu formulario
        fecha_seleccionada = request.form['fecha']  # Asegúrate de tener este campo en tu formulario

        # Conectarse a la base de datos
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        # Realizar la consulta para obtener los horarios disponibles del médico en la fecha seleccionada
        cursor.execute("SELECT hora_inicio, hora_fin FROM HORARIO WHERE rutP = %s", (rut_medico,))
        horarios_disponibles = cursor.fetchall()

        conn.close()

        # Devolver los horarios disponibles como respuesta en formato JSON
        return jsonify({'horarios': horarios_disponibles})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/calendario")
def calendario():
    return render_template("calendario.html")

@app.route('/mi_clinica')
def mi_clinica():
    if 'rut' in session:
        # Puedes recuperar información adicional del usuario según sea necesario
        rut_usuario = session['rut']
        return render_template('mi_clinica.html', rut=rut_usuario)
    else:
        # Si no hay sesión, redirige a la página de inicio o a la página de inicio de sesión
        return redirect(url_for('home'))

@app.route('/cerrar_sesion')
def cerrar_sesion():
    session.clear()
    return redirect(url_for('home'))

@app.route('/about-us')
def about_us():
    return render_template('about-us.html')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/ayuda')
def ayuda():
    return render_template('ayuda.html')

if __name__ == '__main__':
    app.run(debug=True)
