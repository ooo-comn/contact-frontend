import { IReview } from "src/entities/course/model/types";
import { API_BASE_URL } from "../../../shared/config/api";

export const fetchReviewsByContactId = async (
  contactId: number
): Promise<IReview[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/?contact_id=${contactId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `tma ${window.Telegram.WebApp.initData}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении отзывов");
    }

    return response.json();
  } catch (error) {
    console.error(
      `Ошибка при загрузке отзывов для контакта ${contactId}:`,
      error
    );
    return []; // Возвращаем пустой массив в случае ошибки
  }
};
