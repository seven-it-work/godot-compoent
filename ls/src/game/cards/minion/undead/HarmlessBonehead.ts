import type { BattleContext } from '@/game/Minion';
import { Minion } from '@/game/Minion';
import { Skeleton } from './Skeleton';

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
   * @param context - 死亡上下文
   * @使用方式：当随从死亡时触发
   * 效果：亡语：召唤两个/四个1/1的骷髅（根据是否金色）
   */
  onDeath(context?: BattleContext): void {
    if (!context) return;

    // 根据是否金色决定召唤数量（普通版本2个，金色版本4个）
    const summonCount = this.isGolden ? 4 : 2;
    const { friendlyPlayer, position } = context;

    // 使用 Player 的统一召唤接口
    for (let i = 0; i < summonCount; i++) {
      const skeleton = new Skeleton();
      const success = friendlyPlayer.summonMinion(skeleton, position);

      if (success) {
        // 记录日志
        if (context.addLog) {
          context.addLog(`召唤了 ${skeleton.nameCN}`);
        }
        console.log(
          `无害的骨髅：召唤了 ${skeleton.nameCN} (${skeleton.attack}/${skeleton.health})`
        );
      } else {
        console.log(`无害的骨髅：召唤失败，战场已满`);
        break; // 战场已满，停止继续召唤
      }
    }
  }
}
