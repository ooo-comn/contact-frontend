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

  const getFilteredContacts = useCallback(async () => {
    try {
      let params = {};

      if (activeFilter === "Недавние") {
        params = { latest: true };
      } else if (activeFilter === "Купленные") {
        params = { purchased: true };
      }

      const contacts = await fetchContacts(params);
      setContactsData(contacts);
    } catch (error) {
      console.error("Error fetching filtered contacts:", error);
    }
  }, [activeFilter]);

  useEffect(() => {
    getFilteredContacts();
  }, [getFilteredContacts]);

  const filteredData = useMemo(() => {
    if (!contactsData) return [];

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
    isPending,
    startTransition,
  };
};
