import { el, list, setChildren, mount } from 'redom';
import { getCurrentAcc } from './getCurrentAcc';
import { header, menu, accountsNav, atmNav, currencyNav } from './header';
import { getAccounts } from './getAccounts';
import router from '../router';
import { ItcCustomSelect } from './itc-custom-select';
import { currentAccountView } from './currentAccount';

export function accountsView() {
  let select2;
  let token = '';
  token = JSON.parse(localStorage.getItem('tokenSave'))
  let accountItemArr = JSON.parse(localStorage.getItem('accSave'))
  let accArr;


  for (let i = 0; i < accountItemArr.length; i++) {
    router
      .on(`/${accountItemArr[i].account}`, () => {
        const curr = currentAccountView(accountItemArr[i].account, i);
        menu.classList.remove('none');
        setChildren(document.body, header, curr);
      })

  }

  const lastTransactionDateFull = [];
  const lastTransactionDate = [];
  const lastTransactionDateMonth = [];
  const lastTransactionDateDay = [];
  const lastTransactionDateYear = [];
  let transactionsArr = [];
  const accountsTitle = el('h1.accountsTitle', 'Ваши счета');
  let sortDefault = '';
  const accountsSort = el('div#select-2');
  const createAccount = el('button.btnTitle .btnReset .btn', el('span.btnTitlenSymbol', '+'), el('span.btnTitleText', 'Создать новый счет'));
  const accountsTitleWrap = el('div.accountsTitleWrap', accountsTitle, accountsSort);
  const titleBlock = el('div.titleBlock', accountsTitleWrap, createAccount);
  let accounts; let balance; let accView;

  function selectChange(i) {

    if (i === 'b') {
      accountItemArr.sort((x, y) => x.balance - y.balance).reverse();
    }
    if (i === 'n') accountItemArr.sort((x, y) => x.account - y.account);
    if (i === 't') accountItemArr.sort((x, y) => x.transactions[0].date.localeCompare(y.transactions[0].date)).reverse();

    allData();
    accDOM();
    openButtonF();
    return accountItemArr;
  }



  function allData() {
    accounts = accountItemArr.map((e) => e.account);
    balance = accountItemArr.map((e) => e.balance);
    transactionsArr = accountItemArr.map((e) => {
      if (e.transactions.length == 0) e.transactions = [{ date: '-100' }];

      return e.transactions
    });

  }

  function lastTrDate(index) {

    if (transactionsArr[index][0]) {
      lastTransactionDateFull[index] = new Date(transactionsArr[index][0].date);
      lastTransactionDateMonth[index] = lastTransactionDateFull[index].toLocaleString('default', { month: 'long' });
      switch (lastTransactionDateMonth[index]) {
        case 'январь': lastTransactionDateMonth[index] = 'января';
          break;
        case 'февраль': lastTransactionDateMonth[index] = 'февраля';
          break;
        case 'март': lastTransactionDateMonth[index] = 'марта';
          break;
        case 'апрель': lastTransactionDateMonth[index] = 'апреля';
          break;
        case 'май': lastTransactionDateMonth[index] = 'мая';
          break;
        case 'июнь': lastTransactionDateMonth[index] = 'июня';
          break;
        case 'июль': lastTransactionDateMonth[index] = 'июля';
          break;
        case 'август': lastTransactionDateMonth[index] = 'августа';
          break;
        case 'сентябрь': lastTransactionDateMonth[index] = 'сентября';
          break;
        case 'октябрь': lastTransactionDateMonth[index] = 'октября';
          break;
        case 'ноябрь': lastTransactionDateMonth[index] = 'ноября';
          break;
        case 'декабрь': lastTransactionDateMonth[index] = 'декабря';
      }
      lastTransactionDateDay[index] = lastTransactionDateFull[index].getDate();
      lastTransactionDateYear[index] = lastTransactionDateFull[index].getFullYear();
      lastTransactionDate[index] = lastTransactionDateDay[index] + ' ' + lastTransactionDateMonth[index] + ' ' + lastTransactionDateYear[index];

      if (lastTransactionDate[index] === '1 января 100') lastTransactionDate[index] = ''
    }
    else lastTransactionDate[index] = ' '
    return lastTransactionDate[index];
  }

  function accDOM() {
    for (let index = 0; index < maxIndex; index++) {
      lastTransactionDate[index] = lastTrDate(index);
      openButton[index] = el('button.btnOpen .btnReset .btn', 'Открыть');
      openButton[index].id = accounts[index];
      accountElement[index] = el('li.accountItem', el('div.accountNumber', accounts[index]), el('div.balanceValue', `${balance[index]} ₽`),
        el('div.accountItemWrap', el('span.titleTransaction', 'Последняя транзакция: ', el('span.dateTransaction', lastTransactionDate[index])), openButton[index]));

    }
    const element = el('ul.accountsBlock .listReset', accountElement);
    const main = el('main.container', titleBlock, element);
    document.body.innerHTML = '';

    accountsNav.classList.add('buttonNavActive');
    currencyNav.classList.remove('buttonNavActive');
    atmNav.classList.remove('buttonNavActive');

    accView = mount(document.body, header);
    accView = mount(document.body, main);
    return accView;
  }

  function detailAccount(i) {

    router.navigate(`/${i}`)
  }
  allData();
  const maxIndex = accounts.length;
  let accountElement = [];
  const openButton = [];
  sortDefault = JSON.parse(localStorage.getItem('sortSave'));
  if (!sortDefault) sortDefault = '';
  selectChange(sortDefault);
  accDOM();

  function openButtonF() {
    for (let i = 0; i < openButton.length; i++)
      openButton[i].onclick = (e) => {
        const account = openButton[i].id;
        e.preventDefault();

        getCurrentAcc(account, token)
        setTimeout(() => {
          detailAccount(account)
        }
          , 200)
      }
  }
  openButtonF();
  createAccount.onclick = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    accountItemArr = await getAccounts(token);
    localStorage.setItem('accSave', JSON.stringify(accountItemArr))
    // localStorage.setItem('accSave', JSON.stringify(accountItemArr)) 
    router.navigate('/accounts');
  }

  select2 = new ItcCustomSelect('#select-2', {
    name: 'sort', // значение атрибута name у кнопки
    targetValue: `${sortDefault}`, // значение по умолчанию
    options: [['n', 'По номеру'], ['b', 'По балансу'], ['t', 'По последней транзакции']],
  });

  document.querySelector('#select-2').addEventListener('itc.select.change', (e) => {
    const btn = e.target.querySelector('.itc-select__toggle');
    localStorage.setItem('sortSave', JSON.stringify(btn.value))
    selectChange(btn.value);
  });

  return accView;
}

