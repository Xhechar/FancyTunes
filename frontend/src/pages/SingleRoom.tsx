import React from "react";
import { useParams } from "react-router-dom";

export const SingleRoom: React.FC = () => {
  const { RommId } = useParams();

  return (
    <div>
      <h1>Single Room, Roon Id {RommId}</h1>
      <p>Here you can view details about a specific room.</p>
    </div>
  );
}