/// <reference types="cypress" />
describe('bank-app test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Авторизация', () => {
    cy.get('.inputEnter').first().type('de');
    cy.get('.inputEnter').last().type('sk');
    cy.contains('Войти').click();
    cy.get('.inputEnter').first().clear();
    cy.get('.inputEnter').last().clear();
    cy.contains('поле должно');
    cy.get('.inputEnter').first().type('developer');
    cy.get('.inputEnter').last().type('s');
    cy.contains('Войти').click();
    cy.get('.inputEnter').first().clear();
    cy.get('.inputEnter').last().clear();
    cy.contains('поле должно');
    cy.get('.inputEnter').first().type('developer');
    cy.get('.inputEnter').last().type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Ваши счета');
  });

  it('Работа со счетами', () => {
    cy.get('.inputEnter').first().type('developer');
    cy.get('.inputEnter').last().type('skillbox');
    cy.contains('Войти').click();
    cy.get('.btnOpen')
      .then(($value) => {
        length = $value.length
        cy.contains('Создать новый счет').click();
        cy.get('.btnOpen').should("have.length", length + 1);
      })

    cy.get('.accountNumber').eq(1)
      .then(elems => {
        const accto = [...elems].map(el => el.textContent.trim())[0];
        cy.log("*** length obtained is *** " + accto);
        cy.get('.btnOpen').eq(0).click();
        cy.contains('Просмотр счета');
        cy.get('.inputEnter').eq(0).type('12345');
        cy.get('.inputEnter').eq(1).type('-500');
        cy.contains('Отправить').click();
        cy.contains('введите корректный 26-значный номер счета');
        cy.get('.inputEnter').first().clear();
        cy.get('.inputEnter').eq(0).type(accto);
        cy.contains('Отправить').click();
        cy.contains('введите сумму перевода');
        cy.get('.inputEnter').eq(1).clear();
        cy.get('.inputEnter').eq(1).type('500');
        cy.contains('Отправить').eq(0).click();

        cy.on('window:alert', (text) => {
          expect(text).to.contains('успешно');
        });

      })
    cy.wait(1000);
    cy.contains('Просмотр счета');

    cy.get('.dynBalance').click();
    cy.contains('История баланса');
    cy.contains('Вернуться назад').click();
    cy.contains('Просмотр счета');
    cy.get('.transHistory').click();
    cy.contains('История баланса');
    cy.contains('Вернуться назад').click();
    cy.contains('Вернуться назад').click();
    cy.contains('Ваши счета');
    cy.wait(300);
  });

  it('Сортировка счетов', () => {
    cy.get('.inputEnter').first().type('developer');
    cy.get('.inputEnter').last().type('skillbox');
    cy.contains('Войти').click();

    cy.contains('Выберите из списка').click();
    cy.wait(300);
    cy.contains('По номеру');
    cy.contains('По балансу');
    cy.contains('По последней транзакции');
    cy.wait(300);
    cy.contains('Выберите из списка').click();
    cy.contains('Выход').click();
  });


  it('Навигация и обмен валют', () => {
    cy.get('.inputEnter').first().type('developer');
    cy.get('.inputEnter').last().type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Банкоматы').click();
    cy.wait(1000);
    cy.get('.ymaps-2-1-79-map');
    cy.contains('Счета').click();
    cy.contains('Ваши счета');
    cy.contains('Валюта').click();
    cy.contains('Валютный обмен');
    cy.contains('Обменять').click();
    cy.contains('выберите валюты для обмена');
    cy.get('.selectExchange').eq(1).select('USD');
    cy.contains('Обменять').click();
    cy.contains('введите корректную сумму обмена');
    cy.get('.inputEnter').type('1');
    cy.contains('Обменять').click();
    cy.on('window:alert', (text2) => {
      expect(text2).to.contains('успешно');
    });
    cy.wait(1500);
    cy.contains('Выход').click();
    cy.contains('Вход в аккаунт');
  })
});