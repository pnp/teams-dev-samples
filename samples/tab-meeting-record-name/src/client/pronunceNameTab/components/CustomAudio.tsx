import { PauseIcon, PlayIcon, SpeakerMuteIcon, VolumeDownIcon, VolumeUpIcon } from "@fluentui/react-northstar";
import * as React from "react";

export const CustomAudio = (props) => {
    const audioComp = React.useRef<HTMLAudioElement>(new Audio(props.audioUrl));
    const [muted, setMuted] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);

    React.useEffect(() => {
        audioComp.current.onended = () => { setPlaying(false); };
    }, []);

    const playAudio = () => {
        setPlaying(true);
        audioComp.current.play();
    };
    const pauseAudio = () => {
        setPlaying(false);
        audioComp.current.pause();
    };
    const incVolume = () => {
        audioComp.current.volume += 0.1;
        if (audioComp.current.muted) {
            audioComp.current.muted = false;
            setMuted(false);
        }
    };
    const decVolume = () => {
        audioComp.current.volume -= 0.1;
        if (audioComp.current.volume < 0.1) {
            audioComp.current.volume = 0;
            audioComp.current.muted = true;
            setMuted(true);
        }
    };
    const muteAudio = () => {
        audioComp.current.muted = !muted;
        setMuted(!muted);
    };
    return (
        <div className="customAudio">
            <div className="audioPanel">
                {props.audioUrl !== "" && <audio ref={audioComp} src={props.audioUrl}></audio>}
                <PlayIcon className="audioIcon" disabled={playing} onClick={playAudio} />
                <PauseIcon className="audioIcon" disabled={!playing} onClick={pauseAudio} />
                <VolumeUpIcon className="audioIcon" title="Increase volume" onClick={incVolume} />
                <VolumeDownIcon className="audioIcon" title="Decrease volume" disabled={muted} onClick={decVolume} />
                <SpeakerMuteIcon className="audioIcon" title="Mute" disabled={muted} onClick={muteAudio} />
            </div>
        </div>
    );
};
