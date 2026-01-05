import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * SlimyShield类 - 继承自Spell，实现SlimyShield法术
 */
export class SlimyShield extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 105863,
  "strId": "BG27_002t",
  "cardType": "spell",
  "name": "Slimy Shield",
  "nameCN": "黏黏盾",
  "text": "使一个随从获得+1/+1和<b>嘲讽</b>。",
  "mechanics": [],
  "referencedTags": [
    "TAUNT"
  ],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG27_002t_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG27_002t_cardArtFromHsJson256x.png"
};