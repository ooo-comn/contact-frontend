import { FC } from "react";
import { Link } from "react-router-dom";
import Star from "../../../../shared/assets/course/StarFeedback.svg";
import { IContactCard } from "../../../courses/types/IContactCard";
import styles from "./ContactCard.module.css";

const ContactCard: FC<IContactCard> = ({
  itemCard,
  userPhoto,
  amountOfSales,
  userName,
  userSecondName,
  university,
  averageRate,
  count,
}) => {
  const fullName = `${userName || ""} ${userSecondName || ""}`.trim();

  return (
    <Link to={`/user/${itemCard.user_id}`} className={styles["card"]}>
      <div className={styles["card__user"]}>
        <div className={styles["card__userpic-wrapper"]}>
          <img
            className={styles["card__userpic"]}
            src={userPhoto || ""}
            alt="Аватар"
          />
        </div>
        <div className={styles["card__info"]}>
          <div>
            <h1 className={styles["card__name"]}>{fullName}</h1>
            <p className={styles["card__uni"]}>{university}</p>
          </div>
          <div className={styles["card__info-sales"]}>
            <p className={styles["card__info-sales-count"]}>{amountOfSales}</p>
            <p className={styles["card__info-sales-desc"]}>продаж</p>
          </div>
        </div>
      </div>
      <div className={styles["card__workTypes"]}>
        <h1 className={styles["card__subtitle"]}>Тип работы:</h1>
        <div className={styles["card__tags"]}>
          {itemCard.work_types?.map((workType) => (
            <p key={String(workType)} className={styles["card__tag"]}>
              {workType}
            </p>
          ))}
        </div>
      </div>
      <div className={styles["card__subjects"]}>
        <h1 className={styles["card__subtitle"]}>Предметы:</h1>
        <div className={styles["card__tags"]}>
          {itemCard.subjects?.map((subject) => (
            <p key={String(subject)} className={styles["card__tag"]}>
              {subject}
            </p>
          ))}
        </div>
      </div>
      <div className={styles["card__bottom"]}>
        <div className={styles["card__reviews"]}>
          <img
            className={styles["card__reviews-star"]}
            src={Star}
            alt="Звезда"
          />
          <p className={styles["card__reviews-rate"]}>
            {averageRate ? averageRate.toFixed(1) : "0.0"}
          </p>
          <p className={styles["card__reviews-count"]}>({count || 0})</p>
        </div>
      </div>
    </Link>
  );
};

export default ContactCard;
