from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g, send_file
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import time
import os
from sqlalchemy import DateTime, func
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'asd369'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:asd369@localhost/clinica"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de la base de datos
db = SQLAlchemy(app)
db_config = {
    'dbname': 'clinica',
    'user': 'postgres',
    'password': 'asd369',
    'host': 'localhost'
}
#class
class HistorialConsulta(db.Model):
    __tablename__ = 'historial_consultas'
    id = db.Column(db.Integer, primary_key=True)
    rut_paciente = db.Column(db.String(100))  # Cambiado de nombre_paciente a rut_paciente
    doctor_atendio = db.Column(db.String(100))
    fecha_consulta = db.Column(db.DateTime, default=datetime.utcnow)
    horario_consulta = db.Column(db.Time)
    estado = db.Column(db.String(20), default='Pendiente')
    diagnostico = db.Column(db.String(255))
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

    return render_template("home.html")

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
            session['rut'] = usuario[0]  # Almacena el RUT en la sesión
            session['nombre'] = usuario[1]  # Almacena el nombre en la sesión
            session['apellido'] = usuario[2]  # Almacena el apellido en la sesión
            return jsonify({'valid': True})
        else:
            return jsonify({'valid': False, 'error': 'Credenciales inválidas'})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 500  # Devuelve un código de estado 500 para indicar un error interno del servidor


@app.route("/home")
def home():
    return render_template("home.html")

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

#historial
# Ruta para mostrar el historial de consultas
@app.route('/historial_consultas')
def historial_consultas():
    if 'rut' in session:
        # Filtra las consultas solo para el usuario actualmente autenticado
        rut_paciente = session['rut']
        consultas = HistorialConsulta.query.filter(HistorialConsulta.rut_paciente.contains(rut_paciente)).order_by(HistorialConsulta.fecha_consulta).all()
        return render_template('registro_consulta.html', consultas=consultas)
    else:
        return redirect(url_for('home'))
## pdf CONSULTA 
@app.route('/descargar_diagnostico/<int:consulta_id>')
def descargar_diagnostico(consulta_id):
    consulta = HistorialConsulta.query.get(consulta_id)
    if consulta and consulta.diagnostico:
        # Ajusta la ruta al directorio donde almacenas los diagnósticos
        path = os.path.join(app.root_path, 'ruta/diagnosticos', consulta.diagnostico)
        return send_file(path, as_attachment=True)
    else:
        return 'Diagnóstico no encontrado', 404
#############RESERVAAAAA
@app.route('/procesar_reserva', methods=['POST'])
def procesar_reserva():
    try:
        # Obtén los datos de la reserva del formulario
        rut_cliente = session['rut']
        doctor_seleccionado = request.form['doctor_seleccionado']
        fecha_reserva = request.form['fecha_reserva']
        horario_reserva = request.form['horario_reserva']

        # Verifica si la fecha de la reserva es posterior a la fecha actual
        fecha_actual = datetime.utcnow()
        fecha_reserva_datetime = datetime.strptime(fecha_reserva, '%d/%m/%Y')

        if fecha_reserva_datetime > fecha_actual:
            estado_reserva = 'Pendiente'
        else:
            estado_reserva = 'Atendido'

        # Insertar datos en la base de datos
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO historial_consultas (rut_paciente, doctor_atendio, fecha_consulta, horario_consulta, estado) VALUES (%s, %s, %s, %s, %s)",
            (rut_cliente, doctor_seleccionado, fecha_reserva, horario_reserva, estado_reserva)
        )

        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Reserva realizada con éxito'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/historial_consultas_ordenado', methods=['GET', 'POST'])
def historial_consultas_ordenado():
    if request.method == 'POST':
        ordenar_por = request.form.get('ordenar_por', 'fecha_consulta')
    else:
        ordenar_por = 'fecha_consulta'
    consultas = HistorialConsulta.query.filter_by(rut_paciente=session['rut']).order_by(getattr(HistorialConsulta, ordenar_por)).all()

    return render_template('registro_consulta.html', consultas=consultas)

if __name__ == '__main__':
    app.run(debug=True)
