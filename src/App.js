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

const App = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAIAnswer, setShowAIAnswer] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const triggerQueryRef = useRef(null);

  const handleAskAIClick = () => {
    setShowAIAnswer(!!searchValue);
    triggerQueryRef.current?.({ isOpen: false, value: searchValue });
  };

  const handleSearchValueChange = (val, triggerQuery) => {
    setSearchValue(val);
    triggerQueryRef.current = val ? triggerQuery : null;
  };

  return (
    <ReactiveBase
      app="stackoverflow-dataset"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
      reactivesearchAPIConfig={{
        recordAnalytics: true,
        userId: "jon",
      }}
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
            componentId="search-sensor"
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
                componentId="ai-answer"
                react={{ and: "search-sensor" }}
                key="ai-answer"
              />
            </ResponsiveWrapper>

            <ReactiveList
              queryFormat="and"
              componentId="SearchResult"
              dataField="title"
              size={10}
              className="result-list-container"
              pagination
              react={{
                and: ["search-sensor", "tags-filter"],
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
              componentId="tags-filter"
              dataField="tags"
              showCount={false}
              multiSelect={true}
              react={{
                and: ["search-sensor"],
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
