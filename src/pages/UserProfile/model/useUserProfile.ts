import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/app/providers/store";
import { IContact } from "src/entities/course/model/types";
// import { useUserCourses } from "src/entities/course/model/useUserCourses";
import { fetchReviewsByContactId } from "src/entities/feedback/model/fetchReviewsByContactId";
import { fetchContactByTelegramId } from "src/entities/user/model/fetchContact";
import { fetchUser } from "src/entities/user/model/fetchUser";
import {
  setLoading,
  setUserProfile,
} from "src/entities/user/model/userProfileSlice";

export const useUserProfile = () => {
  const [contactData, setContactData] = useState<IContact>();

  const dispatch = useDispatch();
  const {
    userData,
    coursesData,
    feedbacks,
    isNotify,
    selectedOptionsProfile,
    uniValueProfile,
    loading,
    error,
  } = useSelector((state: RootState) => state.userProfile);

  const { id } = window.Telegram.WebApp.initDataUnsafe.user;
  const telegramId = String(id);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(setLoading(true));

        // Fetch user data from /users/ endpoint
        const user = await fetchUser(telegramId);

        if (!user) {
          throw new Error("User data not found");
        }

        // Fetch contact data from /contacts/user/{tg_id} endpoint to get image_url
        const contact = await fetchContactByTelegramId(telegramId);
        const reviews = await fetchReviewsByContactId(contact.user_id);

        setContactData(contact);

        dispatch(
          setUserProfile({
            userData: user,
            coursesData: contact,
            feedbacks: reviews || [],
            isNotify: user.notify || false,
            selectedOptionsProfile: contact.subjects || [],
            uniValueProfile: user.university || "",
          })
        );
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadData();
  }, [dispatch, telegramId]);

  return {
    userData,
    coursesData,
    feedbacks,
    isNotify,
    selectedOptionsProfile,
    uniValueProfile,
    loading,
    contactData,
    error,
  };
};
