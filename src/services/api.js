import axios from "axios";

axios.defaults.baseURL = "https://gotest.com.ua/api/v2/";

export const getTasksBlockAndCurrentTask = (token, block) =>
  axios
    .get(`taskblock/get?token=${token}&block=${block}`)
    .catch((err) =>
      console.warn("api getTasksBlockAndCurrentTask error: ", err)
    );

export const getTaskInfo = (token, taskId, language) =>
  axios
    .get(
      `task/getTaskData?token=${token}&taskId=${taskId}&language=${language}`
    )
    .catch((err) => console.warn("api getTaskInfo error: ", err));

export const checkTest = async (
  token,
  taskId,
  solveTimeSeconds,
  code,
  language
) => {
  var bodyFormData = new FormData();
  bodyFormData.set("token", token);
  bodyFormData.set("taskId", taskId);
  bodyFormData.set("solveTimeSeconds", solveTimeSeconds);
  bodyFormData.set("code", code);
  bodyFormData.set("language", language);
  return axios({
    method: "post",
    url: "https://gotest.com.ua/api/v2/task/check",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  }).catch((err) => console.warn("api checkTest error: ", err));
};

export const getTotalProgress = (token) =>
  axios
    .get(`taskblock/getTotalProgress?token=${token}`)
    .catch((err) => console.warn("api getTotalProgress error: ", err));

export const checkUserSeenHelpVideoForTask = async (
  token,
  eventName,
  eventValue
) => {
  const data = { token, eventName, eventValue };
  return axios({
    method: "post",
    url: "https://gotest.com.ua/api/v2/analytics/addUserEvent",
    data,
    headers: { "Content-Type": "application/json" },
  }).catch((err) =>
    console.warn("api checkUserSeenHelpVideoForTask error: ", err)
  );
};

export const updateInfoTelegramUser = async (token, firstName, phone) => {
  var bodyFormData = new FormData();
  bodyFormData.set("token", token);
  bodyFormData.set("firstName", firstName);
  bodyFormData.set("phone", phone);
  return axios({
    method: "post",
    url: "https://gotest.com.ua/api/v2/tguser/updateInfo",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  }).catch((err) => console.warn("api updateInfoTelegramUser error: ", err));
};

export const changeLanguageToRu = (token) =>
  axios
    .post("groovyscript/execute", {
      token: token,
      filter: "JAVA_GAME",
      query: "setLangRu",
    })
    .catch((err) => console.warn("api changeLanguageToRu error: ", err));

export const changeLanguageToUa = (token) =>
  axios
    .post("groovyscript/execute", {
      token: token,
      filter: "JAVA_GAME",
      query: "setLangUa",
    })
    .catch((err) => console.warn("api changeLanguageToUa error: ", err));
