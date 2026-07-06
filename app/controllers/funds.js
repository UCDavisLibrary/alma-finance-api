import { fetchAllFunds, deleteFund } from './dbcalls.js';
import { logMessage } from '../util/logger.js';

export async function getViewFunds(req, res) {
  try {
    const funds = await fetchAllFunds();
    res.render('fund-list', { title: 'View All Funds', funds, isUser: true, isAdmin: false });
  } catch (error) {
    logMessage('DEBUG', 'funds: getViewFunds()', error);
    res.redirect('/');
  }
}

export async function deleteFundHandler(req, res) {
  const id = req.body.id ?? req.params.fundId;
  try {
    const result = await deleteFund(id);
    if (result) {
      logMessage('INFO', `funds: deleteFundHandler(). Deleted fund ${id}`);
      res.redirect('/funds');
    }
  } catch (error) {
    logMessage('DEBUG', 'funds: deleteFundHandler()', error);
  }
}
