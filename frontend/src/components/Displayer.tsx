import React, { useEffect, useState } from "react";
import styles from "../styles/components/Displayer.module.css"

interface DisplayerProps {
  Title: string,
  Message: string
}

export const Displayer: React.FC<DisplayerProps> = (props: DisplayerProps) => {
  let [ DisplayProperty, setDisplayProperty ] = useState<string>("flex");
  useEffect(() => {
    setTimeout(() => {
      setDisplayProperty("none");
    }, 5000);
  }, []);

  return (
    <div
      style={{ display: DisplayProperty }}
      className={styles["entire-container"]}
    >
      <div className={styles["inner-container"]}>
        <h2>{props.Title}</h2>
        <br />
        <p>{props.Message}</p>
      </div>
    </div>
  );
}