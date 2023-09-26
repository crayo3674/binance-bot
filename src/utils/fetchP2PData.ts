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
    const dataMetric = transformToPropertyArraySide(dataBuy, dataSell);

    const totalTradableQuantity = {
      buy: calcTotalTradableQuantity(dataMetric.buy['tradableQuantitys']),
      sell: calcTotalTradableQuantity(dataMetric.sell['tradableQuantitys'])
    };

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
        ['Median Price', calcMedianPrice(dataMetric.buy['prices']).toLocaleString(), calcMedianPrice(dataMetric.sell['prices'])],
        ['Min Price', calcMinPrice(dataMetric.buy['prices']).toLocaleString(), calcMinPrice(dataMetric.sell['prices']).toLocaleString()],
        ['Max Price', calcMaxPrice(dataMetric.buy['prices']).toLocaleString(), calcMaxPrice(dataMetric.sell['prices']).toLocaleString()],
        ['Total advs', dataBuy.length, dataSell.length],
        ['Total', totalTradableQuantity.buy.toLocaleString(), totalTradableQuantity.sell.toLocaleString()],
        [{ content: 'Diff total', colSpan: 2 }, `${calcDiff(totalTradableQuantity.buy, totalTradableQuantity.sell).toFixed(2)}%`]
    );

    console.log(table.toString());
}

const calcTotalTradableQuantity = (tradableQuantitys: number[]) => {
    return tradableQuantitys.reduce((acc, elem) => acc + elem);
}

const calcMedianPrice = (prices: number[]) => {
    return median(prices);
}

const calcMinPrice = (prices: number[]) => {
    return Math.min(...prices);
}

const calcMaxPrice = (prices: number[]) => {
    return Math.max(...prices);
}

const calcDiff = (a: number, b: number) => {
    if (!a) return 0;

    return ((b - a) / a) * 100;
}

const transformToPropertyArray = (data: TradeDataSearch[]) => {
    return data.reduce((acc, elem, index) => {
        return {
          prices: [...acc['prices'], parseFloat(elem.adv.price)],
          tradableQuantitys: [...acc['tradableQuantitys'], parseFloat(elem.adv.tradableQuantity)]
        };
    }, { prices: [0], tradableQuantitys: [0]});
}

const transformToPropertyArraySide = (dataBuy: TradeDataSearch[], dataSell: TradeDataSearch[]) => {
    return {
        buy: transformToPropertyArray(dataBuy),
        sell: transformToPropertyArray(dataSell)
    }
}
