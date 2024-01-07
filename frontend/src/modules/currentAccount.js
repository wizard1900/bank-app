import { el, setChildren, mount } from 'redom';
import { Chart } from 'chart.js/auto';
import { header, menu, accountsNav } from './header';
import { newTransaction } from './newTransaction';
import { transactionsData } from './transactionsData';
import { getAccounts } from './getAccounts';
import { getCurrentAcc } from './getCurrentAcc';
import router from '../router';
import { accountsView } from './accounts';

export function currentAccountView(account, index) {
  let accData;
  let accArr;
  let accounts = [];
  let token = '';
  token = JSON.parse(localStorage.getItem('tokenSave'))

  // getCurrentAcc(account, token)


  accArr = JSON.parse(localStorage.getItem('currAccSave'));
  accounts = JSON.parse(localStorage.getItem('accSave'));

  for (let j = 0; j < accounts.length; j++) {

    if (accArr.account === accounts[j].account) {
      accData = accArr;
      break;
    }
  }
  localStorage.setItem('currAccSave', JSON.stringify(accData))

  const extend = false;
  const transTableData = transactionsData(accData, extend)[0];
  const transactionsLength = transactionsData(accData, extend)[1]

  const D = transactionsData(accData, extend)[2];
  const M = transactionsData(accData, extend)[3];
  const Y = transactionsData(accData, extend)[4];
  const trAmount = transactionsData(accData, extend)[5];
  const liLS = [];
  const btnLS = [];

  let toArr = [];
  if (localStorage.getItem('itemsTo')) {
    toArr = JSON.parse(localStorage.getItem('itemsTo'))
  }
  for (let i = 0; i < toArr.length; i++) {

    liLS[i] = el('li.liLS', toArr[i]);
  }
  const ulLS = el('ul.ulLS .listReset', liLS)

  let balanceM = [];
  let balanceMax = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let year = [];
  let month = [];
  transTableData.reverse();
  accountsNav.classList.remove('buttonNavActive');
  const btnBack = el('button.btnTitle btnReset .btn', el('span.btnTitlenSymbol', '<-'), el('span.btnTitleText', 'Вернуться назад'));
  const accountsTitle = el('div.accountsTitle', 'Просмотр счета');

  const messageToError = el('div.messageErrorAcc', 'введите корректный 26-значный номер счета');
  const messageAmountError = el('div.messageErrorAcc', 'введите сумму перевода');
  const titleBlock = el('div.titleBlock', accountsTitle, btnBack);
  let balance = accData.balance;
  const balanceCurrent = el('div.balanceCurrent', el('spen.balanceCurrentText', 'Баланс: ', el('span.balanceCurrentValue', `${balance} ₽`)))
  const accountItem = el('div.accountInfo', el('div.currAccountNumber', `№  ${accData.account}`), balanceCurrent);
  const benefAccLabel = el('label.currFormLabel', 'Номер счета получателя:');
  const amountAccLabel = el('label.currFormLabel', 'Сумма перевода:');
  const benefAcc = el('input.inputEnter');

  const amountAcc = el('input.inputEnter');
  benefAcc.onfocus = (e) => {
    e.preventDefault();
    if (!benefAcc.value) { ulLS.classList.add('active') } else {
      ulLS.classList.remove('active')
    };
  }

  benefAcc.onchange = (e) => {
    e.preventDefault();
    ulLS.classList.remove('active');
  }

  benefAcc.onblur = (e) => {
    e.preventDefault();
    setTimeout(delay, 200);
    function delay() {
      ulLS.classList.remove('active');
    }
  }
  amountAcc.type = 'number';
  const enterBenefWrap = el('div.enterWrap .enterWrapCurr', benefAccLabel, benefAcc, messageToError, ulLS);
  const enterAmountWrap = el('div.enterWrap .enterWrapCurr', amountAccLabel, amountAcc, messageAmountError);
  const form = el('form');
  const enterButton = el('button.enterButton .enterButtonCurr .btnReset .btn', 'Отправить');
  setChildren(form, enterBenefWrap, enterAmountWrap, enterButton);
  const graph = el('canvas.graph')
  const newTransfer = el('div.newTransfer', el('div.newTransferTitle', 'Новый перевод'), form);
  const dynBalance = el('div.dynBalance', el('div.newTransferTitle .newTransferTitleDyn', 'Динамика баланса'), graph);

  for (let i = 0; i < liLS.length; i++) {
    liLS[i].onclick = (e) => {
      e.preventDefault();
      benefAcc.value = toArr[i]
    }
  }
  enterButton.onclick = async (e) => {
    e.preventDefault();
    let to = benefAcc.value.trim();

    const amountVal = amountAcc.value;
    const validateTo = /^\d{26}$/.test(to);
    if (!validateTo || to == accData.account) {
      amountAcc.classList.remove('inputError');
      benefAcc.classList.add('inputError');
      messageToError.classList.add('messageErrorActive');
      messageAmountError.classList.remove('messageErrorActive');

    } else {
      if (amountVal <= 0) {
        amountAcc.classList.add('inputError');
        benefAcc.classList.remove('inputError');
        messageToError.classList.remove('messageErrorActive');
        messageAmountError.classList.add('messageErrorActive');
      } else {

        amountAcc.classList.remove('inputError');
        messageToError.classList.remove('messageErrorActive');
        messageAmountError.classList.remove('messageErrorActive');
        if (!toArr.includes(to)) toArr.push(to);
        if (toArr.length > 5) toArr.shift();
        localStorage.setItem('itemsTo', JSON.stringify(toArr));
        if (balance - amountVal < 0) alert('Недостаточно средств нв счете')

        else {
          newTransaction(accData.account, to, amountVal, token);
          benefAcc.classList.remove('inputError');
          alert('Перевод выполнен успешно');
          let accountItemArr = await getAccounts(token);
          localStorage.setItem('accSave', JSON.stringify(accountItemArr))
          getCurrentAcc(accData.account, token)

          setTimeout(() => {
            form.reset();

            // location.reload()
            const curr = currentAccountView(accData.account, index)
            menu.classList.remove('none');
            setChildren(document.body, header, curr);
            // router.navigate(`/${account}`)
          }, 500);

        }
      }
    }
  }

  btnBack.onclick = async (e) => {
    e.preventDefault();
    let accountItemArr = await getAccounts(token);
    localStorage.setItem('accSave', JSON.stringify(accountItemArr))
    accountsView()
    router.navigate('/accounts');
  }

  function monthView(month) {
    switch (month) {
      case 0: month = 'янв';
        break;
      case 1: month = 'фев';
        break;
      case 2: month = 'мар';
        break;
      case 3: month = 'апр';
        break;
      case 4: month = 'май';
        break;
      case 5: month = 'июн';
        break;
      case 6: month = 'июл';
        break;
      case 7: month = 'авг';
        break;
      case 8: month = 'сен';
        break;
      case 9: month = 'окт';
        break;
      case 10: month = 'ноя';
        break;
      case 11: month = 'дек';
    }
    return month;
  }

  function defineBalance(m) {
    if (m === currentMonth) {
      balanceM[m] = balance;
      balanceMax[m] = balance;
    } else {
      balanceM[m] = balanceM[m + 1];
      balanceMax[m] = balanceM[m + 1];
    }
    for (let j = transactionsLength - 1; j >= 0; j--) {
      if (M[j] === m && Y[j] === 2023) {
        balanceM[m] = balanceM[m] - trAmount[j]
        if (balanceM[m] > balanceMax[m]) {
          balanceMax[m] = balanceM[m]
        }
      }
    }
  }

  for (let i = 0; i < 6; i++) {
    month[i] = currentMonth - i;
    year[i] = currentYear;
    if (month[i] < 0) {
      month[i] = month[i] + 12;
      year[i] = currentYear - 1;
    }
    defineBalance(month[i]);
    month[i] = monthView(month[i]);
  }

  let graphMaxY = Math.max(balanceMax[currentMonth - 5], balanceMax[currentMonth - 4],
    balanceMax[currentMonth - 3], balanceMax[currentMonth - 2], balanceMax[currentMonth - 1], balanceMax[currentMonth])
  month = month.reverse();

  const customBorder = {
    id: 'customBorder',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.moveTo(left + 2, top);
      ctx.lineTo(right + 25, top);
      ctx.lineTo(right + 25, bottom);
      ctx.lineTo(left + 2, bottom);
      ctx.closePath();
      ctx.stroke();
    }
  }

  new Chart(graph, {
    type: 'bar',
    data: {
      labels: month,
      datasets: [{
        label: '',
        data: [balanceMax[currentMonth - 5], balanceMax[currentMonth - 4],
        balanceMax[currentMonth - 3], balanceMax[currentMonth - 2], balanceMax[currentMonth - 1], balanceMax[currentMonth]],
        borderWidth: 1,
        backgroundColor: '#116ACC'
      }]
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            font: {
              family: "'Work Sans','Arial'",
              size: 19,
              weight: 700,
            },
            color: '#000',
          },

          drawBorder: false,
        },

        y: {
          position: 'right',
          beginAtZero: true,
          max: graphMaxY,
          drawBorder: false,
          grid: {
            display: false,
          },
          ticks: {
            stepSize: graphMaxY,
            padding: 24,
            font: {
              family: "'Work Sans','Arial'",
              size: 19,
              weight: 500,
            },
            color: '#000',
          }
        },
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      }
    },
    plugins: [customBorder]
  });

  const transTable = el('table.transTable', el('tr', el('th', 'Счет отправителя'), el('th', 'Счет получателя'),
    el('th', 'Сумма'), el('th', 'Дата')), transTableData);
  const transHistory = el('div.transHistory', el('div.newTransferTitle', 'История переводов'), transTable);
  const currentAccGrid = el('div.currentAccGrid', newTransfer, dynBalance, transHistory);
  const main = el('main.container', titleBlock, accountItem, currentAccGrid);



  const accView = mount(document.body, main);

  dynBalance.onclick = (e) => {
    e.preventDefault();
    router.navigate(`/balance`);
  };

  transHistory.onclick = (e) => {
    e.preventDefault();
    router.navigate(`/balance`);
  };

  // router.navigate(`/accounts/${account}`)
  return accView;

}
