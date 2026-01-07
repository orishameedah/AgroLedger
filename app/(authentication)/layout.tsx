// import "../globals.css";
// import { manrope, inter } from "../fonts";
// import { Metadata } from "next";
// import LightRays from "../../components/marketing/LightRays";

// export const metadata: Metadata = {
//   title: "AgroLedger | Transparent Agriculture",
//   description: "Direct farm-to-buyer marketplace",
// };

// export default function MarketingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${manrope.variable} ${inter.variable} antialiased`}
//         style={{ maxWidth: "2000px" }}
//       >
//         <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
//           <LightRays
//             raysOrigin="top-center"
//             raysColor="#fef3c7"
//             raysSpeed={0.9} // Slower is more "Human/Calm"
//             lightSpread={3}
//             rayLength={1.2}
//             followMouse={true}
//             mouseInfluence={0.2}
//             noiseAmount={0.0}
//             distortion={0.01}
//           />
//         </div>

//         {children}
//       </body>
//     </html>
//   );
// }

import LightRays from "../../components/marketing/LightRays";

// Do NOT redefine Metadata if it's already in RootLayout
// Unless you want to override it for these pages specifically.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute inset-0 top-0 z-[-1] min-h-screen overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fef3c7"
          raysSpeed={0.9}
          lightSpread={3}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.0}
          distortion={0.01}
        />
      </div>
      {/* This 'children' represents your /signup or /login pages. 
          They will be wrapped in this LightRays effect.
      */}

      {children}
    </>
  );
}
