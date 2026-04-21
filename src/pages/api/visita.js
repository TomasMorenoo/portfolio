import db from '../../lib/db.js';

export async function POST({ request }) {
  try {
    const { id, tipo } = await request.json();
    if (!id || !['demo', 'codigo'].includes(tipo)) {
      return new Response(null, { status: 400 });
    }
    const col = tipo === 'demo' ? 'visitas_demo' : 'visitas_codigo';
    db.prepare(`UPDATE proyectos SET ${col} = COALESCE(${col}, 0) + 1 WHERE id = ?`).run(id);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(null, { status: 500 });
  }
}
