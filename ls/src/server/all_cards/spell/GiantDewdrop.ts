import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * GiantDewdrop类 - 继承自Spell，实现GiantDewdrop法术
 */
export class GiantDewdrop extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 121722,
  "strId": "BG32_237_Gt2",
  "cardType": "spell",
  "name": "Giant Dewdrop",
  "nameCN": "巨硕滴露",
  "text": "在本局对战中，你的能使随从获得属性值的酒馆法术额外获得+2生命值。",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_237_Gt2_battlegroundsImageGold.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_237_Gt2_cardArtFromHsJson256x.png"
};