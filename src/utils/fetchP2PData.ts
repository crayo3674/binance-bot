import { FullOptions, BasicOptions, TradeType, ApiResponse } from './models';
import { url, config } from './constants';
import { median } from 'mathjs';
import axios from 'axios';

// Fetch user options

export const getAssets = async (fiat: string) => {
    const configData = await axios.post(url.config, { fiat }, config);

    return {
        message: 'Select coin',
        choices: configData.data.data.areas
            .find((elem: { area: string }) => elem.area === 'P2P').tradeSides[0].assets
            .map((elem: { asset: string }) => {
                return {
                  name: elem.asset,
                  value: elem.asset
                };
            })
    };
}

export const getPayTypesToSelect = async (fiat: string) => {
    const filterConditions = await axios.post(url.filterConditions, { fiat }, config);

    return {
        message: 'Select payment method',
        choices: filterConditions.data.data.tradeMethods.map(( elem: { identifier: string, tradeMethodName: string }) => {
            return {
                name: elem.tradeMethodName,
                value: elem.identifier
            };
        })
    };

}

export const getFiatToSelect = async () => {
    const fiatList = await axios.post(url.fiatList, undefined, config);

    return {
        message: 'Select fiat',
        choices: fiatList.data.data.map((elem: { currencyCode: string }) => {
            return {
                name: elem.currencyCode,
                value: elem.currencyCode
            };
        })
    };
}

// Fetch page data

export const getData = async (options: BasicOptions) => {
    try {
        const data = await Promise.all([
            getAllPages(options, 'BUY' ),
            getAllPages(options, 'SELL' )
        ]);

        logResult('BUY', options.asset, data[0]);
        logResult('SELL', options.asset, data[1]);
    } catch (e) {
        console.log(e);
    }
}

const getPage = (options: FullOptions) => {
    return axios.post<ApiResponse>(url.search, options, config);
}

const getAllPages = async (options: BasicOptions, tradeType: TradeType) => {
    const firstPage = await getPage({ ...options,  tradeType , page: 1, countries: [], rows: 20 });
    const totalPages = Math.ceil(firstPage.data.total / 20);
    const pages = [...firstPage.data.data];

    const promisePages = [];
    for (let i = 2; i <= totalPages; i++) {
        promisePages.push(getPage({ ...options, page: i, tradeType, countries: [], rows: 20 }));
    }
    const resolvePages = await Promise.all(promisePages);

    resolvePages.forEach(elem => {
        pages.push(...elem.data.data);
    });

    return pages;
}

// Log metric results

const logResult = (tradeType: TradeType, coin: string, data: any[]) => {
    console.log(`--${tradeType}--`);
    console.log(`Total: ${ calcTotalTradableQuantity(data).toLocaleString() } ${coin}`);
    console.log(`Median price: ${ calcMedianPrice(data).toLocaleString() } ${coin}`);
    console.log(`Min price: ${ calcMinPrice(data).toLocaleString() } ${coin}`);
    console.log(`Max price: ${ calcMaxPrice(data).toLocaleString() } ${coin}`);
    console.log(`Total advs: ${ data.length }`);
}

const calcTotalTradableQuantity = (pages: any[]) => {
    return pages.reduce((acc, elem) => acc + parseFloat(elem.adv.tradableQuantity), 0.00) as number;
}

const calcMedianPrice = (pages: any[]) => {
    return median(pages.map(elem => elem.adv.price)) as number;
}

const calcMinPrice = (pages: any[]) => {
    return Math.min(...pages.map(elem => elem.adv.price));
}

const calcMaxPrice = (pages: any[]) => {
    return Math.max(...pages.map(elem => elem.adv.price));
}
