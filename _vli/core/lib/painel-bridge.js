/* VLI - ponte entre painel.html (localStorage) e sessão VLI (lp.json em disco)
   Uso: importar no painel.html pra sincronizar estado bidirecional. */

(function () {
  'use strict';

  const STORAGE_KEY = 'lps_imoveis_v1';

  function exportToVli() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: false, error: 'localStorage vazio' };
    try {
      const data = JSON.parse(raw);
      return { ok: true, lps: data.lps || [] };
    } catch (e) {
      return { ok: false, error: 'JSON inválido no localStorage' };
    }
  }

  function importFromVli(lpJson) {
    if (!lpJson || !lpJson.nome) return { ok: false, error: 'lp.json inválido' };

    const raw = localStorage.getItem(STORAGE_KEY);
    let data;
    try { data = raw ? JSON.parse(raw) : { lps: [] }; } catch { data = { lps: [] }; }

    const idx = data.lps.findIndex(l => l.slug === lpJson.slug || l.id === lpJson.id);
    if (idx >= 0) {
      data.lps[idx] = { ...data.lps[idx], ...lpJson };
    } else {
      data.lps.push(lpJson);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ok: true, count: data.lps.length };
  }

  function syncStatus() {
    const result = exportToVli();
    if (!result.ok) return result;
    return {
      ok: true,
      total: result.lps.length,
      lps: result.lps.map(lp => ({
        id: lp.id,
        slug: lp.slug,
        nome: lp.nome,
        template: lp.template,
        palette: lp.palette,
        updatedAt: lp.updatedAt || lp.createdAt
      }))
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportToVli, importFromVli, syncStatus };
  }
  if (typeof window !== 'undefined') {
    window.VLI_bridge = { exportToVli, importFromVli, syncStatus };
  }
})();
