import React from "react";

import "./QuestionCard.css";

const QuestionCard = ({ record, selectedTags }) => {
  const { tags } = record;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  const getOrdinalSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const relevantDigits = number % 100;
    const suffix =
      suffixes[(relevantDigits - 20) % 10] ||
      suffixes[relevantDigits] ||
      suffixes[0];
    return suffix;
  };

  const scoreClassName = record.score > 0 ? "positive" : "negative";
  const recordTags = typeof tags === "string" ? tags.split(",") : [...tags];
  return (
    <div className="question-card">
      <div className="question-card__voting">
        <div className={`question-card__score ${scoreClassName}`}>
          {record.score}
        </div>
      </div>
      <div className="question-card__content">
        <div className="question-card__question">
          <div
            className="question-card__ellipsis"
            dangerouslySetInnerHTML={{
              __html: record.title,
            }}
          ></div>
          <div
            className="question-card__tooltip"
            dangerouslySetInnerHTML={{
              __html: record.title,
            }}
          ></div>
        </div>
        <div className="question-card__answer">
          {record.answers.length > 0 && record.answers[0].Body}
        </div>
        <div className="question-card__tags">
          {recordTags.map((tag) => (
            <span
              key={tag}
              className={
                "question-card__tag" +
                (selectedTags.includes(tag) ? " --tag-selected" : "")
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="question-card__details">
        <div className="question-card__date">
          {formatDate(record.creationDate)}
        </div>
        <button className="question-card__view-details">View Details</button>
      </div>
    </div>
  );
};

export default QuestionCard;
