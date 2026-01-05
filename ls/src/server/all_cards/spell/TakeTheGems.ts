import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * TakeTheGems类 - 继承自Spell，实现TakeTheGems法术
 */
export class TakeTheGems extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 116202,
  "strId": "BG31_320_Gt",
  "cardType": "spell",
  "name": "Take the Gems",
  "nameCN": "挖走宝石",
  "text": "获取4张\n<b>鲜血宝石</b>。",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_320_Gt_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_320_Gt_cardArtFromHsJson256x.png"
};