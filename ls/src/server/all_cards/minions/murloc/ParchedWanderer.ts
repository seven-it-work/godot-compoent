import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * ParchedWanderer类 - 继承自Minion，实现ParchedWanderer随从
 */
export class ParchedWanderer extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 117912,
  "strId": "BG30_756",
  "cardType": "minion",
  "name": "Parched Wanderer",
  "nameCN": "焦渴的流浪者",
  "text": "<b>战吼：</b>使一个鱼人获得+2/+3和<b>嘲讽</b>。",
  "mechanics": [
    "BATTLECRY"
  ],
  "referencedTags": [
    "TAUNT"
  ],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG30_756_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG30_756_cardArtFromHsJson256x.png",
  "tier": 2,
  "health": 2,
  "attack": 2,
  "minionTypes": [
    "murloc"
  ],
  "minionTypesCN": [
    "鱼人"
  ],
  "upgradeCard": {
    "id": 117913,
    "strId": "BG30_756_G",
    "cardType": "minion",
    "name": "Parched Wanderer",
    "nameCN": "焦渴的流浪者",
    "text": "<b>战吼：</b>使一个鱼人获得+4/+6和<b>嘲讽</b>。",
    "mechanics": [
      "BATTLECRY"
    ],
    "referencedTags": [
      "TAUNT"
    ],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG30_756_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG30_756_G_cardArtFromHsJson256x.png",
    "tier": 2,
    "health": 4,
    "attack": 4,
    "minionTypes": [
      "murloc"
    ],
    "minionTypesCN": [
      "鱼人"
    ]
  }
};