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

export default db;