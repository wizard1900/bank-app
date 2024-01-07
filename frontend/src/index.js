import 'babel-polyfill';
import './normalize.css';
import './style.css';
import './itc-custom-select.css';
import { el, setChildren } from 'redom';
import { header, menu } from './modules/header';
import router from './router';
import { accountsView } from './modules/accounts';
import { getAccounts } from './modules/getAccounts';
import { currentAccountView } from './modules/currentAccount';
import { currentBalanceView } from './modules/currentBalance';
import { Currency } from './modules/currency';

const messageLogError = el('div.messageError', 'поле должно содержать не менее 6 символов без пробелов');
const messageUser = el('div.messageError', 'нет такого пользователя');
const messagePassError = el('div.messageError', 'поле должно содержать не менее 6 символов без пробелов');
const messagePassword = el('div.messageError', 'пароль неверный');
const enterFormTitle = el('h1.enterAcc', 'Вход в аккаунт');
const userLoginLabel = el('label.formLabel', 'Логин');
const userPasswordLabel = el('label.formLabel', 'Пароль');
const userLogin = el('input.inputEnter');
const userPassword = el('input.inputEnter');
userPassword.type = 'password';
const enterLoginWrap = el('div.enterWrap', userLoginLabel, userLogin, messageLogError, messageUser);
const enterPasswordWrap = el('div.enterWrap', userPasswordLabel, userPassword, messagePassError, messagePassword);
const form = el('form.enterForm');
const enterButton = el('button.enterButton .btnReset .btn', 'Войти');
setChildren(form, enterFormTitle, enterLoginWrap, enterPasswordWrap, enterButton);
let main = el('main.container', el('div.enter', form));
menu.classList.add('none');
let accArr;
let accountItemArr = [];
accountItemArr = JSON.parse(localStorage.getItem('accSave'))

router
  .on("/", () => {
    menu.classList.add('none');
    setChildren(document.body, header, main);
  })
  .resolve();

enterButton.type = 'submit';


router
  .on("/accounts", () => {
    const accView = accountsView();
    menu.classList.remove('none');
  })
  .resolve();
let accL = 1
if (accountItemArr) {
  accL = accountItemArr.length;
}
for (let i = 0; i < accL; i++) {

  router
    .on((`/balance`), () => {
      const curr = currentBalanceView(i);
      setChildren(document.body, header, curr);
    })
}

router
  .on(`/currency`, () => {
    const exchangeView = Currency();
    setChildren(document.body, header, exchangeView);
  })
router.resolve();

if (accountItemArr) {
  for (let i = 0; i < accountItemArr.length; i++) {
    router
      .on(`/${accountItemArr[i].account}`, () => {
        const curr = currentAccountView(accountItemArr[i].account, i);
        menu.classList.remove('none');
        setChildren(document.body, header, curr);
      })
      .resolve()
  }
} else {
  router
    .on(`/74213041477477406320783754`, () => {
      const curr = currentAccountView('74213041477477406320783754', 0);
      menu.classList.remove('none');
      setChildren(document.body, header, curr);
    })
    .resolve()
}

enterButton.onclick = async function clicked(e) {
  e.preventDefault();
  messagePassword.classList.remove('messageErrorActive');
  messageUser.classList.remove('messageErrorActive');
  const login = userLogin.value;
  const password = userPassword.value;

  let token = '';
  if (login.length < 6 || login.indexOf(' ') > 0) {
    userLogin.classList.add('inputError');
    userPassword.classList.remove('inputError');
    messageLogError.classList.add('messageErrorActive');
    messagePassError.classList.remove('messageErrorActive');
  } else if (password.length < 6 || password.indexOf(' ') > 0) {
    userPassword.classList.add('inputError');
    userLogin.classList.remove('inputError');
    messagePassError.classList.add('messageErrorActive');
    messageLogError.classList.remove('messageErrorActive');
  } else {
    messagePassError.classList.remove('messageErrorActive');
    messageLogError.classList.remove('messageErrorActive');
    userPassword.classList.remove('inputError');
    userLogin.classList.remove('inputError');
    token = await autorization(login, password);

    if (token) {
      form.reset();
      localStorage.setItem('tokenSave', JSON.stringify(token))
      let accountItemArr = await getAccounts(token);
      localStorage.setItem('accSave', JSON.stringify(accountItemArr))
      router.navigate('/accounts');
    }
  }
}

export async function autorization(login, password) {
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  const resJson = await res.json();
  const error = resJson.error;
  if (error) {
    console.log(error);
    if (error.includes('user')) {
      messageUser.classList.add('messageErrorActive');
      messagePassword.classList.remove('messageErrorActive');
    }
    if (error.includes('password')) {
      messageUser.classList.remove('messageErrorActive');
      messagePassword.classList.add('messageErrorActive');
    }
  }

  if (!error) {
    messageUser.classList.remove('messageErrorActive');
    const token = resJson.payload.token;
    return token;
  }
}




