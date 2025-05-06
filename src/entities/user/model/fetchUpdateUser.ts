import { API_BASE_URL, PROXY_URL } from "../../../shared/config/api";

export const fetchUpdateUser = async (
  selectedOptions: string[],
  workTypes: string[],
  initData: string,
  userId: number
) => {
  // Просто передаем telegram_id, который был извлечен на клиенте
  // Прокси будет делать запрос к API для получения настоящего user_id
  const requestBody = {
    user_id: userId, // это поле заменит прокси на настоящий user_id
    subjects: selectedOptions,
    work_types: workTypes,
  };

  // Формируем заголовок авторизации для серверной части
  const authHeader = initData === "present" ? "tma present" : initData; // В продакшене передаем initData как есть

  const proxyBody = {
    path: "/contacts/",
    body: requestBody,
    authorization: authHeader,
  };

  console.log("fetchUpdateUser request:", {
    endpoint: `${API_BASE_URL}/contacts/`,
    body: requestBody,
    subjects: selectedOptions,
    workTypes: workTypes,
  });

  console.log("Proxy request body:", proxyBody);

  try {
    // Используем прокси-эндпоинт вместо прямого вызова API
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proxyBody),
    });

    console.log(
      "Response status:",
      response.status,
      "Status text:",
      response.statusText
    );

    // Создаем типизированный объект для заголовков
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log("Response headers:", responseHeaders);

    // Получаем сначала текст ответа для отладки
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    let responseData;
    try {
      // Пытаемся распарсить как JSON если возможно
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error("Error parsing response JSON:", e);
      responseData = {
        error: "Failed to parse JSON response",
        rawResponse: responseText,
      };
    }

    const result = {
      status: response.status,
      ok: response.ok,
      data: responseData,
    };

    console.log("fetchUpdateUser response:", result);

    if (!response.ok) {
      let errorMessage = "Server error";
      if (responseData && responseData.error) {
        errorMessage = `${errorMessage}: ${responseData.error}`;
      }
      if (responseData && responseData.details) {
        errorMessage = `${errorMessage} - ${responseData.details}`;
      }

      console.error("fetchUpdateUser error:", new Error(errorMessage));
      throw new Error(
        `Server error (${response.status}): ${JSON.stringify(responseData)}`
      );
    }

    return result;
  } catch (error) {
    console.error("fetchUpdateUser error:", error);
    throw error;
  }
};
