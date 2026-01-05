import { Spell, spell_utils } from '@/server/controller/entity/Spell';

/**
 * Thaumaturgy类 - 继承自Spell，实现Thaumaturgy法术
 */
export class Thaumaturgy extends Spell {
  constructor() {
    super();
    spell_utils.initSpellData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 116111,
  "strId": "BG31_924t",
  "cardType": "spell",
  "name": "Thaumaturgy",
  "nameCN": "奇术杂耍",
  "text": "直到下个回合，使一个随从获得+{1}/+{1}。<i>（在本局对战中，你每施放4个法术都会提升！）</i>4直到下个回合，使一个随从获得+{1}/+{1}。<i>（施放{0}/4个法术即可提升！）</i>",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_924t_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG31_924t_cardArtFromHsJson256x.png"
};