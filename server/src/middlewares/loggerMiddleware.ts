import { Schema, model } from "mongoose";

const LogSchema = new Schema({
  timestamp: Date,
  method: String,
  url: String,
  ip: String,
  params: Object,
  query: Object,
  body: Object,
  error: String,
});

const saveErrorLog = async (logData: {
  timestamp: Date;
  method: String;
  url: String;
  ip: String;
  params: Object;
  query: Object;
  body: Object;
  error: String;
}) => {
  try {
    const log = new Log(logData);
    await log.save();
    console.log("에러 로그가 성공적으로 저장되었습니다.");
  } catch (error) {
    console.error("에러 로그 저장 오류:", error);
  }
};

const errorLoggerMiddleware = (
  err: Error,
  req?: { method: any; url: any; params: any; query: any; body: any; ip: any },
  res?: any
) => {
  const { method, url, params, query, body, ip } = req;
  const errorLogData = {
    timestamp: new Date(),
    method,
    url,
    ip,
    params,
    query,
    body,
    error: err.message,
  };
  saveErrorLog(errorLogData);
};
const Log = model("Log", LogSchema);

export default errorLoggerMiddleware;
