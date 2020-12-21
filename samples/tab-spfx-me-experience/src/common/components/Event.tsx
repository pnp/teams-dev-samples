import { MgtTemplateProps } from "mgt-react";
import * as React from "react";
import  styles from './Event.module.scss';
import { css } from "@uifabric/utilities/lib/css";

const MgtEvent = (props: MgtTemplateProps) => {
    const { event } = props.dataContext;
    const dayFromDateTime=(dateTimeString:string) => {
        let date = new Date(dateTimeString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        let monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        let monthIndex = date.getMonth();
        let day = date.getDate();
        let year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ' ' + year;
    };

    const timeRangeFromEvent=(event:any) => {
        if (event.isAllDay) {
            return 'ALL DAY';
        }

        let prettyPrintTimeFromDateTime = date => {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            let minutesStr = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutesStr + ' ' + ampm;
        };

        let start = prettyPrintTimeFromDateTime(new Date(event.start.dateTime));
        let end = prettyPrintTimeFromDateTime(new Date(event.end.dateTime));

        return start + ' - ' + end;
    };

    return (
        <div className={styles.root}>
            <div className={styles.timeContainer}>
                <div className={styles.date}>{dayFromDateTime(event.start.dateTime)}</div>
                <div className={styles.time}>{timeRangeFromEvent(event)}</div>
            </div>

            <div className={styles.separator}>
                <div className={css(styles.verticalLine, styles.top)}></div>
                <div className={styles.circle}>
                    {event.onlineMeeting ? <div className={styles.innerCircle}></div> : ''}

                </div>
                <div className={css(styles.verticalLine, styles.bottom)}></div>
            </div>

            <div className={styles.details}>
                <div className={styles.subject}>{event.subject}</div>
                {event.onlineMeeting ?
                    <a className={styles.teamsJoinLink} href={event.onlineMeeting.joinUrl}>Join Microsoft Teams Meeting</a>
                    : <a href={event.webLink}>
                       Meet at {event.location.displayName}
                    </a>
                }
            </div>
        </div>);
};

export default MgtEvent;