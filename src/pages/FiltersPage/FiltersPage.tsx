import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./FiltersPage.module.css";
import FilterItem from "./ui/FilterItem/FilterItem";

const FiltersPage: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const BackButton = window.Telegram.WebApp.BackButton;
    BackButton.show();

    const backHandler = () => BackButton.hide();
    BackButton.onClick(backHandler);

    const historyBackHandler = () => window.history.back();
    window.Telegram.WebApp.onEvent("backButtonClicked", historyBackHandler);

    return () => {
      BackButton.offClick(backHandler);
      window.Telegram.WebApp.offEvent("backButtonClicked", historyBackHandler);
    };
  }, []);

  const [workTypeFilters, setWorkTypeFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [universityFilters, setUniversityFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [sortFilters, setSortFilters] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const handleFilterChange = (section: string, filterName: string) => {
    switch (section) {
      case "workType":
        setWorkTypeFilters((prev) => ({
          ...prev,
          [filterName]: !prev[filterName],
        }));
        break;
      case "university":
        setUniversityFilters((prev) => ({
          ...prev,
          [filterName]: !prev[filterName],
        }));
        break;
      case "sort":
        setSortFilters((prev) => {
          const resetSort = Object.keys(prev).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {} as { [key: string]: boolean });

          return { ...resetSort, [filterName]: true };
        });
        break;
    }
  };

  // const handleApplyFilters = () => {
  // 	const appliedFilters = {
  // 		workType: Object.keys(workTypeFilters).filter(
  // 			key => workTypeFilters[key]
  // 		),
  // 		university: Object.keys(universityFilters).filter(
  // 			key => universityFilters[key]
  // 		),
  // 		sort: Object.keys(sortFilters).find(key => sortFilters[key]) || '',
  // 		rating: checked,
  // 	}

  // 	console.log('Applied filters:', appliedFilters)
  // }

  const handleReset = () => {
    setWorkTypeFilters({});
    setUniversityFilters({});
    setSortFilters({});
    setChecked(false);
  };

  return (
    <div className={styles["filters-page"]}>
      <div className={styles["filters-page__header"]}>
        <h1 className={styles["filters-page__title"]}>Фильтры</h1>
        <button
          className={styles["filters-page__reset-button"]}
          onClick={handleReset}
        >
          Сбросить
        </button>
      </div>

      <div className={styles["filters-page__content"]}>
        <div className={styles["filters-page__section"]}>
          <p className={styles["filters-page__section-title"]}>Предмет</p>
          <FilterItem
            filterItemType="link"
            text="Все предметы"
            path="/subjects"
          />
        </div>

        <div className={styles["filters-page__section"]}>
          <p className={styles["filters-page__section-title"]}>Тип работы</p>
          <div className={styles["filters-page__checkbox-group"]}>
            <FilterItem
              filterItemType="checkbox"
              text="Online помощь"
              isNotify={workTypeFilters["Online помощь"]}
              isNotifyFAQ={() =>
                handleFilterChange("workType", "Online помощь")
              }
            />
            <FilterItem
              filterItemType="checkbox"
              text="Решение задач"
              isNotify={workTypeFilters["Решение задач"]}
              isNotifyFAQ={() =>
                handleFilterChange("workType", "Решение задач")
              }
            />
            <FilterItem
              filterItemType="checkbox"
              text="Дипломная работа"
              isNotify={workTypeFilters["Дипломная работа"]}
              isNotifyFAQ={() =>
                handleFilterChange("workType", "Дипломная работа")
              }
            />
            <FilterItem
              filterItemType="checkbox"
              text="Курсовая работа"
              isNotify={workTypeFilters["Курсовая работа"]}
              isNotifyFAQ={() =>
                handleFilterChange("workType", "Курсовая работа")
              }
            />
            <FilterItem
              filterItemType="checkbox"
              text="Реферат"
              isNotify={workTypeFilters["Реферат"]}
              isNotifyFAQ={() => handleFilterChange("workType", "Реферат")}
            />
          </div>
          <Link
            to="/work-types"
            className={styles["filters-page__show-all-button"]}
          >
            Все типы работ
          </Link>
        </div>

        <div className={styles["filters-page__section"]}>
          <p className={styles["filters-page__section-title"]}>Университет</p>
          <div className={styles["filters-page__checkbox-group"]}>
            <FilterItem
              filterItemType="checkbox"
              text="МГУ имени М. В. Ломоносова"
              isNotify={universityFilters["МГУ имени М. В. Ломоносова"]}
              isNotifyFAQ={() =>
                handleFilterChange("university", "МГУ имени М. В. Ломоносова")
              }
            />
            <FilterItem
              filterItemType="checkbox"
              text="НИУ ВШЭ"
              isNotify={universityFilters["НИУ ВШЭ"]}
              isNotifyFAQ={() => handleFilterChange("university", "НИУ ВШЭ")}
            />
            <FilterItem
              filterItemType="checkbox"
              text="МГТУ имени Баумана"
              isNotify={universityFilters["МГТУ имени Баумана"]}
              isNotifyFAQ={() =>
                handleFilterChange("university", "МГТУ имени Баумана")
              }
            />
            <FilterItem
              filterItemType="checkbox"
              text="МГИМО"
              isNotify={universityFilters["МГИМО"]}
              isNotifyFAQ={() => handleFilterChange("university", "МГИМО")}
            />
            <FilterItem
              filterItemType="checkbox"
              text="МФТИ"
              isNotify={universityFilters["МФТИ"]}
              isNotifyFAQ={() => handleFilterChange("university", "МФТИ")}
            />
          </div>
          <Link
            to="/universities"
            className={styles["filters-page__show-all-button"]}
          >
            Все университеты
          </Link>
        </div>

        <div className={styles["filters-page__section"]}>
          <p className={styles["filters-page__section-title"]}>Отзывы</p>
          <FilterItem
            filterItemType="button"
            text="Курсы с рейтингом 4 и 5 звёзд"
            checked={checked}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>

        <div className={styles["filters-page__section"]}>
          <p className={styles["filters-page__section-title"]}>Сортировать</p>
          <div className={styles["filters-page__checkbox-group"]}>
            <FilterItem
              filterItemType="checkbox"
              text="По умолчанию"
              isNotify={sortFilters["По умолчанию"]}
              isNotifyFAQ={() => handleFilterChange("sort", "По умолчанию")}
            />
            <FilterItem
              filterItemType="checkbox"
              text="По дате"
              isNotify={sortFilters["По дате"]}
              isNotifyFAQ={() => handleFilterChange("sort", "По дате")}
            />
            <FilterItem
              filterItemType="checkbox"
              text="Дешевле"
              isNotify={sortFilters["Дешевле"]}
              isNotifyFAQ={() => handleFilterChange("sort", "Дешевле")}
            />
            <FilterItem
              filterItemType="checkbox"
              text="Дороже"
              isNotify={sortFilters["Дороже"]}
              isNotifyFAQ={() => handleFilterChange("sort", "Дороже")}
            />
          </div>
        </div>
      </div>

      <button className={styles["filters-page__button-save"]}>Применить</button>
    </div>
  );
};

export default FiltersPage;
