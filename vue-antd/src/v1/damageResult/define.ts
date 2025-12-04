/**
 * 伤害结果类型
 * 用于返回详细的伤害计算信息
 */
export interface DamageResult {
    // 攻击者名称
    attackerName: string;
    // 目标名称
    targetName: string;
    // 基础伤害（未考虑暴击和闪避）
    baseDamage: number;
    // 实际造成的伤害
    actualDamage: number;
    // 是否触发暴击
    isCritical: boolean;
    // 暴击伤害倍率
    criticalMultiplier: number;
    // 是否闪避
    isDodged: boolean;
    // 最终伤害结果（是否击败目标）
    isDefeated: boolean;
    // 目标剩余气血
    targetRemainingQiBlood: number;
}
