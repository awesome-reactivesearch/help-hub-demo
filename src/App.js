import React from "react";
import QuestionCard from "./components/QuestionCard/QuestionCard.component";

const App = () => {
  const record = {
    body: "I've written a database generation script...",
    closedDate: null,
    tags: "flex,actionscript-3,air",
    title: "SQLStatement.execute() - multiple queries in one statement",
    answers: [
      {
        Body: "I wound up using this. It is a kind of a hack...",
        OwnerUserId: 26,
        Score: 12,
        Id: 124,
        CreationDate: "2008-08-01T16:09:47Z",
      },
    ],
    score: 26,
    ownerUserId: 26,
    creationDate: "2008-08-01T13:57:07Z",
    id: 80,
  };

  return <QuestionCard record={record} />;
};

export default App;
