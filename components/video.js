import "video-react/dist/video-react.css";
import {
    Player,
    BigPlayButton,
    ControlBar,
    ForwardControl,
    LoadingSpinner, PlaybackRateMenuButton,
    PlayToggle,
    ReplayControl,
    VolumeMenuButton
} from "video-react";

export function VideoPlayer(props) {
    return (
        <Player {...props}>
            <BigPlayButton position="center" />
            <LoadingSpinner />
            <ControlBar autoHide>
                <ReplayControl seconds={10} order={1.1} />
                <PlayToggle order={1.2} />
                <ForwardControl seconds={30} order={1.3} />
                <VolumeMenuButton vertical />
                <PlaybackRateMenuButton rates={[2, 1.5, 1.25, 1, 0.75, 0.5]} order={6.1} />
            </ControlBar>
        </Player>
    )
}