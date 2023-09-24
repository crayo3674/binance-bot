import {
    FilterConditionsData,
    TradeDataSearch,
    BasicOptions,
    CurrencyData,
    FullOptions,
    ApiResponse,
    ConfigData,
    TradeType
} from './models';
import { url, config } from './constants';
import { median } from 'mathjs';
import axios from 'axios';

// Fetch user options

export const getAssets = async (fiat: string) => {
    const configData = await axios.post<ApiResponse<ConfigData>>(url.config, { fiat }, config);

    return {
        message: 'Select coin',
        choices: configData.data.data.areas
            .find(elem => elem.area === 'P2P')!.tradeSides[0].assets
            .map(elem => {
                return {
                  name: elem.asset,
                  value: elem.asset
                };
            })
    };
}

export const getPayTypesToSelect = async (fiat: string) => {
    const filterConditions = await axios.post<ApiResponse<FilterConditionsData>>(url.filterConditions, { fiat }, config);

    return {
        message: 'Select payment method',
        choices: filterConditions.data.data.tradeMethods.map(elem => {
            return {
                name: elem.tradeMethodName,
                value: elem.identifier
            };
        })
    };

}

export const getFiatToSelect = async () => {
    const fiatList = await axios.post<ApiResponse<CurrencyData>>(url.fiatList, undefined, config);

    return {
        message: 'Select fiat',
        choices: fiatList.data.data.map(elem => {
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
    return axios.post<ApiResponse<TradeDataSearch>>(url.search, options, config);
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

const logResult = (tradeType: TradeType, coin: string, data: TradeDataSearch[]) => {
    console.log(`--${tradeType}--`);
    console.log(`Total: ${ calcTotalTradableQuantity(data).toLocaleString() } ${coin}`);
    console.log(`Median price: ${ calcMedianPrice(data).toLocaleString() } ${coin}`);
    console.log(`Min price: ${ calcMinPrice(data).toLocaleString() } ${coin}`);
    console.log(`Max price: ${ calcMaxPrice(data).toLocaleString() } ${coin}`);
    console.log(`Total advs: ${ data.length }`);
}

const calcTotalTradableQuantity = (pages: TradeDataSearch[]) => {
    return pages.reduce((acc, elem) => acc + parseFloat(elem.adv.tradableQuantity), 0.00);
}

const calcMedianPrice = (pages: TradeDataSearch[]) => {
    return median(pages.map(elem => parseFloat(elem.adv.price)));
}

const calcMinPrice = (pages: TradeDataSearch[]) => {
    return Math.min(...pages.map(elem => parseFloat(elem.adv.price)));
}

const calcMaxPrice = (pages: TradeDataSearch[]) => {
    return Math.max(...pages.map(elem => parseFloat(elem.adv.price)));
}
