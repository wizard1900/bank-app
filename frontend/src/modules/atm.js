import { el, setChildren } from 'redom';
import { header, menu, accountsNav, atmNav, currencyNav } from './header';
import router from '../router';

export async function ATM() {

  function yandexScript() {
    let script = document.createElement('script');
    let head = document.getElementsByTagName('head')[0];
    script.defer = 'defer';
    script.type = 'text/javascript';
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU&load=package.full';
    script.onload = function () {
      ymaps.ready(initMap);
    };

    head.appendChild(script);

    let myPoint = [];
    function initMap() {

      const myMap = new ymaps.Map("map", {

        center: [55.76, 37.64],
        zoom: 10
      });
      for (let i = 0; i < geoLabs.length; i++) {
        myPoint[i] = new ymaps.GeoObject({
          geometry: {
            type: "Point",
            coordinates: [geoLabsLat[i], geoLabsLon[i]],
          }
        });
        myMap.geoObjects.add(myPoint[i]);
      }
    }
  }

  accountsNav.classList.remove('buttonNavActive');
  currencyNav.classList.remove('buttonNavActive');
  atmNav.classList.add('buttonNavActive');

  async function getBanks() {
    const res = await fetch('http://localhost:3000/banks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resJson = await res.json();
    return resJson.payload;
  }

  const geoLabs = await getBanks();
  const geoLabsLat = [];
  const geoLabsLon = [];
  for (let i = 0; i < geoLabs.length - 1; i++) {
    geoLabsLat[i] = geoLabs[i].lat;
    geoLabsLon[i] = geoLabs[i].lon;
  }

  yandexScript();
  const mapContainer = el('div#map')
  mapContainer.style = "width: 1340px; height: 728px;";
  let main = '';
  const atmTitle = el('h1.accountsTitle', 'Карта банкоматов');
  const titleBlock = el('div.titleBlock', atmTitle);
  main = el('main.container', titleBlock, mapContainer);
  setChildren(document.body, header, main)
  menu.classList.remove('none');
  router.navigate('/atm')
}