import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * BloodGem类 - 继承自Spell，实现BloodGem法术
 */
export class BloodGem extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 70136,
  "strId": "BG20_GEM",
  "cardType": "spell",
  "name": "Blood Gem",
  "nameCN": "鲜血宝石",
  "text": "使一个随从获得+{0}/+{1}。",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_cardArtFromHsJson256x.png"
};