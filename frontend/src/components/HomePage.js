import React from "react";
import { Box, Button, Typography } from "@mui/material";
import logo from "../images/logo.svg";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.scss"
import { styled } from '@mui/system';

const StyledButton = styled(Button)`
    margin-top: 3rem;
    width: 320px;
    background-color: #ffcb36;
    color: #0e141f;
    font-size: 1.5rem;
`

export const HomePage = () => {
    const navigate = useNavigate();

    const uniqueid = () => {
        // always start with a letter (for DOM friendlyness)
        var idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode = Math.floor(Math.random() * 42 + 48);
            if (ascicode < 58 || ascicode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(ascicode);
            }
        } while (idstr.length < 32);

        return idstr;
    }

    const createRoom = () => {
        let uniqueRoomId = "/game/" + uniqueid();
        navigate(uniqueRoomId);
    }

    return (
        <>
        <Box className="hero is-large">
            <Box className="illustration-container">
                <Box className="section container">
                    <Box className="brand">
                        <img src={logo} alt="Tambola" />
                    </Box>
                </Box>
                <Box className="container">
                    <Box className="hero-text-container">
                    <Typography variant="h1" className="title largest-text">
                        Tambola
                    </Typography>
                    <Typography variant="h2" className="subtitle is-size-1">
                        Anywhere Anytime
                    </Typography>
                    <Typography variant="p" className="is-size-3 sub-sub-heading">
                        Same Tambola fun with your loved ones on your browser. Create a
                        game and then share link to play together.
                    </Typography>
                    <StyledButton className="pulse" onClick={createRoom}>
                        Create Game
                    </StyledButton>
                    </Box>
                </Box>
            </Box>
        </Box>
        <Box className="container"><hr /></Box>
        </>
    );
};

export default HomePage;







// <!DOCTYPE html>
// <html>
//   <head>
//     <meta
//       name="description"
//       content="An online multiplayer web tambola, also called housie, with no sign in and no download. Create room and share the link with your friends."
//     />
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <title>Tambola Online</title>
//     <link
//       rel="apple-touch-icon"
//       sizes="180x180"
//       href="./images/apple-touch-icon.png"
//     />
//     <link
//       rel="icon"
//       type="image/png"
//       sizes="32x32"
//       href="./images/favicon-32x32.png"
//     />
//     <link
//       rel="icon"
//       type="image/png"
//       sizes="16x16"
//       href="./images/favicon-16x16.png"
//     />
//     <link rel="manifest" href="./images/site.webmanifest" />
//     <link rel="stylesheet" href="./css/mystyles.css" />
//     <script
//       defer
//       src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"
//     ></script>
//     <!-- Global site tag (gtag.js) - Google Analytics -->
//     <script
//       async
//       src="https://www.googletagmanager.com/gtag/js?id=UA-168093483-1"
//     ></script>
//     <script>
//       window.dataLayer = window.dataLayer || [];
//       function gtag() {
//         dataLayer.push(arguments);
//       }
//       gtag("js", new Date());

//       gtag("config", "UA-168093483-1");
//     </script>
//   </head>

//   <body>
//     <section class="hero is-large">
//       <div class="illustration-container">
//         <header class="section">
//           <div class="container">
//             <div class="brand">
//               <h1>
//                 <a href="/">
//                   <img src="./images/logo.svg" alt="Tambola" />
//                 </a>
//               </h1>
//             </div>
//           </div>
//         </header>
//         <div>
//           <div class="container">
//             <div class="hero-text-container">
//               <h1 class="title largest-text">
//                 Tambola
//               </h1>
//               <h2 class="subtitle is-size-1">
//                 Anywhere Anytime
//               </h2>
//               <p class="is-size-3 sub-sub-heading">
//                 Same Tambola fun with your loved ones on your browser. Create a
//                 game and then share link to play together.
//               </p>
//               <button class="button main-button pulse" id="generate-new-room">
//                 Create Game
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//     <div class="container"><hr /></div>
//   </body>
//   <script src="js/main.js"></script>
// </html>
