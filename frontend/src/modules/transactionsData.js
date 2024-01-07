import { el, list, setChildren, mount } from 'redom';
export function transactionsData(accArr, extend) {
  const account = accArr.account;

  const transactionsArr = accArr.transactions;
  const indexMax = transactionsArr.length - 1;
  const trAmount = [];
  const trDate = [];
  const trTo = [];
  const trFrom = [];
  const transTableData = [];
  const D = [];
  let M = [];
  let Y = [];

  if (transactionsArr.length > 0) {

    for (let i = indexMax; i >= 0; i--) {
      if (i < 0) break;
      trAmount[i] = transactionsArr[i].amount;
      trDate[i] = transactionsArr[i].date;
      trTo[i] = transactionsArr[i].to;
      trFrom[i] = transactionsArr[i].from;
      D[i] = new Date(trDate[i]);
      M[i] = D[i].getMonth();
      Y[i] = D[i].getFullYear();

      D[i] = ('0' + D[i].getDate()).slice(-2) + '.' + ('0' + (D[i].getMonth() + 1)).slice(-2) + '.' + D[i].getFullYear()
      if (trTo[i] !== account) trAmount[i] = -trAmount[i];
    }

    let indexMin = indexMax - 9;
    if (extend) indexMin = 0;

    for (let i = indexMax; i >= indexMin; i--) {
      if (i < 0) break;
      if (trTo[i] === account) { transTableData[i] = el('tr.historyElement', el('td', trFrom[i]), el('td', trTo[i]), el('td.plus', `+${trAmount[i]} ₽`), el('td', D[i])) }
      else {
        transTableData[i] = el('tr.historyElement', el('td', trFrom[i]), el('td', trTo[i]), el('td.minus', `${trAmount[i]} ₽`), el('td', D[i]));
      }
    }
  }

  return [transTableData, transactionsArr.length, D, M, Y, trAmount];
}