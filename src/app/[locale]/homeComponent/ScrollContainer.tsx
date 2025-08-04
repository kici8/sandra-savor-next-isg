import { useThree } from "@react-three/fiber";
import { SimpleWork } from "./HomeScene";
import { Suspense } from "react";
import { WorkCard } from "./WorkCard";

type ScrollContainerProps = {
  works: SimpleWork[];
  containerRef: React.RefObject<HTMLDivElement>;
  setActiveCard: (index: number) => void;
  isNavigating: boolean;
};

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  works,
  containerRef,
  setActiveCard,
  isNavigating,
}) => {
  const { height } = useThree((state) => state.viewport);

  const cardHeightInViewportPercentage = 0.56;
  const gap = 0.06;
  const cardHeight = height * cardHeightInViewportPercentage - gap;
  const cardWidth = (cardHeight / 4) * 3;
  const cardHeightWithGap = cardHeight + gap;

  return (
    <Suspense fallback={null}>
      {works.map((work, index) => {
        return (
          <WorkCard
            key={work.slug}
            work={work}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            cardHeightWithGap={cardHeightWithGap}
            totalNumberOfCards={works.length}
            index={index}
            containerRef={containerRef}
            setActiveCard={setActiveCard}
            isNavigating={isNavigating}
          />
        );
      })}
    </Suspense>
  );
};
