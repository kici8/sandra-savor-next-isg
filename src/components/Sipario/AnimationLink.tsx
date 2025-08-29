"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSiparioEffects } from "./SiparioEffectsProvider";
import gsap from "gsap";
import {
  SiparioImageRegistry,
  UpdateEffectProps,
} from "./useSiparioEffectsManager";

type AnimationLinkProps = LinkProps & {
  children: React.ReactNode;
};

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
  console.log("Transition from home to about");
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
        duration: 1.2,
        ease: "power2.inOut",
      },
      "<", // parte insieme alla riduzione della curvatura
    );
    homeToAboutTimeline.to(
      firstSiparioImageEntry.transformationContainerRef.current.scale,
      {
        x: 5,
        y: 5,
        z: 5,
        delay: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          router.push(href.toString());
        },
      },
    );
    homeToAboutTimeline.add(() => {
      updateEffect(selectedImageId, {
        name: "curve",
        strength: 0.0,
        duration: 0.6,
        ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
      });
    }, "<");
  }
};
const defaultTransition = () => {};

const routeTransitions: RouteTransitionMap = {
  home: {
    home: defaultTransition,
    about: homeToAbout,
    works: defaultTransition,
    work: defaultTransition,
  },
  about: {
    home: defaultTransition,
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
  if (path === "/it" || path === "/en") return "home";
  if (path.includes("/about")) return "about";
  if (path.includes("/works")) return "works";
  if (path.includes("/works/")) return "work";
  return null; // default fallback
}

function getAnimationTimeline(from: string, to: string) {
  if (from === to) return null; // No transition needed
  if (to === "external") return null; // No transition defined for external destinations
  const fromRoute = getRoutesFromPath(from);
  const toRoute = getRoutesFromPath(to);
  if (!fromRoute || !toRoute) return null; // Invalid routes
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

  const handleClick = (e: React.MouseEvent, href: Url) => {
    e.preventDefault();
    // TODO: qua avviare l'exit animation
    console.log("Clicked link to", href);
    const transition = getAnimationTimeline(pathname, href.toString());
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
    }
  };
  return (
    <Link href={href} {...rest} onClick={(e) => handleClick(e, href)}>
      {children}
    </Link>
  );
};
