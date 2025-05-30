import { IContact } from "src/entities/course/model/types";
import { API_BASE_URL } from "../../../shared/config/api";

export const fetchContactById = async (
  contactId: number
): Promise<IContact> => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при запросе к серверу:", error);
    throw error;
  }
};

export const fetchContactByTelegramId = async (
  telegramId: string
): Promise<IContact> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/user/${telegramId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при запросе к серверу:", error);
    throw error;
  }
};
