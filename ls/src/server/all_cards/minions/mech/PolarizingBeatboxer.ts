import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * PolarizingBeatboxer类 - 继承自Minion，实现PolarizingBeatboxer随从
 */
export class PolarizingBeatboxer extends Minion {
  inTavern: boolean = false;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 98713,
  "strId": "BG26_149",
  "cardType": "minion",
  "name": "Polarizing Beatboxer",
  "nameCN": "极性B-Box拳手",
  "text": "每当你对另一个随从<b>磁力吸附</b>时，还会对本随从<b>磁力吸附</b>。",
  "mechanics": [
    "TRIGGER_VISUAL"
  ],
  "referencedTags": [
    "MAGNETIC"
  ],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_149_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_149_cardArtFromHsJson256x.png",
  "tier": 6,
  "health": 10,
  "attack": 5,
  "minionTypes": [
    "mech"
  ],
  "minionTypesCN": [
    "机械"
  ],
  "upgradeCard": {
    "id": 98718,
    "strId": "BG26_149_G",
    "cardType": "minion",
    "name": "Polarizing Beatboxer",
    "nameCN": "极性B-Box拳手",
    "text": "每当你对另一个随从<b>磁力吸附</b>时，还会对本随从<b>磁力吸附</b>两次。",
    "mechanics": [
      "TRIGGER_VISUAL"
    ],
    "referencedTags": [
      "MAGNETIC"
    ],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_149_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_149_G_cardArtFromHsJson256x.png",
    "tier": 6,
    "health": 20,
    "attack": 10,
    "minionTypes": [
      "mech"
    ],
    "minionTypesCN": [
      "机械"
    ]
  }
};