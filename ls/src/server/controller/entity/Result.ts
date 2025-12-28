/**
 * 成功结果
 * @param msg 成功消息
 * @param data 成功数据
 * @returns 成功结果
 */
function success(msg: string = '', data: any = {}): Result {
  return new Result(0, msg, data);
}

/**
 * 失败结果
 * @param msg 失败消息
 * @param data 失败数据
 * @returns 失败结果
 */
function fail(msg: string = '', data: any = {}): Result {
  return new Result(1, msg, data);
}

export const ResultFactory = {
  success,
  fail,
};

export class Result {
  /**
   * 结果码 0 成功 其他失败
   */
  code: number = 0;
  /**
   * 结果消息
   */
  msg: string = '';
  /**
   * 结果数据
   */
  data: any = {};

  constructor(code: number = 0, msg: string = '', data: any = {}) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  /**
   * 是否成功
   */
  isSuccess(): boolean {
    return this.code === 0;
  }
}
