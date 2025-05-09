import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { IContact, ITelegramUser } from "src/entities/course/model/types";
import { fetchContacts } from "src/entities/user/model/fetchContacts";

export const useFeed = (
  activeFilter: string,
  userContacts: ITelegramUser[] | null
) => {
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [contactsData, setContactsData] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilteredContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Используем разные параметры в зависимости от выбранного фильтра
      let params: {
        latest?: boolean;
        purchased?: boolean;
        favorites?: boolean;
        limit?: number;
      } = {};

      if (activeFilter === "Недавние") {
        params = { latest: true, limit: 100 };
      } else if (activeFilter === "Купленные") {
        params = { purchased: true, limit: 100 };
      } else if (activeFilter === "Все контакты") {
        // Для "Все контакты" не добавляем параметров, чтобы получить все контакты
        params = { limit: 100 };
      }

      console.log("Fetching contacts with params:", params);
      const contacts = await fetchContacts(params);
      console.log("Fetched contacts:", contacts);
      setContactsData(contacts);
    } catch (error) {
      console.error("Error fetching filtered contacts:", error);
      setError("Ошибка загрузки контактов");
      setContactsData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    getFilteredContacts();
  }, [getFilteredContacts]);

  const filteredData = useMemo(() => {
    if (!contactsData || contactsData.length === 0) return [];

    return contactsData.filter((contact) => {
      // If there's search input, filter by name or other fields
      if (inputValue.trim() !== "") {
        // This is a basic example. You might want to check more fields
        const userName =
          userContacts?.find((user) => user.id === contact.user_id)
            ?.first_name || "";
        const userLastName =
          userContacts?.find((user) => user.id === contact.user_id)
            ?.last_name || "";
        const fullName = `${userName} ${userLastName}`.toLowerCase();

        return fullName.includes(inputValue.toLowerCase());
      }

      return true;
    });
  }, [contactsData, inputValue, userContacts]);

  return {
    inputValue,
    setInputValue,
    filteredData,
    isPending: isPending || isLoading,
    startTransition,
    error,
  };
};
