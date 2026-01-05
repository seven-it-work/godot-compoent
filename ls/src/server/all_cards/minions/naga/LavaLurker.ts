import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * LavaLurker类 - 继承自Minion，实现LavaLurker随从
 */
export class LavaLurker extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 80747,
  "strId": "BG23_009",
  "cardType": "minion",
  "name": "Lava Lurker",
  "nameCN": "熔岩潜伏者",
  "text": "每回合对本随从使用的第一张<b>塑造法术</b>的法术牌永久有效。",
  "mechanics": [
    "TRIGGER_VISUAL"
  ],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_009_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_009_cardArtFromHsJson256x.png",
  "tier": 2,
  "health": 5,
  "attack": 2,
  "minionTypes": [
    "naga"
  ],
  "minionTypesCN": [
    "纳迦"
  ],
  "upgradeCard": {
    "id": 80765,
    "strId": "BG23_009_G",
    "cardType": "minion",
    "name": "Lava Lurker",
    "nameCN": "熔岩潜伏者",
    "text": "每回合对本随从使用的前两张<b>塑造法术</b>的法术牌永久有效。",
    "mechanics": [
      "TRIGGER_VISUAL"
    ],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_009_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG23_009_G_cardArtFromHsJson256x.png",
    "tier": 2,
    "health": 10,
    "attack": 4,
    "minionTypes": [
      "naga"
    ],
    "minionTypesCN": [
      "纳迦"
    ]
  }
};