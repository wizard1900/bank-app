import { el, list, setChildren, mount, unmount } from 'redom';
import { Chart } from 'chart.js/auto';
import { header, menu } from './header';
import { transactionsData } from './transactionsData';
import router from '../router';
export function currentBalanceView(index) {
  let main = '';
  let accView = '';
  let pagination = '';
  let token = JSON.parse(localStorage.getItem('tokenSave'))
  let accArr = JSON.parse(localStorage.getItem('currAccSave'));
  let account = accArr.account;
  const extend = true;
  const transTableData = transactionsData(accArr, extend)[0];
  const transactionsLength = transactionsData(accArr, extend)[1]
  const D = transactionsData(accArr, extend)[2];
  const M = transactionsData(accArr, extend)[3];
  const Y = transactionsData(accArr, extend)[4];
  const trAmount = transactionsData(accArr, extend)[5];
  let balanceM = [];
  let balanceMax = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let plusTr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let minusTr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let year = [];
  let month = [];
  let pageMax = Math.ceil(transactionsLength / 25);
  let transTable = [];
  let liTag = [];

  const btnBack = el('button.btnTitle btnReset .btn', el('span.btnTitlenSymbol', '<-'), el('span.btnTitleText', 'Вернуться назад'));
  const accountsTitle = el('h1.accountsTitle', 'История баланса');
  const titleBlock = el('div.titleBlock', accountsTitle, btnBack);
  const balance = accArr.balance;

  const balanceCurrent = el('div.balanceCurrent', el('spen.balanceCurrentText', 'Баланс: ', el('span.balanceCurrentValue', `${balance} ₽`)))
  const accountItem = el('div.accountInfo', el('div.currAccountNumber', `№  ${account}`), balanceCurrent);

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

      if (M[j] === m && Y[j] === currentYear) {
        balanceM[m] = balanceM[m] - trAmount[j]
        if (balanceM[m] > balanceMax[m]) {
          balanceMax[m] = balanceM[m]
        }

        if (trAmount[j] >= 0) {
          plusTr[m] = plusTr[m] + trAmount[j]
        } else minusTr[m] = minusTr[m] = minusTr[m] - trAmount[j];
      }
    }

    if (plusTr[m] == 0 && minusTr[m] == 0) {
      plusTr[m] = balanceMax[m] / 2;
      minusTr[m] = balanceMax[m] / 2;
    } else {
      plusTr[m] = plusTr[m] * balanceMax[m] / (plusTr[m] + minusTr[m]);
      minusTr[m] = minusTr[m] * balanceMax[m] / (plusTr[m] + minusTr[m]);
    }
  }

  for (let i = currentMonth; i >= 0; i--) {
    year[i] = currentYear;
    defineBalance(i);
  }

  for (let j = 0; j < 12; j++) {
    month[j] = monthView(j);
  }
  let averageElement;
  let maxPlusTr = Math.max.apply(null, plusTr);
  let maxMinusTr = Math.max.apply(null, minusTr);
  let graphMaxY = Math.max(balanceMax[currentMonth - 5], balanceMax[currentMonth - 4],
    balanceMax[currentMonth - 3], balanceMax[currentMonth - 2], balanceMax[currentMonth - 1], balanceMax[currentMonth])
  let average = Math.round(Math.min(maxPlusTr, maxMinusTr));
  if (average == 0 || average == graphMaxY || average / graphMaxY < 0.15 || average / graphMaxY > 0.85) {
    averageElement = el('div.average', '');
  } else {
    averageElement = el('div.average', average);
    const btm = Math.round(50 + 154 * average / graphMaxY);
    averageElement.style['bottom'] = btm + 'px';
    if (graphMaxY > 0) averageElement.style['left'] = '93.6%';
    if (graphMaxY > 999) averageElement.style['left'] = '91%';
    if (graphMaxY > 999999) averageElement.style['left'] = '87.5%';
  }
  const graphBal = el('canvas.graph2');
  const graphTrans = el('canvas.graph2');

  const dynBalance = el('div.dynBalance', el('div.newTransferTitle .newTransferTitleDyn', 'Динамика баланса'), graphBal);
  const inOutTrans = el('div.dynBalance', el('div.newTransferTitle .newTransferTitleDyn', 'Соотношение входящих исходящих транзакций'), graphTrans, averageElement);

  btnBack.onclick = async (e) => {
    e.preventDefault();
    router.navigate(`/${account}`);
  }

  const customBorder = {
    id: 'customBorder',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.moveTo(left + 2, top);
      ctx.lineTo(right + 22, top);
      ctx.lineTo(right + 22, bottom);
      ctx.lineTo(left + 2, bottom);
      ctx.closePath();
      ctx.stroke();
    }
  }
  new Chart(graphBal, {
    type: 'bar',
    data: {
      labels: month,
      datasets: [{
        label: '',
        data: balanceMax,
        borderWidth: 1,
        backgroundColor: '#116ACC'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            font: {
              family: "'Work Sans','Arial'",
              size: 20,
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
            padding: 25,

            font: {
              family: "'Work Sans','Arial'",
              size: 19,
              weight: 500,
            },
            color: '#000'
          }
        },

      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        },
      }
    },
    plugins: [customBorder]
  });

  new Chart(graphTrans, {
    type: 'bar',
    data: {
      labels: month,
      datasets: [{
        label: '',
        data: minusTr,
        borderWidth: 1,
        backgroundColor: 'red'
      },
      {
        label: '',
        data: plusTr,
        borderWidth: 1,
        backgroundColor: 'green'
      }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          },

          ticks: {
            font: {
              family: "'Work Sans','Arial'",
              size: 20,
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
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            stepSize: graphMaxY,
            padding: 25,

            font: {
              family: "'Work Sans','Arial'",
              size: 19,
              weight: 500,
            },
            color: '#000'
          }
        },

      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        },
      }
    },
    plugins: [customBorder]
  });

  transTableData.reverse();

  function makeTransTable(currentPage) {
    let beginData = (currentPage - 1) * 25;
    let endData = beginData + 25;
    if (endData > transactionsLength - 1) endData = transactionsLength;

    let transTableDataNew = transTableData.slice(beginData, endData)
    transTable = el('table.transTable', el('tr', el('th', 'Счет отправителя'), el('th', 'Счет получателя'),
      el('th', 'Сумма'), el('th', 'Дата')), transTableDataNew);
  }

  let currentPage = 1;


  function createPagination(pageMax, currentPage) {
    makeTransTable(currentPage);
    pagination = el('h1', 'test');
    if (accView) accView = unmount(document.body, main);
    let i = 0;
    let active;
    let beforePage = currentPage - 1;
    let afterPage = currentPage + 1;

    if (pageMax > 4) {
      if (currentPage > 1) {
        i = 0;
        liTag[i] = el('li.page', el('span', '<'));
        liTag[i].onclick = (e) => {
          e.preventDefault();
          currentPage = currentPage - 1;
          createPagination(pageMax, currentPage)
        }
      }

      if (currentPage > 2) {
        i = 1;
        liTag[i] = el('li.page .pageNumber', el('span', '1'));
        liTag[i].onclick = (e) => {
          e.preventDefault();
          currentPage = 1;
          createPagination(pageMax, currentPage)
        }
      }
      else {
        liTag[i + 1] = ' ';
      }
      if (pageMax > 4) {
        if (currentPage > 3) {
          i = 2
          liTag[i] = el('li.page .dotted', el('span', '...'))
        }
        else {
          liTag[i + 1] = ' ';
          liTag[i + 2] = ' ';
        }
      }

      if (currentPage == pageMax) {
        beforePage = beforePage - 2;

      } else if (currentPage == pageMax - 1) {
        beforePage = beforePage - 1;
      }

      if (currentPage === 1) {
        afterPage = afterPage + 2;
        liTag[0] = ' ';
        liTag[3] = ' ';

      } else if (currentPage === 2) {
        afterPage = afterPage + 1;
      }

      for (let p = beforePage; p <= afterPage; p++) {
        if (p > pageMax) {
          continue;
        }
        if (p == 0) {
          p = p + 1;
        }
        if (currentPage == p) {
          active = ".pageNumberActive";

        } else {
          active = "";
        }

        liTag[p - currentPage + 4] = el(`li.page .pageNumber ${active}`, el('span', p));
        liTag[p - currentPage + 4].onclick = (e) => {
          e.preventDefault();
          currentPage = p;
          createPagination(pageMax, p)
        }
      }

      if (currentPage < pageMax - 2) {
        i = 6;
        liTag[i] = el('li.page .dotted', el('span', '...'))
      }
      else liTag[6] = ' ';

      i = 7;
      liTag[i] = el('li.page .pageNumber', el('span', pageMax));
      liTag[i].onclick = (e) => {
        e.preventDefault();
        currentPage = pageMax;
        createPagination(pageMax, pageMax)
      }
      if (currentPage === pageMax - 1) {
        liTag[2] = el('li.page .dotted', el('span', '...'))
        liTag[5] = '';
      }

      if (currentPage === pageMax) {
        liTag[2] = el('li.page .dotted', el('span', '...'))
        liTag[1] = el('li.page .pageNumber', el('span', '1'));
        liTag[1].onclick = (e) => {
          e.preventDefault();
          currentPage = 1;
          createPagination(pageMax, currentPage);
        }
        liTag[7] = ' ';
        liTag[8] = ' ';
        liTag[5] = ' ';
      }


      if (currentPage < pageMax) {
        i = 8;
        liTag[i] = el('li.page', el('span', '>'));
        liTag[i].onclick = (e) => {
          e.preventDefault();
          currentPage = currentPage + 1;
          createPagination(pageMax, currentPage);
        }
      } else liTag[8] = ' '
    }

    else {
      if (pageMax > 1) {
        liTag[0] = el('li.page', el('span', '<'));
        liTag[0].onclick = (e) => {
          e.preventDefault();
          currentPage = currentPage - 1;
          createPagination(pageMax, currentPage)
        }
        if (currentPage == 1) {
          liTag[0] = ' ';
        }


        for (let i = 1; i <= pageMax; i++) {
          if (currentPage == i) {
            active = ".pageNumberActive";
          } else {
            active = "";
          }
          liTag[i] = el(`li.page .pageNumber ${active}`, el('span', i));
          liTag[i].onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            createPagination(pageMax, currentPage)
          }
        }
        if (currentPage < pageMax) {
          liTag[pageMax + 1] = el('li.page', el('span', '>'));
          liTag[pageMax + 1].onclick = (e) => {
            e.preventDefault();
            currentPage = currentPage + 1;
            createPagination(pageMax, currentPage)
          }
        } else liTag[pageMax + 1] = ' ';
      }
    }

    const transHistory = el('div.transHistory .transHistoryMod', el('div.newTransferTitle', 'История переводов'), transTable);
    const balanceGrid = el('div.balanceGrid', dynBalance, inOutTrans, transHistory);
    pagination = el('ul.listReset .pagination', liTag);
    main = el('main.container', titleBlock, accountItem, balanceGrid, pagination);
    accView = mount(document.body, main);
    return liTag
  }
  createPagination(pageMax, currentPage);

  return accView;
}