import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * GlowgulletSoldier类 - 继承自Minion，实现GlowgulletSoldier随从
 */
export class GlowgulletSoldier extends Minion {
  inTavern: boolean = false;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 120718,
  "strId": "BG32_430t",
  "cardType": "minion",
  "name": "Glowgullet Soldier",
  "nameCN": "亮喉士兵",
  "text": "<b>嘲讽</b>",
  "mechanics": [
    "TAUNT"
  ],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_430t_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_430t_cardArtFromHsJson256x.png",
  "tier": 1,
  "health": 1,
  "attack": 1,
  "minionTypes": [
    "quilboar"
  ],
  "minionTypesCN": [
    "野猪人"
  ],
  "upgradeCard": {
    "id": 120719,
    "strId": "BG32_430t_G",
    "cardType": "minion",
    "name": "Glowgullet Soldier",
    "nameCN": "亮喉士兵",
    "text": "<b>嘲讽</b>",
    "mechanics": [
      "TAUNT"
    ],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_430t_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG32_430t_G_cardArtFromHsJson256x.png",
    "tier": 1,
    "health": 2,
    "attack": 2,
    "minionTypes": [
      "quilboar"
    ],
    "minionTypesCN": [
      "野猪人"
    ]
  }
};