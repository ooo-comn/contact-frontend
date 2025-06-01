import { IContact } from "src/entities/course/model/types";
import { API_BASE_URL } from "../../../shared/config/api";

interface ContactsParams {
  favorites?: boolean;
  latest?: boolean;
  purchased?: boolean;
  skip?: number;
  limit?: number;
}

// Функция для получения избранных контактов пользователя
export const fetchUserFavoriteContacts = async (): Promise<IContact[]> => {
  try {
    const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    const url = `${API_BASE_URL}/contacts/favorites/user/${userId}`;

    const initData = window.Telegram.WebApp.initData;
    console.log("Fetching user favorites from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${initData}`,
      },
    });

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully fetched user favorite contacts:", data.length);
    return data;
  } catch (error) {
    console.error("Ошибка при запросе избранных контактов:", error);
    throw error;
  }
};

export const fetchContacts = async (
  params?: ContactsParams
): Promise<IContact[]> => {
  try {
    // Если запрашиваются избранные, используем специальный эндпоинт
    if (params?.favorites) {
      return await fetchUserFavoriteContacts();
    }

    let url = `${API_BASE_URL}/contacts/`;

    if (params) {
      const queryParams = new URLSearchParams();

      if (params.latest !== undefined) {
        queryParams.append("latest", params.latest.toString());
      }

      if (params.purchased !== undefined) {
        queryParams.append("purchased", params.purchased.toString());
      }

      if (params.skip !== undefined) {
        queryParams.append("skip", params.skip.toString());
      }

      if (params.limit !== undefined) {
        queryParams.append("limit", params.limit.toString());
      }

      // Добавляем user_id для корректной работы API
      const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      if (userId) {
        queryParams.append("user_id", userId.toString());
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Получаем токен авторизации
    const initData = window.Telegram.WebApp.initData;
    console.log("Sending request to:", url);
    console.log(
      "Using authorization token:",
      `tma ${initData.substring(0, 20)}...`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${initData}`,
      },
    });

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully fetched contacts:", data.length);
    return data;
  } catch (error) {
    console.error("Ошибка при запросе к серверу:", error);
    throw error;
  }
};

// Функция для проверки, находится ли контакт в избранном у пользователя
export const checkContactIsFavorite = async (
  contactId: number
): Promise<boolean> => {
  try {
    const favoriteContacts = await fetchUserFavoriteContacts();
    const isFavorite = favoriteContacts.some(
      (contact) => contact.id === contactId
    );
    console.log(`Contact ${contactId} is favorite:`, isFavorite);
    return isFavorite;
  } catch (error) {
    console.error("Ошибка при проверке статуса избранного:", error);
    return false;
  }
};
