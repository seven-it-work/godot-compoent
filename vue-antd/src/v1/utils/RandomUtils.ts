import Random from 'random-js';
import { randomCultivatorName } from './NameGenerator';

// @ts-ignore
const random:Random = new Random(); 

// 随机整数
function randomInt(min: number, max: number): number {
    return random.integer(min, max);
}

// 随机id
function randomId(len: number = 16): string {
    return random.hex(len);
}

const RandomUtils = {
    randomInt,
    randomId,
    random,
    randomCultivatorName
}
export default RandomUtils;

