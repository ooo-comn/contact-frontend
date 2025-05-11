import { Skeleton } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculateRating } from "src/entities/course/lib/calculateRating";
import { fetchUserTransactions } from "src/entities/wallet/model/fetchUserTransactions";
import Feedback from "src/shared/components/Feedback/Feedback";
import MyDataCard from "src/shared/components/MyDataCard/MyDataCard";
import NavBar from "src/shared/components/NavBar/NavBar";
import PartnershipCard from "src/shared/components/PartnershipCard/PartnershipCard";
import Sales from "src/shared/components/Sales/Sales";
import { BASE_URL } from "src/shared/config/api";
import useTheme from "src/shared/hooks/useTheme";
import { useUserProfile } from "../model/useUserProfile";
import styles from "./UserProfile.module.css";

const UserProfile: FC = () => {
  window.scrollTo(0, 0);
  const { id } = window.Telegram.WebApp.initDataUnsafe.user;

  var BackButton = window.Telegram.WebApp.BackButton;
  BackButton.show();
  BackButton.onClick(function () {
    BackButton.hide();
  });
  window.Telegram.WebApp.onEvent("backButtonClicked", function () {
    window.history.back();
  });

  const [verifyed, setVerifyed] = useState<string | null>(null);

  const { userData, coursesData, feedbacks, contactData } = useUserProfile();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchUserTransactions(id);
      if (result) {
        setVerifyed(result.verifyed);
      }
    };
    fetchData();
  }, [id]);

  const totalStudents = coursesData?.customer_count;

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
                backgroundImage: `url(https://${BASE_URL}.ru${userData?.photo_url})`,
              }}
            />
            <p className={styles["user-profile__name"]}>
              {userData?.first_name} {userData?.last_name}
            </p>
          </>
        )}

        <Link to={`/edit-profile/${userData?.id}`}>
          <button className={styles["user-profile__settings"]}>
            Настроить профиль
          </button>
        </Link>
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
        <MyDataCard
          title="Пройдите верификацию"
          description="Пройди верификацию, чтобы создавать объявления и начать зарабатывать на своих знаниях. Проверка занимает 3-4 рабочих дня"
          verifyed={verifyed}
          path="/verification-form"
        />
        <PartnershipCard />
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
      <button className={styles["user-profile__button-publish"]}>
        Опубликовать свой контакт
      </button>
      <NavBar />
    </div>
  );
};

export default UserProfile;
