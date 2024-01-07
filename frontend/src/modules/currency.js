import { el, setChildren } from 'redom';
import { header, menu, accountsNav, atmNav, currencyNav } from './header';
import { getChangedCurrency, getCurrency } from './getCurrency';
import router from '../router';
import { autorization } from '../index';
export async function Currency() {
  accountsNav.classList.remove('buttonNavActive');
  currencyNav.classList.add('buttonNavActive');
  atmNav.classList.remove('buttonNavActive');
  let main = '';
  let cF = [];
  let cFfrom = [];
  let cFto = [];
  let cFrate = [];
  let cFchange = [];
  let currencyName = [];
  let currencyValue = [];
  let currencyElement = [];
  let key = [];
  let value = [];
  let courseData;
  let courseDataCouple = [];
  let courseDataRate = [];
  let courseDataChange = [];
  let dotted = [];
  let courseDataCoupleContainer;
  let courseDataRateContainer;
  let courseDataChangeContainer;
  let dottedContainer;

  const token = JSON.parse(localStorage.getItem('tokenSave'))
  let exchange = await getCurrency(token);

  for (key in exchange) {
    value.push(exchange[key]);
  }
  currencyName = value.map((item) => item.code);
  currencyValue = value.map((item) => item.amount);

  const currencyTitle = el('h1.accountsTitle', 'Валютный обмен');
  const titleBlock = el('div.titleBlock', currencyTitle);
  for (let i = 0; i < value.length; i++) {
    currencyElement[i] = el('li.currencyItem', el('span.currencyName', currencyName[i]), el('span.currencyDotted', '.....................................................................'),
      el('span.currencyValue', Math.round((currencyValue[i] + Number.EPSILON) * 100) / 100));
  }
  const currencyBlock = el('ul.currencyBlock .listReset', currencyElement);

  const fromExchangeLabel = el('label.currFormLabel', 'Из');
  const toExchangeLabel = el('label.currFormLabel', 'в');
  const valueExchangeLabel = el('label.currFormLabel', 'Сумма');
  let fromExchange = [];
  let toExchange = [];
  for (let i = 0; i < currencyName.length; i++) {
    fromExchange[i] = el('option.optionElement', currencyName[i]);
    toExchange[i] = el('option.optionElement', currencyName[i]);
  }

  const selectFrom = el('select.selectExchange', fromExchange);
  const selectTo = el('select.selectExchange', toExchange);
  const valueExchange = el('input.inputEnter');
  valueExchange.type = 'number';
  const messageCurr = el('div.messageError', 'выберите валюты для обмена');
  const messageAmount = el('div.messageError', 'введите корректную сумму обмена');
  const enterFromWrap = el('div.currWrap', fromExchangeLabel, selectFrom);
  const enterToWrap = el('div.currWrap', toExchangeLabel, selectTo);
  const enterCurrWrap = el('div.enterCurrWrap', enterFromWrap, enterToWrap)
  const enterValueWrap = el('div.enterWrap', valueExchangeLabel, valueExchange, messageAmount);
  const containerCurrency = el('div.containerCurrency', enterCurrWrap, enterValueWrap, messageCurr);
  const form = el('form.currForm');
  const enterButton = el('button.exchangeButton .btnReset .btn', 'Обменять');
  setChildren(form, containerCurrency, enterButton);
  const exchangeBlock = el('div.exchangeBlock', el('div.newTransferTitle', 'Обмен валюты'), form);
  const yourCurrency = el('div.yourCurrency', el('div.newTransferTitle', 'Ваши валюты'), currencyBlock);

  let fromChoice;
  let toChoice;
  let errorChange = '';

  function selectChangeFrom() {
    fromChoice = selectFrom.options[selectFrom.selectedIndex].value;
    const fff = selectFrom.selectedIndex
  }

  function selectChangeTo() {
    toChoice = selectTo.options[selectTo.selectedIndex].value;
  }
  selectFrom.addEventListener('change', selectChangeFrom);
  selectTo.addEventListener('change', selectChangeTo);

  enterButton.onclick = async (e) => {
    e.preventDefault();
    if (!fromChoice) fromChoice = 'AUD';
    if (!toChoice) toChoice = 'AUD';
    if (fromChoice == toChoice) {
      messageCurr.classList.add('messageErrorActive');
      messageAmount.classList.remove('messageErrorActive');
    } else if (Number(valueExchange.value) <= 0 || currencyValue[selectFrom.selectedIndex] - Number(valueExchange.value) <= 0) {
      messageAmount.classList.add('messageErrorActive');
      messageCurr.classList.remove('messageErrorActive');

    } else {
      messageAmount.classList.remove('messageErrorActive');
      messageCurr.classList.remove('messageErrorActive');
      alert('Обмен прошел успешно');
      putExchange(token, fromChoice, toChoice, Number(valueExchange.value));
    }
  }

  async function putExchange(token, from, to, amount) {
    const res = await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });

    exchange = await getCurrency(token);
    setTimeout(() => {
      form.reset();
      Currency();
    }, 300)
  }

  async function dyn() {
    const currFeed = await getChangedCurrency();
    currFeed.onmessage = async (event) => {
      cF = await JSON.parse(event.data);
      if (cFfrom.length < 12) cFfrom.push(cF.from);
      if (cFto.length < 12) cFto.push(cF.to);
      if (cFrate.length < 12) cFrate.push(cF.rate);
      if (cFchange.length < 12) cFchange.push(cF.change);
    }
  }

  dyn();

  function delay() {
    if (window.location.href == 'http://localhost:8080/currency') {
      if (cFfrom.length >= 12) {
        for (let i = 0; i < 12; i++) {
          cFrate[i] = (Math.round(cFrate[i] * 100) / 100).toFixed(2);
          courseDataCouple[i] = el('div.dynElement', `${cFfrom[i]}/${cFto[i]}`);
          dotted[i] = el('div.dynElement', '.......................................................................');
          dotted[i].style['color'] = 'green';
          if (cFchange[i] < 0) dotted[i].style['color'] = 'red';
          courseDataRate[i] = el('div.dynElement', `${cFrate[i]}`);
          if (cFchange[i] < 0) courseDataChange[i] = el('div.signMinus');
          if (cFchange[i] > 0) courseDataChange[i] = el('div.signPlus');
          if (cFchange[i] = 0) courseDataChange[i] = el('div');
        }
        setTimeout(delay, 30000);
        cFfrom.splice(0, 12);
        cFto.splice(0, 12);
        cFrate.splice(0, 12);
        cFchange.splice(0, 12);

        dyn;
      } else {
        setTimeout(delay, 3000);
      }
      courseDataCoupleContainer = el('div.courseDataCoupleContainer', courseDataCouple);
      courseDataRateContainer = el('div.courseDataRateContainer', courseDataRate);
      courseDataChangeContainer = el('div.courseDataChangeContainer', courseDataChange);
      dottedContainer = el('div.dottedContainer', dotted);

      courseData = el('div.courseData', courseDataCoupleContainer, dottedContainer, courseDataRateContainer, courseDataChangeContainer);
      const spinner = el('div.loader', el('div.inner .one'), el('div.inner .two'), el('div.inner .three'))
      if (courseDataCouple.length < 12) {
        courseData = el('div.dynLoading', spinner);
      }
      const dynCourse = el('div.dynCourse', el('div.newTransferTitle .newTransferTitleCh', 'Изменение курса в реальном времени'), courseData);
      const currencyGrid = el('div.currencyGrid', yourCurrency, dynCourse, exchangeBlock);
      main = el('main.container', titleBlock, currencyGrid);
      setChildren(document.body, header, main);
    }
  }




  delay();
  menu.classList.remove('none');
  router.navigate('/currency')
}
