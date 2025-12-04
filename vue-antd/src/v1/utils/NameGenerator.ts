import Random from 'random-js';

// @ts-ignore
const random: Random = new Random();

// 姓氏列表（包含单姓和复姓）
const surnames = [
    // 单姓（扩展）
    '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
    '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
    '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
    '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
    '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
    '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
    '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
    '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
    // 复姓（扩展）
    '东方', '欧阳', '皇甫', '上官', '司马', '诸葛', '司徒', '公孙',
    '司空', '夏侯', '尉迟', '公羊', '澹台', '申屠', '太叔', '轩辕',
    '令狐', '钟离', '宇文', '长孙', '慕容', '鲜于', '闾丘', '司徒',
    '司空', '司寇', '仲孙', '叔孙', '颛孙', '端木', '巫马', '公西'
];

// 男性名字常用字（扩展）
const maleNames = [
    // 第一个字
    '修', '道', '玄', '天', '云', '风', '雷', '电', '龙', '虎',
    '阳', '刚', '勇', '猛', '强', '健', '威', '武', '英', '雄',
    '明', '光', '亮', '辉', '华', '耀', '轩', '昂', '宇', '宙',
    '浩', '瀚', '宏', '博', '广', '大', '壮', '阔', '宏', '远',
    '志', '意', '心', '念', '思', '想', '悟', '道', '德', '仁',
    // 第二个字
    '海', '山', '峰', '岩', '石', '江', '河', '湖', '潭', '溪',
    '飞', '翔', '腾', '跃', '冲', '破', '斩', '杀', '灭', '绝',
    '清', '静', '宁', '安', '平', '和', '泰', '祥', '瑞', '福',
    '宇', '宙', '天', '地', '乾', '坤', '日', '月', '星', '辰',
    '金', '木', '水', '火', '土', '风', '雨', '雷', '电', '云'
];

// 女性名字常用字（扩展）
const femaleNames = [
    // 第一个字
    '灵', '仙', '青', '翠', '绿', '红', '紫', '蓝', '雪', '霜',
    '冰', '玉', '珠', '宝', '金', '银', '珍', '贵', '娇', '艳',
    '美', '丽', '秀', '雅', '静', '娴', '淑', '柔', '婉', '媚',
    '清', '纯', '洁', '净', '明', '亮', '辉', '华', '荣', '贵',
    '香', '芳', '芬', '菲', '兰', '桂', '梅', '菊', '竹', '莲',
    // 第二个字
    '花', '草', '梅', '兰', '竹', '菊', '莲', '荷', '桂', '兰',
    '凤', '凰', '蝶', '燕', '莺', '鹃', '桃', '杏', '梨', '樱',
    '琴', '棋', '书', '画', '诗', '词', '歌', '赋', '音', '韵',
    '雨', '雪', '霜', '露', '云', '霞', '月', '星', '光', '辉',
    '玉', '珠', '宝', '金', '银', '珍', '贵', '娇', '艳', '美'
];

/**
 * 计算最大可能的名字组合数量
 * @param gender 性别
 * @returns 最大可能的名字组合数量
 */
function calculateMaxNameCombinations(gender: 'male' | 'female'): number {
    const nameLibrary = gender === 'male' ? maleNames : femaleNames;
    const surnameCount = surnames.length;
    const singleNameCount = nameLibrary.length;
    const doubleNameCount = (nameLibrary.length / 2) * (nameLibrary.length / 2); // 前半部分数量 * 后半部分数量
    return surnameCount * (singleNameCount + doubleNameCount);
}


/**
 * 随机生成修仙人物姓名（批量）
 * @param gender 性别：'male'（男性）或 'female'（女性）
 * @param count 生成数量，默认1
 * @param allowDuplicate 是否允许重复，默认true
 * @returns 姓名数组
 */
export function randomCultivatorName(gender: 'male' | 'female', count: number = 1, allowDuplicate: boolean = true): string[] {
    // 参数验证
    if (count <= 0) {
        return [];
    }
    
    // 如果不允许重复，先检查最大可能的组合数
    if (!allowDuplicate) {
        const maxCombinations = calculateMaxNameCombinations(gender);
        if (count > maxCombinations) {
            throw new Error(`无法生成 ${count} 个唯一名字。最大可能的组合数为 ${maxCombinations}。`);
        }
    }
    
    const names: string[] = [];
    const nameLibrary = gender === 'male' ? maleNames : femaleNames;
    
    if (allowDuplicate) {
        // 允许重复，直接生成指定数量的名字
        for (let i = 0; i < count; i++) {
            const surname = random.pickone(surnames);
            const nameLength = random.bool(0.7) ? 2 : 1; // 70%概率2个字，30%概率1个字
            
            if (nameLength === 1) {
                // 1个字名字
                const name = random.pickone(nameLibrary);
                names.push(`${surname}${name}`);
            } else {
                // 2个字名字
                // 确保第一个字和第二个字来自不同的部分（避免重复）
                const firstName = random.pickone(nameLibrary.slice(0, 50)); // 前50个是第一个字常用
                const secondName = random.pickone(nameLibrary.slice(50)); // 后50个是第二个字常用
                names.push(`${surname}${firstName}${secondName}`);
            }
        }
    } else {
        // 不允许重复，使用更高效的批量生成算法
        const uniqueNames = new Set<string>();
        
        // 计算需要生成的1字名和2字名的数量
        // 基于70%概率2字名，30%概率1字名的比例
        const totalTwoCharNames = Math.round(count * 0.7);
        const totalOneCharNames = count - totalTwoCharNames;
        
        // 确保不超过最大可能的组合数
        const maxOneCharCombinations = surnames.length * nameLibrary.length;
        const maxTwoCharCombinations = surnames.length * 50 * 50;
        const actualOneCharNames = Math.min(totalOneCharNames, maxOneCharCombinations);
        const actualTwoCharNames = Math.min(count - actualOneCharNames, maxTwoCharCombinations);
        
        // 批量生成1字名
        const usedOneCharCombinations = new Set<string>();
        let generatedOneCharNames = 0;
        
        while (generatedOneCharNames < actualOneCharNames) {
            const surname = random.pickone(surnames);
            const singleName = random.pickone(nameLibrary);
            const name = `${surname}${singleName}`;
            const combinationKey = `${surname}-${singleName}`;
            
            if (!usedOneCharCombinations.has(combinationKey)) {
                uniqueNames.add(name);
                usedOneCharCombinations.add(combinationKey);
                generatedOneCharNames++;
            }
        }
        
        // 批量生成2字名
        const usedTwoCharCombinations = new Set<string>();
        const firstNamePart = nameLibrary.slice(0, 50);
        const secondNamePart = nameLibrary.slice(50);
        let generatedTwoCharNames = 0;
        
        while (generatedTwoCharNames < actualTwoCharNames) {
            const surname = random.pickone(surnames);
            const firstName = random.pickone(firstNamePart);
            const secondName = random.pickone(secondNamePart);
            const name = `${surname}${firstName}${secondName}`;
            const combinationKey = `${surname}-${firstName}-${secondName}`;
            
            if (!usedTwoCharCombinations.has(combinationKey)) {
                uniqueNames.add(name);
                usedTwoCharCombinations.add(combinationKey);
                generatedTwoCharNames++;
            }
        }
        
        // 将Set转换为数组
        uniqueNames.forEach(name => names.push(name));
    }
    
    return names;
}