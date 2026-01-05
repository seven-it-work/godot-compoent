import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * MineDeeper类 - 继承自Spell，实现MineDeeper法术
 */
export class MineDeeper extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 116203,
  "strId": "BG31_320_Gt2",
  "cardType": "spell",
  "name": "Mine Deeper",
  "nameCN": "深入挖掘",
  "text": "随机获取两张消耗1枚铸币的酒馆法术牌。",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_320_Gt2_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_320_Gt2_cardArtFromHsJson256x.png"
};