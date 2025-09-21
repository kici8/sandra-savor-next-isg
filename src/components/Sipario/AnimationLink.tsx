"use client";

import gsap from "gsap";
import { Url } from "next/dist/shared/lib/router/router";
import { useSiparioEffects } from "./SiparioEffectsProvider";
import {
  SiparioImageRegistry,
  UpdateEffectProps,
} from "./useSiparioEffectsManager";
import { usePageTransition } from "./TransitionContext";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

type AnimationLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

type Routes = "home" | "about" | "works" | "work";
type RoutesWithExternal = Routes | "external";

type TransitionFunction = ({
  href,
  router,
  siparioImagesId,
  meshRegistry,
  updateEffect,
}: {
  href: Url;
  router: ReturnType<typeof useRouter>;
  siparioImagesId: string[];
  meshRegistry: SiparioImageRegistry;
  updateEffect: (id: string, props: UpdateEffectProps) => void;
}) => void;

type RouteTransitionMap = {
  [from in RoutesWithExternal]: {
    [to in Routes]: TransitionFunction;
  };
};

const homeToAbout: TransitionFunction = ({
  href,
  siparioImagesId,
  router,
  meshRegistry,
  updateEffect,
}) => {
  // TODO: calcolare tempo per exit animation
  const homeToAboutTimeline = gsap.timeline({});
  // TODO: (in this case will be the selected image)
  const selectedImageId = siparioImagesId[0];
  const firstSiparioImageEntry = meshRegistry.get(selectedImageId);
  if (firstSiparioImageEntry?.effectsRef.current) {
    homeToAboutTimeline.add(() => {
      updateEffect(selectedImageId, {
        name: "curve",
        strength: 0.8,
        duration: 0.6,
        ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
      });
    });
    homeToAboutTimeline.to(
      firstSiparioImageEntry.transformationContainerRef.current.rotation,
      {
        x: Math.PI,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.inOut",
      },
      0, // parte insieme alla riduzione della curvatura
    );
    homeToAboutTimeline.to(
      firstSiparioImageEntry.transformationContainerRef.current.scale,
      {
        x: 5,
        y: 5,
        z: 5,
        delay: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          router.push(href.toString());
        },
      },
      0.4,
    );
    homeToAboutTimeline.add(() => {
      updateEffect(selectedImageId, {
        name: "curve",
        strength: 0.0,
        duration: 0.6,
        ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
      });
    }, 0.4);
  }
};

const AboutToHome: TransitionFunction = ({
  href,
  siparioImagesId,
  router,
  meshRegistry,
  updateEffect,
}) => {
  // TODO: calcolare tempo per exit animation
  const homeToAboutTimeline = gsap.timeline({});
  // TODO: (in this case will be the selected image)
  const selectedImageId = siparioImagesId[0];
  const firstSiparioImageEntry = meshRegistry.get(selectedImageId);
  if (firstSiparioImageEntry?.effectsRef.current) {
    homeToAboutTimeline.add(() => {
      updateEffect(selectedImageId, {
        name: "curve",
        strength: 0.8,
        duration: 0.4,
        ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
      });
    }, 0.4);
    homeToAboutTimeline.to(
      firstSiparioImageEntry.transformationContainerRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        delay: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          router.push(href.toString());
        },
      },
      0.4,
    );
    homeToAboutTimeline.to(
      firstSiparioImageEntry.transformationContainerRef.current.rotation,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.inOut",
      },
      0.8, // parte insieme alla riduzione della curvatura
    );

    homeToAboutTimeline.add(() => {
      updateEffect(selectedImageId, {
        name: "curve",
        strength: 0,
        duration: 0.6,
        ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
      });
    }, 0.8);
  }
};

const defaultTransition: TransitionFunction = ({ router, href }) => {
  // FIXME: remove
  alert("manca transizione");
  router.push(href.toString());
};

const routeTransitions: RouteTransitionMap = {
  home: {
    home: defaultTransition,
    about: homeToAbout,
    works: defaultTransition,
    work: defaultTransition,
  },
  about: {
    home: AboutToHome,
    about: defaultTransition,
    works: defaultTransition,
    work: defaultTransition,
  },
  works: {
    home: defaultTransition,
    about: defaultTransition,
    works: defaultTransition,
    work: defaultTransition,
  },
  work: {
    home: defaultTransition,
    about: defaultTransition,
    works: defaultTransition,
    work: defaultTransition,
  },
  external: {
    home: defaultTransition,
    about: defaultTransition,
    works: defaultTransition,
    work: defaultTransition,
  },
};

function getRoutesFromPath(path: string): Routes | null {
  // TODO: check if path is external (not in the same domain)
  // FIXME: check if next intl navigation expose a better way to get the current route
  console.log("path 🤔🤔", path);
  if (path === "/") return "home";
  if (path == "/about") return "about";
  if (path === "/works/[slug]") return "work";
  if (path === "/works") return "works";
  return null; // default fallback
}

function getAnimationTimeline(from: string, to: string) {
  console.log("👉from", from, "👉to", to);
  if (from === to) return null; // No transition needed
  if (to === "external") return null; // No transition defined for external destinations
  const fromRoute = getRoutesFromPath(from);
  const toRoute = getRoutesFromPath(to);
  if (!fromRoute || !toRoute) return null; // Invalid routes
  console.log("Transition from 🥶🥶🥶🥶", fromRoute, "to", toRoute);
  return routeTransitions[fromRoute][toRoute];
}

// FIXME: cose che mi servono per far funzionare quello che voglio fare
// Un wrapper del componente link che mi permetta di fare una exit animation
// Un context che mi permetta di dire "sto facendo una exit animation" e quindi disabilitare i click sugli altri link
// Un preloader per quando si entra nel sito che permette al sipario di caricarsi
// Un gestore delle transizioni da pagina a pagina che permetta di animare il sipario
// // Il gestore deve tenere traccia del pathname precedente e di quello attuale
// // Il link wrapper deve dire al gestore "sto per cambiare pagina verso X"
// // Il gestore deve dire al sipario "sto per cambiare pagina verso X" e lui deve iniziare l'animazione di chiusura
// // // ci devono essere diverse animazioni del sipario a seconda della pagina di partenza più quella se si arriva da fuori del sito
// // Le animazioni tecnicamente sono delle timeline di gsap che agiscono su variabili che influenzano gli effetti del sipario
// // // ?? mente per le exit animation sulle pagine ??
// come funziona con back/forward del browser?

// Esempio di transizione
// Homepage -> about
// Schiaccio su link about
// Link wrapper dice al gestore "sto per cambiare pagina da home verso about"
// Alcune scritte sulla homepage iniziano a svanire
// Il gestore dice al sipario "sto per cambiare pagina da home verso about"
// // Il sipario inizia l'animazione di transizione
// // La card si piega e ruota per rivelare il retro
// Nel mentre scade l'animazione di svanire delle scritte
// Avviene il cambio di pagina
// Il sipario completa l'animazione di transizione
// // La card torna piatta e dritta occupando tutto lo schermo
// La nuova pagina è completamente fetched e pronta (HOW TO CHECK THIS??)
// Incominciano le animazioni di entrata della pagina about
// // Le scritte appaiono

export const AnimationLink = (props: AnimationLinkProps) => {
  const { href, children, ...rest } = props;
  const pathname = usePathname();
  const router = useRouter();
  const { meshRegistry, updateEffect } = useSiparioEffects();
  const { setIsTransitioning, setToRoute, setFromRoute } = usePageTransition();

  const handleClick = (e: React.MouseEvent, href: Url) => {
    e.preventDefault();
    // TODO: qua avviare l'exit animation
    console.log("Clicked link to", href);
    setIsTransitioning(true);
    const transition = getAnimationTimeline(pathname, href.toString());
    setFromRoute(pathname);
    setToRoute(href.toString());
    if (transition) {
      console.log("Found transition, executing...");
      transition({
        href,
        router,
        siparioImagesId: [
          "https://res.cloudinary.com/dxa1uyrml/image/upload/v1703958262/concerto_01_4121a9c0cd.jpg",
        ],
        meshRegistry: meshRegistry.current!,
        updateEffect,
      });
    } else {
      setIsTransitioning(false);
    }
  };
  return (
    <Link href={href} {...rest} onClick={(e) => handleClick(e, href)}>
      {children}
    </Link>
  );
};
