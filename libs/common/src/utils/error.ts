export class ApiError extends Error {
  msg: string;
  status: number;
  type: string;
  constructor(msg: string, status: number, type: string) {
    super(msg);

    this.msg = msg;
    this.status = status;
    this.type = type;
  }

  toJSON() {
    return {
      message: this.message,
      trace: this.stack,
      status: this.status,
      type: this.type,
    };
  }
}
