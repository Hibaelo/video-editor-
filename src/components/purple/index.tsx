import React from "react";
import { FULL_SCREEN_TYPES, type Overlay, type PurpleOverlay } from "../../brand/types";
import { clampTop } from "../../brand/layout";
import { ChapterChip, CommentCard, GapBars, PinnedReply } from "./Cards";
import { BWStrike, ChapterBlur } from "./FootageFx";
import { MomentBlocks, MomentCode, MomentCounter, MomentSlider, PlumEndCard } from "./Moments";

export { PurpleCaptions } from "./PurpleCaptions";
export { FrostedCard } from "./FrostedCard";
export { CommentCard, ChapterChip, GapBars, PinnedReply, ChapterBlur, BWStrike };
export { MomentBlocks, MomentCounter, MomentSlider, MomentCode, PlumEndCard };

const PURPLE_TYPES = new Set<string>([
  "comment",
  "chapterChip",
  "gapBars",
  "pinnedReply",
  "chapterBlur",
  "bwStrike",
  ...FULL_SCREEN_TYPES,
]);

export const isPurpleOverlay = (o: Overlay | PurpleOverlay): o is PurpleOverlay => PURPLE_TYPES.has(o.type);
export const isFullScreen = (o: Overlay | PurpleOverlay) => (FULL_SCREEN_TYPES as readonly string[]).includes(o.type);

/** Footage effects sit under captions and cards. */
export const isFootageFx = (o: Overlay | PurpleOverlay) => o.type === "chapterBlur" || o.type === "bwStrike";

/**
 * Renders one Purple Room overlay inside its <Sequence> (frame 0 = overlay start).
 * `captionTop` = top of the caption band (under the chin); `minTop` = top of the card zone (under the captions).
 */
export const PurpleOverlayLayer: React.FC<{
  overlay: PurpleOverlay;
  durationInFrames: number;
  minTop: number;
  captionTop: number;
}> = ({ overlay: o, durationInFrames: d, minTop, captionTop }) => {
  switch (o.type) {
    case "comment":
      return <CommentCard top={clampTop(o.y, minTop)} durationInFrames={d} text={o.text} likes={o.likes} likesFrom={o.likesFrom} />;
    case "chapterChip":
      return <ChapterChip top={clampTop(o.y, minTop)} durationInFrames={d} number={o.number} label={o.label} />;
    case "gapBars":
      return <GapBars top={clampTop(o.y, minTop)} durationInFrames={d} a={o.a} b={o.b} />;
    case "pinnedReply":
      return <PinnedReply top={clampTop(o.y, minTop)} durationInFrames={d} comment={o.comment} reply={o.reply} />;
    case "chapterBlur":
      // the big serif number takes the caption band's place, under the chin
      return <ChapterBlur top={captionTop} durationInFrames={d} number={o.number} label={o.label} />;
    case "bwStrike":
      return (
        <BWStrike
          top={captionTop + 0.115}
          durationInFrames={d}
          word={o.word}
          strikeAt={o.strikeAtMs !== undefined ? (o.strikeAtMs - o.startMs) / 1000 : undefined}
        />
      );
    case "momentBlocks":
      return <MomentBlocks durationInFrames={d} label={o.label} />;
    case "momentCounter":
      return <MomentCounter durationInFrames={d} steps={o.steps} value={o.value} unit={o.unit} kicker={o.kicker} />;
    case "momentSlider":
      return <MomentSlider durationInFrames={d} label={o.label} kicker={o.kicker} percent={o.percent} />;
    case "momentCode":
      return <MomentCode durationInFrames={d} code={o.code} sub={o.sub} file={o.file} />;
    case "endCard":
      return <PlumEndCard durationInFrames={d} line={o.line} handle={o.handle} />;
  }
};
