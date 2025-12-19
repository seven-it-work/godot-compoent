import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

/**
 * ID生成器工具类 - 提供多种UUID生成方法
 */
export class IdGenerator {
  /**
   * 生成随机UUID (v4)
   * @returns 随机生成的UUID字符串
   */
  static generateRandomId(): string {
    return uuidv4();
  }

  /**
   * 基于命名空间和名称生成UUID (v5)
   * @param name - 用于生成UUID的名称
   * @param namespace - 命名空间UUID
   * @returns 基于命名空间和名称生成的UUID字符串
   */
  static generateNamedId(
    name: string,
    namespace: string = '00000000-0000-0000-0000-000000000000'
  ): string {
    return uuidv5(name, namespace);
  }

  /**
   * 生成短ID (截取UUID前8位)
   * @returns 8位短ID字符串
   */
  static generateShortId(): string {
    return uuidv4().substring(0, 8);
  }

  /**
   * 生成带有前缀的ID
   * @param prefix - ID前缀
   * @returns 带有前缀的UUID字符串
   */
  static generatePrefixedId(prefix: string): string {
    return `${prefix}-${uuidv4()}`;
  }

  /**
   * 生成数字ID (基于时间戳和随机数)
   * @returns 数字ID字符串
   */
  static generateNumericId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}${random}`;
  }
}
