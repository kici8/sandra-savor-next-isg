import { WorksForSiparioImagesQuery } from "@/graphql/generated/graphql";

import { RefObject } from "react";
import { SiparioImage } from "./SiparioImage";

type SiparioImagesProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  works: WorksForSiparioImagesQuery["works"];
};

export const SiparioImages = ({ works, wrapperRef }: SiparioImagesProps) => {
  if (!works) return null;

  const filteredWorks = works.data.filter(
    (work) =>
      work.attributes?.images.data.length &&
      work.attributes?.images.data.length > 0,
  );

  return (
    <group>
      {filteredWorks.map((work, i) => {
        const firstImage = work.attributes?.images.data[0].attributes?.url;
        if (!firstImage || !work.id) return null;
        return (
          <group key={work.id} position={[i * 3.5, 0, i * -3.5]}>
            <SiparioImage imageUrl={firstImage} wrapperRef={wrapperRef} />
          </group>
        );
      })}
    </group>
  );
};
