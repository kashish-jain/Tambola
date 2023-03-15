import * as React from "react";
import { useState, useEffect } from "react";
import { callWin, resultObj } from "./Player";
import { useReward } from 'react-rewards';


// Important: To make the notifications to appear properly and rewards to work properly
// The parent div should have position: relative

interface NotificationProps {
    socket: any;
    type: string;
}


function getUserName(obj: any) {
    return obj.calledWinUsername || obj.user.username;
}

function getMainHeading(obj: any) {
    let mainHeading;
    if (obj.result !== undefined) {
        // this is result Obj
        mainHeading = obj.result + " " + obj.callWinType;
    } else {
        mainHeading = "Call: " + obj.callWinType;
    }
    return mainHeading;
}


function Notification(props: NotificationProps) {
    
    const [notification, setNotification] = useState<null | callWin | resultObj>()
    const { reward } = useReward('rewardId', 'confetti', {
        elementCount: 100,
        angle: 90,
        spread: 90,
        decay: 0.95,
        lifetime: 150,
    });

    useEffect(() => {
        let ticketBoardContainer = document.getElementById(
            "ticket-board-container"
        );

        const deleteNotification = () => {
            setNotification(null)
            ticketBoardContainer?.setAttribute("style", "opacity: 1");
        };

        const notificationSideEffect = (notification: callWin | resultObj) => {
            reward()
            setNotification(notification)
            ticketBoardContainer?.setAttribute("style", "opacity:0.2;");

            // notification gets deleted after 5seconds on everyone's screen
            setTimeout(() => {
                deleteNotification();
            }, 5000);
        }

        props.socket.on("callWinToHost", notificationSideEffect)
        props.socket.on("resultsForPC", notificationSideEffect)
        
        return () => {
            props.socket.off('callWinToHost', notificationSideEffect);
            props.socket.off('resultsForPC', notificationSideEffect);
        };
    })

    let notificationComp = notification ? (
        <div className="notification-container">
            <div className="notification">
                <p className="main animated rubberBand">
                    {getMainHeading(notification)}
                </p>
                <p className="sub animated bounce">
                    {getUserName(notification)}
                </p>
            </div>
        </div>
    ) : null;
    return (
        <>
            {notificationComp}
            <span id="rewardId"></span>
        </>
    );
}

export default Notification;


