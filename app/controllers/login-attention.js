// The browser calls this after loading the authenticated user. A regenerated login
// session starts a new check; ordinary page navigation and reloads do not.
export function createLoginAttentionHandler({ scan, count, logMessage }) {
  const inFlight = new Map();
  return async (req, res) => {
    const library = res.locals.userdata?.library;
    if (!library) return res.status(403).json({ error: 'No library assigned to user' });
    if (!req.session || !req.sessionID) return res.status(401).json({ error: 'Unauthorized' });
    const checked = req.session.attentionCheckedLibraries || [];
    const key = `${req.sessionID}:${library}`;
    try {
      if (checked.includes(library)) return res.json({ count: await count(library), showNotice: false });
      let task = inFlight.get(key);
      const firstRequest = !task;
      if (!task) {
        task = scan(library);
        inFlight.set(key, task);
      }
      await task;
      const attentionCount = await count(library);
      req.session.attentionCheckedLibraries = [...new Set([...checked, library])];
      res.json({ count: attentionCount, showNotice: firstRequest && attentionCount > 0 });
    } catch (error) {
      logMessage('WARNING', 'Login invoice attention check failed', { library, error: error.message });
      // Existing failures should still be visible if Boundary is unavailable.
      try { res.json({ count: await count(library), showNotice: true, checkFailed: true }); }
      catch { res.status(503).json({ error: 'Unable to check invoices needing attention' }); }
    } finally { inFlight.delete(key); }
  };
}
