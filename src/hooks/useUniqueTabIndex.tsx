import { useState, useEffect } from "react";

const getLastTabIndex = () => {
  const elements = document.querySelectorAll("[tabindex]");
  const tabIndexes = Array.from(elements).map((el) =>
    parseInt(el.getAttribute("tabindex")!, 10)
  );
  return tabIndexes.length > 0 ? Math.max(...tabIndexes) : 0;
};

let currentTabIndex = getLastTabIndex() + 1;

const useUniqueTabIndex = () => {
  const [tabIndex, setTabIndex] = useState(currentTabIndex);

  useEffect(() => {
    setTabIndex(currentTabIndex);
    currentTabIndex += 1;
  }, []);

  return tabIndex;
};

export default useUniqueTabIndex;
