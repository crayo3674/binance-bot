import axios, { AxiosRequestConfig } from 'axios';
import { Options } from './models';
import { median } from 'mathjs';

const url = '/bapi/c2c/v2/friendly/c2c/adv/search';

const config: AxiosRequestConfig = {
    validateStatus: status => status === 200,
    baseURL: 'https://p2p.binance.com'
}

export const getPage = (options: Options) => {
    return axios.post(url, options, config);
}

export const getAllPages = async (options: Options) => {
    const firstPage = await getPage({ ...options, page: 1 });
    const totalPages = Math.ceil(parseInt(firstPage.data.total) / 20);
    const pages = [...firstPage.data.data];

    const promisePages = [];
    for (let i = 2; i <= totalPages; i++) {
        promisePages.push(getPage({ ...options, page: i }));
    }
    const resolvePages = await Promise.all(promisePages);

    resolvePages.forEach(elem => {
        pages.push(...elem.data.data);
    });

    return pages;
}

export const calcTotalTradableQuantity = (pages: any[]) => {
    return pages.reduce((acc, elem) => acc + parseFloat(elem.adv.tradableQuantity), 0.00) as number;
}

export const calcMedianPrice = (pages: any[]) => {
    return median(pages.map(elem => elem.adv.price)) as number;
}

export const calcMinPrice = (pages: any[]) => {
    return Math.min(...pages.map(elem => elem.adv.price));
}

export const calcMaxPrice = (pages: any[]) => {
    return Math.max(...pages.map(elem => elem.adv.price));
}
