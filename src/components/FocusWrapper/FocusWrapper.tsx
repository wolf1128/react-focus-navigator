import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useUniqueTabIndex from "../../hooks/useUniqueTabIndex";
import { Keys } from "./keys";

interface Props {
  children: React.ReactNode;
  tabIndex?: number;
  focusColor?: string;
  onClick?: (event: React.MouseEvent) => void;
  onLeft?: (event: React.KeyboardEvent) => void;
  onRight?: (event: React.KeyboardEvent) => void;
  onUp?: (event: React.KeyboardEvent) => void;
  onDown?: (event: React.KeyboardEvent) => void;
  onEnter?: (event: React.KeyboardEvent) => void;
  onSelect?: (event: React.KeyboardEvent | React.MouseEvent) => void;
  onSpace?: (event: React.KeyboardEvent) => void;
  onBack?: (event: React.KeyboardEvent) => void;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}

const FocusWrapper = ({
  children,
  tabIndex,
  focusColor = "blue",
  onClick,
  onLeft,
  onRight,
  onUp,
  onDown,
  onEnter,
  onSelect,
  onSpace,
  onBack,
  style,
  autoFocus = false,
  ...AnyOtherProps
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);
  const generatedTabIndex = tabIndex ? tabIndex : useUniqueTabIndex();

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const focusNextTabIndex = (currentTabIndex: number) => {
    const elements = document.querySelectorAll("[tabindex]");
    const tabIndexes = Array.from(elements).map((el) =>
      parseInt(el.getAttribute("tabindex")!, 10)
    );
    const nextTabIndexes = tabIndexes.filter(
      (index) => index > currentTabIndex
    );
    const nextTabIndex =
      nextTabIndexes.length > 0
        ? Math.min(...nextTabIndexes)
        : Math.min(...tabIndexes);
    // Special case: if the nextTabIndex is the same as the currentTabIndex, focus the first element
    if (nextTabIndex === currentTabIndex) {
      const minTabIndex = Math.min(...tabIndexes);
      const firstElement = Array.from(elements).find(
        (el) => parseInt(el.getAttribute("tabindex")!, 10) === minTabIndex
      ) as HTMLElement;
      firstElement && firstElement.focus();
      return firstElement;
    }
    const nextElement = Array.from(elements).find(
      (el) => parseInt(el.getAttribute("tabindex")!, 10) === nextTabIndex
    ) as HTMLElement;
    nextElement && nextElement.focus();
    return nextElement;
  };

  const focusPreviousTabIndex = (currentTabIndex: number) => {
    const elements = document.querySelectorAll("[tabindex]");
    const tabIndexes = Array.from(elements).map((el) =>
      parseInt(el.getAttribute("tabindex")!, 10)
    );
    const prevTabIndexes = tabIndexes.filter(
      (index) => index < currentTabIndex
    );
    const prevTabIndex =
      prevTabIndexes.length > 0
        ? Math.max(...prevTabIndexes)
        : Math.max(...tabIndexes);
    // Special case: if the prevTabIndex is the same as the currentTabIndex, focus the last element
    if (prevTabIndex === currentTabIndex) {
      const maxTabIndex = Math.max(...tabIndexes);
      const lastElement = Array.from(elements).find(
        (el) => parseInt(el.getAttribute("tabindex")!, 10) === maxTabIndex
      ) as HTMLElement;
      lastElement && lastElement.focus();
      return lastElement;
    }
    const prevElement = Array.from(elements).find(
      (el) => parseInt(el.getAttribute("tabindex")!, 10) === prevTabIndex
    ) as HTMLElement;
    prevElement && prevElement.focus();
    return prevElement;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;

    switch (key) {
      case Keys.ArrowDown:
        event.preventDefault();
        focusNextTabIndex(generatedTabIndex);
        break;
      case Keys.ArrowUp:
        event.preventDefault();
        focusPreviousTabIndex(generatedTabIndex);
        break;
      case Keys.Enter:
        event.preventDefault();
        onClick && onClick(event as any);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (autoFocus) {
      const elements = document.querySelectorAll("[tabindex]");
      const tabIndexes = Array.from(elements).map((el) =>
        parseInt(el.getAttribute("tabindex")!, 10)
      );
      const minTabIndex = Math.min(...tabIndexes);
      const firstElement = Array.from(elements).find(
        (el) => parseInt(el.getAttribute("tabindex")!, 10) === minTabIndex
      ) as HTMLElement;
      firstElement && firstElement.focus();
    }
  }, [autoFocus]);

  return (
    <div
      ref={ref}
      tabIndex={generatedTabIndex}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        cursor: "pointer",
        margin: "2px",
        outline: isFocused ? `5px solid ${focusColor}` : "none",
        ...style,
      }}
      {...AnyOtherProps}
    >
      {children}
    </div>
  );
};

export default memo(FocusWrapper);
