import { logMessage } from '../util/logger.js';
import config from '../util/config.js';

export async function tokenGenerator() {
  try {
    const response = await fetch(config.aggie.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${config.aggie.tokenAuth}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Token fetch failed: HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.access_token;
    }
  } catch (error) {
    logMessage('DEBUG', 'tokenGenerator', error);
  }
}
