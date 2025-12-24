import { Minion } from '@/game/Minion';

/**
 * 无害的骨颅类 - 继承自Minion，实现无害的骨颅的特殊效果
 */
export class HarmlessBonehead extends Minion {
  static BASE_DATA = {
  "id": 104551,
  "strId": "BG28_300",
  "cardType": "minion",
  "name": "Harmless Bonehead",
  "nameCN": "无害的骨颅",
  "text": "<b>亡语：</b>召唤两个1/1的骷髅。",
  "mechanics": [
    "DEATHRATTLE"
  ],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_cardArtFromHsJson256x.png",
  "tokens": [
    {
      "id": 99629,
      "strId": "BG_ICC_026t",
      "cardType": "minion",
      "name": "Skeleton",
      "nameCN": "骷髅",
      "text": "",
      "mechanics": [],
      "referencedTags": [],
      "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_imageFromBlizzardSb.png",
      "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_cardArtFromHsJson256x.png",
      "tier": 1,
      "health": 1,
      "attack": 1,
      "minionTypes": [
        "undead"
      ],
      "minionTypesCN": [
        "亡灵"
      ],
      "upgradeCard": {
        "id": 99630,
        "strId": "BG_ICC_026t_G",
        "cardType": "minion",
        "name": "Skeleton",
        "nameCN": "骷髅",
        "text": "",
        "mechanics": [],
        "referencedTags": [],
        "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_battlegroundsImageGold.png",
        "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_cardArtFromHsJson256x.png",
        "tier": 1,
        "health": 2,
        "attack": 2,
        "minionTypes": [
          "undead"
        ],
        "minionTypesCN": [
          "亡灵"
        ]
      }
    }
  ],
  "tier": 1,
  "health": 1,
  "attack": 1,
  "minionTypes": [
    "undead"
  ],
  "minionTypesCN": [
    "亡灵"
  ],
  "upgradeCard": {
    "id": 104554,
    "strId": "BG28_300_G",
    "cardType": "minion",
    "name": "Harmless Bonehead",
    "nameCN": "无害的骨颅",
    "text": "<b>亡语：</b>召唤四个1/1的骷髅。",
    "mechanics": [
      "DEATHRATTLE"
    ],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG28_300_G_cardArtFromHsJson256x.png",
    "tokens": [
      {
        "id": 99630,
        "strId": "BG_ICC_026t_G",
        "cardType": "minion",
        "name": "Skeleton",
        "nameCN": "骷髅",
        "text": "",
        "mechanics": [],
        "referencedTags": [],
        "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_battlegroundsImageGold.png",
        "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG_ICC_026t_G_cardArtFromHsJson256x.png",
        "tier": 1,
        "health": 2,
        "attack": 2,
        "minionTypes": [
          "undead"
        ],
        "minionTypesCN": [
          "亡灵"
        ]
      }
    ],
    "tier": 1,
    "health": 2,
    "attack": 2,
    "minionTypes": [
      "undead"
    ],
    "minionTypesCN": [
      "亡灵"
    ]
  }
};

  /**
   * 重写亡语触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤两个1/1的骷髅
   */
  onDeath(_game: any): void {
    // 亡语：召唤两个1/1的骷髅
    console.log('无害的骨颅：召唤两个1/1的骷髅');
  }
}
