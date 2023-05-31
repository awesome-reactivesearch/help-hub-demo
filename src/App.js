import React, { useRef, useState } from "react";
import {
  ReactiveBase,
  SearchBox,
  ReactiveList,
  TagCloud,
  AIAnswer,
} from "@appbaseio/reactivesearch";
import QuestionCard from "./components/QuestionCard/QuestionCard.component";
import AIButton from "./components/AIButton/AIButton.component";
import ResponsiveWrapper from "./components/ResponsiveWrapper/ResponsiveWrapper.component";

const COMPONENT_ID_S = {
  TAG_FILTER: "tags-filter",
  SEARCH_SENSOR: "search-sensor",
  SEARCH_RESULT: "search-result",
  AI_ANSWER: "ai-answer",
};

const App = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAIAnswer, setShowAIAnswer] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const triggerQueryRef = useRef(null);
  const resetSelectedTag = useRef(false);

  const handleAskAIClick = () => {
    setShowAIAnswer(!!searchValue);
    triggerQueryRef.current?.({ isOpen: false, value: searchValue });
  };

  const handleSearchValueChange = (val, triggerQuery) => {
    setSearchValue(val);
    triggerQueryRef.current = val ? triggerQuery : null;
  };

  const handleTransformRequest = (req) => {
    const parsedBody = JSON.parse(req.body);
    const newQueryBody = parsedBody.query.map((obj) => {
      if (obj.id === COMPONENT_ID_S.TAG_FILTER && resetSelectedTag.current) {
        delete obj.value;
      }

      return obj;
    });

    return {
      ...req,
      body: JSON.stringify({ ...parsedBody, query: newQueryBody }),
    };
  };

  return (
    <ReactiveBase
      app="stackoverflow-dataset"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
      reactivesearchAPIConfig={{
        recordAnalytics: true,
        userId: "jon",
      }}
      initialQueriesSyncTime={500}
      transformRequest={handleTransformRequest}
      key={"app"}
    >
      <div className="col">
        <div className="searchbox-wrapper">
          <SearchBox
            dataField={[
              { field: "title", weight: 10 },
              { field: "title.search", weight: 1 },
              { field: "body", weight: 1 },
              { field: "body.search", weight: 0.1 },
            ]}
            componentId={COMPONENT_ID_S.SEARCH_SENSOR}
            highlight
            size={5}
            enableRecentSuggestions
            recentSuggestionsConfig={{ size: 2, minChars: 3 }}
            queryFormat="and"
            enablePredictiveSuggestions
            value={searchValue}
            onChange={handleSearchValueChange}
            style={{ flex: 1 }}
            beforeValueChange={() => {
              resetSelectedTag.current = true;
            }}
            onValueSelected={() => {
              setSelectedTags([]);
            }}
          />
          {<AIButton text="Ask AI" onClick={handleAskAIClick} />}
        </div>
        <br />
        <div className="row --main-content-wrapper">
          <div className="col">
            <ResponsiveWrapper
              showAIAnswer={showAIAnswer}
              onBackButtonClick={() => setShowAIAnswer(false)}
              key="responsive-wrapper"
            >
              <AIAnswer
                componentId={COMPONENT_ID_S.AI_ANSWER}
                react={{ and: COMPONENT_ID_S.SEARCH_SENSOR }}
                key="ai-answer"
              />
            </ResponsiveWrapper>

            <ReactiveList
              queryFormat="and"
              componentId={COMPONENT_ID_S.SEARCH_RESULT}
              dataField="title"
              size={10}
              className="result-list-container"
              pagination
              react={{
                and: [COMPONENT_ID_S.SEARCH_SENSOR, COMPONENT_ID_S.TAG_FILTER],
              }}
              sortOptions={[
                {
                  label: "Relevance",
                  dataField: "_score",
                  sortBy: "desc",
                },
                {
                  label: "Popularity",
                  dataField: "score",
                  sortBy: "desc",
                },
              ]}
              renderItem={(item) => {
                return (
                  <QuestionCard
                    key={item.id}
                    record={item}
                    selectedTags={selectedTags}
                  />
                );
              }}
              loader={
                <div className="results-loader">
                  <img
                    src="https://i.gifer.com/ZWdx.gif"
                    alt="results-loading"
                    width="100%"
                  />
                </div>
              }
              showLoader
              defaultQuery={() => {
                return { track_total_hits: true };
              }}
            />
          </div>
          <div className="col tags-filter-wrapper">
            <TagCloud
              componentId={COMPONENT_ID_S.TAG_FILTER}
              dataField="tags"
              showCount={false}
              multiSelect={true}
              react={{
                and: [COMPONENT_ID_S.SEARCH_SENSOR],
              }}
              loader="Loading Tags... 🏷️"
              queryFormat="and"
              onChange={(val) => {
                let finalSelectedTags = [];
                if (selectedTags.includes(val)) {
                  finalSelectedTags = selectedTags.filter((_) => _ !== val);
                } else {
                  finalSelectedTags = [...selectedTags, val];
                }
                setSelectedTags(finalSelectedTags);
                resetSelectedTag.current = false;
              }}
              title={"Filter by Tags ☁️"}
              value={selectedTags}
            />
          </div>
        </div>
      </div>
    </ReactiveBase>
  );
};

export default App;
