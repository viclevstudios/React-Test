import { useTranslation } from "react-i18next";
import "./TranslationButton.css";

function TranslationButton() {
  const { i18n } = useTranslation();

  const chanceLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }

  return (
    <select
      className="translation-dropdown"
      value={i18n.language}
      onChange={(e) => chanceLanguage(e.target.value)}
    >
      <option className="translation-dropdown-option" value="de">DE</option>
      <option className="translation-dropdown-option" value="en">EN</option>
    </select>
  );
}

export default TranslationButton;