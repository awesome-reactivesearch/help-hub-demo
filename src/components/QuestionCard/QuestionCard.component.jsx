import React from "react";

import "./QuestionCard.css";
import { formatDate } from "../../utils";
import QuestionDetailsModal from "../QuestionDetailsModal/QuestionDetailsModal.component";

const QuestionCard = ({ record, selectedTags }) => {
  const { tags } = record;
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleViewDetails = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const scoreClassName =
    record.score !== 0 ? (record.score > 0 ? "positive" : "negative") : "";
  const recordTags = typeof tags === "string" ? tags.split(",") : [...tags];
  return (
    <>
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
          <div
            className="question-card__answer"
            dangerouslySetInnerHTML={{
              __html: record.body,
            }}
          ></div>
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
          <button
            className="question-card__view-details"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
      {isModalVisible && (
        <QuestionDetailsModal record={record} onClose={handleModalClose} />
      )}
    </>
  );
};

export default QuestionCard;
