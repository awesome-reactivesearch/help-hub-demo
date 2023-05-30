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
            dataField={["title", "title.search"]}
            componentId="search-sensor"
            highlight
            size={5}
            enableRecentSuggestions
            recentSuggestionsConfig={{ size: 2, minChars: 3 }}
            queryFormat="and"
            onValueSelected={(val) => {
              console.log("current seachbox value", val);
            }}
            value={searchValue}
            onChange={handleSearchValueChange}
            style={{ flex: 1 }}
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
            />
          </div>
          <div className="col tags-filter-wrapper">
            <TagCloud
              componentId="tags-filter"
              dataField="tags"
              showCount={true}
              multiSelect={true}
              react={{
                and: ["search-sensor"],
              }}
              loader="Loading Tags... 🏷️"
              queryFormat="and"
              onValueChange={(val) => {
                setSelectedTags(val);
              }}
              title={"Filter by Tags ☁️"}
            />
          </div>
        </div>
      </div>
    </ReactiveBase>
  );
};

export default App;
