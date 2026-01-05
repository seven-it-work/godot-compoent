import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * WhelpSmuggler类 - 继承自Minion，实现WhelpSmuggler随从
 */
export class WhelpSmuggler extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 72072,
  "strId": "BG21_013",
  "cardType": "minion",
  "name": "Whelp Smuggler",
  "nameCN": "雏龙走私商",
  "text": "每当一条友方的龙获得攻击力，使其获得+1生命值。",
  "mechanics": [
    "TRIGGER_VISUAL"
  ],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_013_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_013_cardArtFromHsJson256x.png",
  "tier": 2,
  "health": 5,
  "attack": 2,
  "minionTypes": [
    "none"
  ],
  "minionTypesCN": [
    "中立"
  ],
  "upgradeCard": {
    "id": 73546,
    "strId": "BG21_013_G",
    "cardType": "minion",
    "name": "Whelp Smuggler",
    "nameCN": "雏龙走私商",
    "text": "每当一条友方的龙获得攻击力，使其获得+2生命值。",
    "mechanics": [
      "TRIGGER_VISUAL"
    ],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_013_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG21_013_G_cardArtFromHsJson256x.png",
    "tier": 2,
    "health": 10,
    "attack": 4,
    "minionTypes": [
      "none"
    ],
    "minionTypesCN": [
      "中立"
    ]
  }
};