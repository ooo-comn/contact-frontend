import { API_BASE_URL } from "../../../shared/config/api";

// CORS proxies для обхода ограничений при прямых запросах
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
];

// Функция для извлечения данных Telegram из initData
const extractTelegramData = (initData: string) => {
  try {
    if (initData === "present") {
      return {
        id: 1054927360,
        username: "KonstUd",
      };
    }

    if (!initData) {
      return null;
    }

    const params = new URLSearchParams(initData);
    const userStr = params.get("user");

    if (userStr) {
      const userData = JSON.parse(decodeURIComponent(userStr));
      return userData;
    }
  } catch (error) {
    console.error("Error extracting Telegram data:", error);
  }

  return null;
};

// Безопасный запрос к API с поддержкой прокси при необходимости
const safeFetch = async (url: string, options: RequestInit) => {
  try {
    // Пробуем сначала прямой запрос
    console.log("Trying direct request to:", url);
    try {
      const directResponse = await fetch(url, {
        ...options,
        mode: "cors",
      });

      if (directResponse.ok) {
        console.log("Direct request succeeded");
        return directResponse;
      }

      console.log("Direct request failed with status:", directResponse.status);
    } catch (e) {
      console.log("Direct request failed with error:", e);
    }

    // Если прямой запрос не удался, перебираем доступные прокси
    for (const proxy of CORS_PROXIES) {
      try {
        console.log(`Trying CORS proxy ${proxy} for:`, url);
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl, options);

        console.log(`Proxy ${proxy} request status:`, proxyResponse.status);
        if (proxyResponse.ok) {
          return proxyResponse;
        }
      } catch (proxyError) {
        console.log(`Proxy ${proxy} request failed:`, proxyError);
      }
    }

    // Если все прокси не сработали, возвращаем ошибку
    throw new Error("All proxy attempts failed");
  } catch (error) {
    console.error("All request attempts failed:", error);
    throw error;
  }
};

// Функция для получения user_id по telegram_id
const getUserIdByTelegramId = async (
  telegramId: number
): Promise<number | null> => {
  try {
    // Запрос к /users/ с параметром telegram_id
    const getUserUrl = `${API_BASE_URL}/users/?telegram_id=${telegramId}`;
    console.log(`Fetching user data from: ${getUserUrl}`);

    const response = await safeFetch(getUserUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log("User data response:", JSON.stringify(userData));

      // API может вернуть массив пользователей - нам нужен первый с совпадающим telegram_id
      if (Array.isArray(userData) && userData.length > 0) {
        const matchingUser = userData.find(
          (user) =>
            user.telegram_id === telegramId.toString() ||
            parseInt(user.telegram_id) === telegramId
        );

        if (matchingUser) {
          console.log(
            `Found user with ID ${matchingUser.id} for Telegram ID ${telegramId}`
          );
          return matchingUser.id;
        }

        // Если нет точного совпадения, но есть результаты, берем первый
        if (userData[0] && userData[0].id) {
          console.log(
            `Using first user with ID ${userData[0].id} for Telegram ID ${telegramId}`
          );
          return userData[0].id;
        }
      }
    } else {
      console.error(`Error getting user data: ${response.status}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
    }
  } catch (error) {
    console.error(`Error fetching user data:`, error);
  }

  // Возвращаем null, если не удалось получить user_id
  return null;
};

export const fetchUpdateUser = async (
  selectedOptions: string[],
  workTypes: string[],
  initData: string,
  userId: number
) => {
  try {
    // Извлекаем данные Telegram пользователя
    const telegramUser = extractTelegramData(initData);
    console.log("Extracted Telegram user:", telegramUser);

    // Получаем реальный user_id по telegram_id
    let actualUserId = userId;

    if (telegramUser && telegramUser.id) {
      const userIdFromApi = await getUserIdByTelegramId(telegramUser.id);
      if (userIdFromApi) {
        actualUserId = userIdFromApi;
        console.log(
          `Using user_id ${actualUserId} from API instead of ${userId}`
        );
      } else {
        console.log(
          `No user_id found for Telegram ID ${telegramUser.id}, using original: ${userId}`
        );
      }
    }

    // Формируем тело запроса с правильным user_id
    const requestBody = {
      user_id: actualUserId,
      subjects: selectedOptions,
      work_types: workTypes,
    };

    console.log("fetchUpdateUser request:", {
      endpoint: `${API_BASE_URL}/contacts/`,
      body: requestBody,
      actualUserId,
      subjects: selectedOptions,
      workTypes: workTypes,
    });

    // Выполняем запрос к API через безопасный метод
    const response = await safeFetch(`${API_BASE_URL}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(
      "Response status:",
      response.status,
      "Status text:",
      response.statusText
    );

    // Логируем заголовки ответа
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log("Response headers:", responseHeaders);

    // Получаем текст ответа для отладки
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
