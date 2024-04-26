"use client";
/* eslint-disable @next/next/no-img-element */
import { JigsawPuzzle } from "react-jigsaw-puzzle/lib";
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";

type IPuzzleElement = {
  children: any;
};
export function PuzzleElement({ children }: IPuzzleElement) {
  return (
    <div style={{ minWidth: "50vw", backgroundColor: "rgba(255,255,255,0.5)" }}>
      <JigsawPuzzle
        imageSrc={children?.url ?? ""}
        rows={6}
        columns={6}
        onSolved={() => alert("Solved!")}
      />
    </div>
  );
}
