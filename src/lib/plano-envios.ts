// Planejamento puro (sem dependências): usado pela UI e pela fila BullMQ.
export function planejarEnvios(qtd: number, opts: { porHora?: number; inicio?: number; fim?: number; limiteDiario?: number; agora?: Date } = {}) {
  const { porHora = 20, inicio = 9, fim = 18, limiteDiario = 50, agora = new Date() } = opts;
  const horarios: Date[] = [];
  const cursor = new Date(agora);
  let noDia = 0;
  let naHora = 0;
  let horaAtual = cursor.getHours();
  while (horarios.length < qtd) {
    if (cursor.getHours() < inicio) cursor.setHours(inicio, 0, 0, 0);
    if (cursor.getHours() >= fim || noDia >= limiteDiario) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(inicio, 0, 0, 0);
      noDia = 0;
    }
    if (cursor.getHours() !== horaAtual) { horaAtual = cursor.getHours(); naHora = 0; }
    if (naHora >= porHora) { cursor.setHours(cursor.getHours() + 1, 0, 0, 0); continue; }
    horarios.push(new Date(cursor));
    noDia++;
    naHora++;
    cursor.setMinutes(cursor.getMinutes() + 3 + Math.floor(Math.random() * 3)); // 3-5 min
  }
  return horarios;
}
