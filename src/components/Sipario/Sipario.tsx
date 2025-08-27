"use client";

import { WorksForSiparioImagesQuery } from "@/graphql/generated/graphql";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { SiparioImages } from "./SiparioImages";

type SiparioProps = {
  works: WorksForSiparioImagesQuery["works"];
};

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

const Sipario = ({ works }: SiparioProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full" ref={wrapperRef}>
      <Canvas camera={{ isPerspectiveCamera: true, position: [0, 0, 10] }}>
        <Suspense fallback={null}>
          {/* <CameraControls /> */}
          {/* <ambientLight intensity={0.8} />
          <directionalLight position={[2, 4, 32]} intensity={2.6} /> */}
          <SiparioImages wrapperRef={wrapperRef} works={works} />
          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Sipario;
