import React, { useState } from "react";
import "./QuestionDetailsModal.css";
import { formatDate } from "../../utils";

const QuestionDetailsModal = ({ record, onClose }) => {
  const { title, body, tags, creationDate, answers } = record;
  const [collapsedAnswers, setCollapsedAnswers] = useState(
    [...Array(answers.length).keys()].slice(1)
  );

  const toggleAnswerCollapse = (index) => {
    if (collapsedAnswers.includes(index)) {
      setCollapsedAnswers((prevCollapsed) =>
        prevCollapsed.filter((i) => i !== index)
      );
    } else {
      setCollapsedAnswers((prevCollapsed) => [...prevCollapsed, index]);
    }
  };

  return (
    <div className="question-details-modal">
      <div className="question-details-modal__content">
        <div className="question-details-modal__header">
          <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
          <button
            className="question-details-modal__close-button"
            onClick={onClose}
          >
            &#10007;
          </button>
        </div>
        <div className="question-details-modal__body">
          <div className="question-details-modal__dates">
            <p>
              Asked on <span>{formatDate(creationDate)}</span>
            </p>
          </div>
          <div className="question-details-modal__tags">
            <div className="question-details-modal__tag-container">
              {tags.map((tag, index) => (
                <span key={index} className="question-details-modal__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="question-details-modal__description">
            <h3>Description</h3>
            <p dangerouslySetInnerHTML={{ __html: body }} />
          </div>

          <div className="question-details-modal__answers">
            <h3>Answers</h3>
            <div className="question-details-modal__answer-container">
              {answers
                .sort((a, b) => {
                  return b.Score > a.Score ? 1 : -1;
                })
                .map((answer, index) => (
                  <div className="question-details-modal__answer" key={index}>
                    <div
                      className={`question-details-modal__answer-header ${
                        index === 0 ? "expanded" : "collapsed"
                      }`}
                      onClick={() => toggleAnswerCollapse(index)}
                    >
                      <button className="question-details-modal__collapse-button">
                        {collapsedAnswers.includes(index) ? "+" : "-"}
                      </button>
                      <h4>Answer {index + 1}</h4>
                      <p className="question-details-modal__answer-date">
                        {formatDate(answer.CreationDate)}
                      </p>
                    </div>
                    {!collapsedAnswers.includes(index) && (
                      <div className="question-details-modal__answer-body">
                        <p dangerouslySetInnerHTML={{ __html: answer.Body }} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailsModal;
