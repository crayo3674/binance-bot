import { checkbox } from '@inquirer/prompts';
import select from '@inquirer/select';
import {
    getData,
    getFiatToSelect,
    getPayTypesToSelect,
    getAssets
} from './src/utils/fetchP2PData';

const start = async () => {
    const fiat: string = await select(await getFiatToSelect());
    const payTypes: string[] = await checkbox(await getPayTypesToSelect(fiat));
    const asset: string = await select(await getAssets(fiat));

    await getData({ payTypes, asset, fiat });
}

start();
