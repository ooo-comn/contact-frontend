import { IContact } from "src/entities/course/model/types";
import { API_BASE_URL } from "../../../shared/config/api";

interface ContactsParams {
  favorites?: boolean;
  latest?: boolean;
  purchased?: boolean;
  skip?: number;
  limit?: number;
}

export const fetchContacts = async (
  params?: ContactsParams
): Promise<IContact[]> => {
  try {
    let url = `${API_BASE_URL}/contacts/`;

    if (params) {
      const queryParams = new URLSearchParams();

      if (params.favorites !== undefined) {
        queryParams.append("favorites", params.favorites.toString());
      }

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
