import { Random } from 'random-js';
import { randomCultivatorName } from './NameGenerator';

const random: Random = new Random(); 

// 随机整数
function randomInt(min: number, max: number): number {
    return random.integer(min, max);
}

// 随机id
function randomId(len: number = 16): string {
    return random.hex(len);
}

// 从数组中随机选择一个元素
function pickone<T>(array: T[]): T {
    return array[random.integer(0, array.length - 1)]!;
}

const RandomUtils = {
    randomInt,
    randomId,
    random,
    pickone,
    randomCultivatorName
}
export default RandomUtils;

