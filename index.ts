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
    try {
        const promisesData = [
            getAllPages({ ...options, tradeType: 'BUY' } ),
            getAllPages({ ...options, tradeType: 'SELL' } )
        ];

        const data = await Promise.all(promisesData);

        logResult('SELL', options.asset, data[0]);
        logResult('BUY', options.asset, data[1]);
    } catch (e) {
        console.log(e);
    }
}

const logResult = (tradeType: string, coin: string, data: any[]) => {
    console.log(`---${tradeType}---`);
    console.log(`Supply: ${ calcTotalTradableQuantity(data).toLocaleString() } ${coin}`);
    console.log(`Median price: ${ calcMedianPrice(data).toLocaleString() } ${coin}`);
    console.log(`Min price: ${ calcMinPrice(data).toLocaleString() } ${coin}`);
    console.log(`Max price: ${ calcMaxPrice(data).toLocaleString() } ${coin}`);
    console.log(`Total advs: ${ data.length }`);
}

getData();
