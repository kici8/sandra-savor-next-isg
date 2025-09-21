"use client";

import { AnimatedCopy } from "@/components/AnimatedCopy";
import { usePageTransition } from "@/components/Sipario/TransitionContext";
import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

type AboutContentProps = {
  title: string;
  description: string;
};

export const AboutContent = ({ title, description }: AboutContentProps) => {
  const { toRoute } = usePageTransition();
  const pathname = usePathname();
  console.log("🤡🤡🤡", pathname, toRoute);
  const showText = toRoute === pathname;

  return (
    <>
      <div className="relative w-full pb-16 pt-32">
        <AnimatedCopy show={showText}>
          <h1
            className="pointer-events-none relative z-10 text-center font-aujournuit text-7xl leading-[0.8]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </AnimatedCopy>
      </div>

      <AnimatedCopy show={showText}>
        <p
          className="relative z-10 -mt-4 text-center text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </AnimatedCopy>

      {/* <div className="py-16">
        <InfoRow title={t("info.servicesLabel")} value={t("info.services")} />
        <InfoRow title={t("info.locationLabel")} value={t("info.location")} />
        <InfoRow
          title={t("info.emailLabel")}
          value={`<a href="mailto:info@savorgnanisandra.it" target=”_blank” class="break-all">info@savorgnanisandra.it</a>`}
        />
        <InfoRow
          title={t("info.socialLabel")}
          value={`<a href="https://www.instagram.com/sandra.savorgnani/" target=”_blank”>Instagram</a>`}
        />
      </div> */}
    </>
  );
};

const InfoRow = ({
  title,
  value,
}: {
  title: React.ReactNode;
  value: string;
}) => (
  <dl className="grid grid-cols-6 gap-4 border-b border-light-color py-2 text-sm">
    <dt className="col-span-2 block">{title}</dt>
    <dd
      className="col-span-4 block font-medium"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></dd>
  </dl>
);
