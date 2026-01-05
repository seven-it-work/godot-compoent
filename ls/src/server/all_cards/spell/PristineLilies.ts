import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * PristineLilies类 - 继承自Spell，实现PristineLilies法术
 */
export class PristineLilies extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 121720,
  "strId": "BG32_237_Gt",
  "cardType": "spell",
  "name": "Pristine Lilies",
  "nameCN": "纯净百合",
  "text": "在本局对战中，你的能使随从获得属性值的酒馆法术额外获得+2攻击力。",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_237_Gt_battlegroundsImageGold.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_237_Gt_cardArtFromHsJson256x.png"
};