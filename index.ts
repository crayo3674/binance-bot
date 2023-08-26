import { getAllPages, calcMaxPrice, calcMinPrice, calcMedianPrice, calcTotalTradableQuantity } from './src/utils/fetchP2PData';
import { Options } from './src/utils/models';

const options: Options = {
    fiat: 'VES',
    countries: [],
    asset: 'USDT',
    payTypes: ['Banesco', 'Mercantil', 'BancoDeVenezuela', 'PagoMovil', 'BNCBancoNacional', 'BBVABank', 'Provincial'],
    rows: 20,
    publisherType: null,
    shieldMerchantAds: false,
    proMerchantAds: false
}

const getData = async () => {
    const promisesData = [
        getAllPages({ ...options, tradeType: 'BUY' } ),
        getAllPages({ ...options, tradeType: 'SELL' } )
    ];

    const data = await Promise.all(promisesData);

    console.log('---BUY---');
    console.log(`Supply: ${ calcTotalTradableQuantity(data[0]).toLocaleString() } USDT`);
    console.log(`Median price: ${ calcMedianPrice(data[0]).toLocaleString() } USDT`);
    console.log(`Min price: ${ calcMinPrice(data[0]).toLocaleString() } USDT`);
    console.log(`Max price: ${ calcMaxPrice(data[0]).toLocaleString() } USDT`);

    console.log('---SELL---');
    console.log(`Demand: ${ calcTotalTradableQuantity(data[1]).toLocaleString() } USDT`);
    console.log(`Median price: ${ calcMedianPrice(data[1]).toLocaleString() } USDT`);
    console.log(`Min price: ${ calcMinPrice(data[1]).toLocaleString() } USDT`);
    console.log(`Max price: ${ calcMaxPrice(data[1]).toLocaleString() } USDT`);
}

getData();
