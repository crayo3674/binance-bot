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
import Table from 'cli-table3';

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
            getAllPages(options, 'BUY'),
            getAllPages(options, 'SELL')
        ]);

        logResult(data[0], data[1]);
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

const logResult = (dataBuy: TradeDataSearch[], dataSell: TradeDataSearch[]) => {
    const table = new Table({
        head: ['METRICS', 'BUY', 'SELL'],
        colWidths: [15, 20, 20],
        style: {
            head: [],
            border: [],
            compact: true
        },
        colAligns: ['center', 'center', 'center']
    });

    table.push(
        ['Median Price', calcMedianPrice(dataBuy).toLocaleString(), calcMedianPrice(dataSell).toLocaleString()],
        ['Min Price', calcMinPrice(dataBuy).toLocaleString(), calcMinPrice(dataSell).toLocaleString()],
        ['Max Price', calcMaxPrice(dataBuy).toLocaleString(), calcMaxPrice(dataSell).toLocaleString()],
        ['Total advs', dataBuy.length, dataSell.length],
        ['Total', calcTotalTradableQuantity(dataBuy).toLocaleString(), calcTotalTradableQuantity(dataSell).toLocaleString()],
        [{ content: 'Diff total', colSpan: 2 }, calcDiff(calcTotalTradableQuantity(dataBuy), calcTotalTradableQuantity(dataSell))]
    );

    console.log(table.toString());
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

const calcDiff = (a: number, b: number) => {
    return `${ (((b - a) / a) * 100).toLocaleString() }%`;
}
