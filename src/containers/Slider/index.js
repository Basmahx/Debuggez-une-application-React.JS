import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const byDateDesc = data?.focus.sort(
    (evtA, evtB) => new Date(evtB.date) - new Date(evtA.date) // Sort by most recent event.
  );

  // Prevent the white page from appearing.
  const nextCard = () => {
    setTimeout(
      () => setIndex(index + 1 < byDateDesc.length ? index + 1 : 0), // length is undifined
      5000
    );
  };

  useEffect(() => {
    nextCard();
  });

  return (
    <div className="SlideCardList">
      {/* seperated the maps */}
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.title} // event.id made the warning persist, was replaced with event.title
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}>
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((event, radioIdx) => (
            <input
              key={`radio-${event.date}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly // added after the console warning, the radio in this code doesn't need an event handler
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
