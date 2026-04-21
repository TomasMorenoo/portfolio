import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

// Detectar automáticamente la raíz del proyecto
const dataDir = path.join(process.cwd(), 'data');

// Si por algún milagro no existe, la creamos
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ruta absoluta y blindada
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath);

// Tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descripcion TEXT,
    tags TEXT,
    tipo TEXT,
    imagen_url TEXT,
    demo_url TEXT
  );
  CREATE TABLE IF NOT EXISTS configuracion (
    clave TEXT PRIMARY KEY,
    valor TEXT
  );
`);

// ==========================================
// AUTO-MIGRACIONES (Actualización inteligente)
// ==========================================

// Leemos la estructura actual de la tabla "proyectos"
const columnasProyectos = db.prepare("PRAGMA table_info(proyectos)").all();

// Nos fijamos si adentro de esas columnas existe 'github_url'
const tieneGithubUrl = columnasProyectos.some(columna => columna.name === 'github_url');

// Si no existe, ejecutamos el ALTER TABLE automáticamente sin romper nada
if (!tieneGithubUrl) {
  db.exec("ALTER TABLE proyectos ADD COLUMN github_url TEXT;");
  console.log("🚀 Migración exitosa: Columna 'github_url' agregada automáticamente.");
}

const tieneDemoUsuario = columnasProyectos.some(c => c.name === 'demo_usuario');
if (!tieneDemoUsuario) {
  db.exec("ALTER TABLE proyectos ADD COLUMN demo_usuario TEXT;");
  console.log("🚀 Migración exitosa: Columna 'demo_usuario' agregada automáticamente.");
}

const tieneDemoPassword = columnasProyectos.some(c => c.name === 'demo_password');
if (!tieneDemoPassword) {
  db.exec("ALTER TABLE proyectos ADD COLUMN demo_password TEXT;");
  console.log("🚀 Migración exitosa: Columna 'demo_password' agregada automáticamente.");
}

const tieneOrden = columnasProyectos.some(c => c.name === 'orden');
if (!tieneOrden) {
  db.exec("ALTER TABLE proyectos ADD COLUMN orden INTEGER DEFAULT 0;");
  db.exec("UPDATE proyectos SET orden = id WHERE orden = 0;");
  console.log("🚀 Migración exitosa: Columna 'orden' agregada. Proyectos existentes preservados.");
}

const tieneEstado = columnasProyectos.some(c => c.name === 'estado');
if (!tieneEstado) {
  db.exec("ALTER TABLE proyectos ADD COLUMN estado TEXT DEFAULT 'Terminado';");
  console.log("🚀 Migración exitosa: Columna 'estado' agregada.");
}

const tieneVisitasDemo = columnasProyectos.some(c => c.name === 'visitas_demo');
if (!tieneVisitasDemo) {
  db.exec("ALTER TABLE proyectos ADD COLUMN visitas_demo INTEGER DEFAULT 0;");
  console.log("🚀 Migración exitosa: Columna 'visitas_demo' agregada.");
}

const tieneVisitasCodigo = columnasProyectos.some(c => c.name === 'visitas_codigo');
if (!tieneVisitasCodigo) {
  db.exec("ALTER TABLE proyectos ADD COLUMN visitas_codigo INTEGER DEFAULT 0;");
  console.log("🚀 Migración exitosa: Columna 'visitas_codigo' agregada.");
}

// ==========================================

// Inserción de configuración básica
const seed = (clave, valor) => {
  db.prepare("INSERT OR IGNORE INTO configuracion (clave, valor) VALUES (?, ?)").run(clave, valor);
};

seed('nombre', 'Tomas | Mobatai');
seed('bio', 'Especialista en Hardware & Software');
seed('email', 'contacto@mobatai.com');
seed('cv_url', ''); 
seed('whatsapp_number', '5491112345678');
seed('whatsapp_msg', 'Hola Mobatai, quería consultarte por un proyecto.');
seed('disponible', 'true');
seed('sobre_mi_id', 'Tomas Agustin Moreno Bauer');
seed('sobre_mi_base', 'Buenos Aires, ARG');
seed('sobre_mi_status', 'Estudiante UTN');
seed('sobre_mi_texto', 'Mi día a día transcurre en el soporte IT, resolviendo problemas de infraestructura y asegurando que hardware y software se comuniquen sin fricciones.\n\nTambién me enfoco en orquestar despliegues de aplicaciones en VPS utilizando Docker y desarrollando con Python y JavaScript.');
seed('github_url', '');
seed('linkedin_url', '');

export default db;