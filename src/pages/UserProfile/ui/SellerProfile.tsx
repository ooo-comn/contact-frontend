import { Skeleton } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { calculateRating } from "src/entities/course/lib/calculateRating";
import {
  IContact,
  IReview,
  ITelegramUser,
} from "src/entities/course/model/types";
import { fetchReviewsByContactId } from "src/entities/feedback/model/fetchReviewsByContactId";
import { fetchContactByTelegramId } from "src/entities/user/model/fetchContact";
import { fetchUserById } from "src/entities/user/model/fetchUserById";
import Feedback from "src/shared/components/Feedback/Feedback";
import NavBar from "src/shared/components/NavBar/NavBar";
import Sales from "src/shared/components/Sales/Sales";
import useTheme from "src/shared/hooks/useTheme";
import styles from "./UserProfile.module.css";

const SellerProfile: FC = () => {
  window.scrollTo(0, 0);
  const { id } = useParams<{ id: string }>();

  const BackButton = window.Telegram.WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(function () {
    BackButton.hide();
  });
  window.Telegram.WebApp.onEvent("backButtonClicked", function () {
    window.history.back();
  });

  const [userData, setUserData] = useState<ITelegramUser | null>(null);
  const [contactData, setContactData] = useState<IContact | null>(null);
  const [feedbacks, setFeedbacks] = useState<IReview[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSellerData = async () => {
      if (!id) return;

      try {
        // setLoading(true);

        // Получаем данные пользователя по ID
        const user = await fetchUserById(Number(id));
        setUserData(user);

        // Получаем данные контакта по telegram_id пользователя
        const contact = await fetchContactByTelegramId(
          String(user.telegram_id)
        );
        setContactData(contact);

        // Получаем отзывы
        const reviews = await fetchReviewsByContactId(contact.user_id);
        setFeedbacks(reviews || []);
      } catch (error) {
        console.error("Ошибка загрузки данных продавца:", error);
      } finally {
        // setLoading(false);
      }
    };

    loadSellerData();
  }, [id]);

  const totalStudents = contactData?.customer_count;
  const averageRate = feedbacks.length > 0 ? calculateRating(feedbacks) : 0;
  const { theme } = useTheme();

  return (
    <div className={styles["user-profile"]}>
      <header className={styles["user-profile__header"]}>
        <h2 className={styles["user-profile__title"]}>Профиль</h2>
        {!userData ? (
          <>
            {theme === "dark" ? (
              <>
                <Skeleton
                  variant="circular"
                  animation="wave"
                  className={styles["user-profile__skeleton"]}
                  sx={{ bgcolor: "grey.800" }}
                />

                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className={styles["user-profile__skeleton-name"]}
                  sx={{ bgcolor: "grey.800" }}
                />
              </>
            ) : theme === "light" ? (
              <>
                <Skeleton
                  variant="circular"
                  animation="wave"
                  className={styles["user-profile__skeleton"]}
                  sx={{ bgcolor: "grey.300" }}
                />

                <Skeleton
                  variant="rounded"
                  animation="wave"
                  className={styles["user-profile__skeleton-name"]}
                  sx={{ bgcolor: "grey.300" }}
                />
              </>
            ) : null}
          </>
        ) : (
          <>
            <div
              className={styles["user-profile__avatar"]}
              style={{
                backgroundImage: `url(${contactData?.image_url})`,
              }}
            />
            <p className={styles["user-profile__name"]}>
              {userData?.first_name} {userData?.last_name}
            </p>
          </>
        )}
      </header>

      <section className={styles["user-profile__stats"]}>
        <Sales count={totalStudents || 0} />
        <Feedback
          averageRate={averageRate}
          isCoursePage={false}
          path={`/user-feedback/${userData?.id}`}
          count={feedbacks.length}
        />
      </section>

      <section className={styles["user-profile__content"]}>
        <div className={styles["user-profile__section"]}>
          <h3 className={styles["user-profile__section-title"]}>Университет</h3>
          <p className={styles["user-profile__section-description"]}>
            {userData?.university || "Университет не указан"}
          </p>
        </div>
        <div className={styles["user-profile__line"]} />
        <div className={styles["user-profile__section"]}>
          <h3 className={styles["user-profile__section-title"]}>Предметы</h3>
          <div className={styles["user-profile__wrapper-subjects"]}>
            {contactData?.subjects?.length ? (
              contactData.subjects.map((option) => (
                <div
                  key={String(option)}
                  className={styles["user-profile__subject"]}
                >
                  {option}
                </div>
              ))
            ) : (
              <p className={styles["user-profile__section-description"]}>
                Предметы не указаны
              </p>
            )}
          </div>
        </div>
        <div className={styles["user-profile__line"]} />
        <div className={styles["user-profile__section"]}>
          <h3 className={styles["user-profile__section-title"]}>Типы работ</h3>
          <div className={styles["user-profile__wrapper-subjects"]}>
            {contactData?.work_types?.length ? (
              contactData.work_types.map((option) => (
                <div
                  key={String(option)}
                  className={styles["user-profile__subject"]}
                >
                  {option}
                </div>
              ))
            ) : (
              <p className={styles["user-profile__section-description"]}>
                Типы работ не указаны
              </p>
            )}
          </div>
        </div>
        <div className={styles["user-profile__line"]} />
        <div className={styles["user-profile__section"]}>
          <h3 className={styles["user-profile__section-title"]}>Описание</h3>
          <p className={styles["user-profile__section-description"]}>
            {userData?.description || "Расскажите о себе"}
          </p>
        </div>
      </section>
      <NavBar />
    </div>
  );
};

export default SellerProfile;
