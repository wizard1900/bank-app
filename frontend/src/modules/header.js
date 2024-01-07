import { el, mount, setChildren } from 'redom';
import router from '../router';
import { Currency } from './currency';
import { ATM } from './atm';
import { accountsView } from './accounts';
import { autorization } from '../index';
const base = el('base');
base.href = '/';
mount(document.head, base);
const logo = el('div.logo', 'Coin.');
const login = 'developer';
const password = 'skillbox';
export const atmNav = el('button.buttonNav .btnReset .btn', 'Банкоматы');
export const accountsNav = el('button.buttonNav .btnReset .btn', 'Счета');
export const currencyNav = el('button.buttonNav .btnReset .btn', 'Валюта');
const exitNav = el('button.buttonNav .btnReset .btn', 'Выход');
export const menu = el('nav', atmNav, accountsNav, currencyNav, exitNav);
export const header = el('header.header container', logo, menu);

router
  .on(`/atm`, () => {
    const atmView = ATM();
    setChildren(document.body, header, atmView);
  })
router.resolve();

// router
//   .on(`/currency`, () => {
//     const exchangeView = Currency();
//     setChildren(document.body, header, exchangeView);
//   })
// router.resolve();

router
  .on(`/accounts`, () => {
    const accView = accountsView();
    // setChildren(document.body, header, exchangeView);
  })
router.resolve();


atmNav.onclick = async (e) => {
  e.preventDefault();
  router.navigate('/atm');
}

accountsNav.onclick = async (e) => {
  e.preventDefault();
  router.navigate(`/accounts`);
}

currencyNav.onclick = async (e) => {
  e.preventDefault();
  router.navigate(`/currency`);
}


exitNav.onclick = (e) => {
  e.preventDefault();
  localStorage.removeItem('tokenSave');
  localStorage.removeItem('sortSave');
  localStorage.removeItem('accSave');
  localStorage.removeItem('currAccSave');
  router.navigate(`/`);

}
