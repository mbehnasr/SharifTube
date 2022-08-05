import "video-react/dist/video-react.css";
import {
    BigPlayButton,
    ControlBar,
    ForwardControl,
    LoadingSpinner,
    PlaybackRateMenuButton,
    Player,
    PlayToggle,
    ReplayControl,
    VolumeMenuButton
} from "video-react";
import Link from "next/link";
import {Badge, Card} from "react-bootstrap";
import {css} from "@emotion/react";
import {Component, useEffect, useState} from "react";

export function VideoPlayer(props) {
    return (
        <Player {...props}>
            <BigPlayButton position="center"/>
            <LoadingSpinner/>
            <ControlBar autoHide>
                <ReplayControl seconds={10} order={1.1}/>
                <PlayToggle order={1.2}/>
                <ForwardControl seconds={30} order={1.3}/>
                <VolumeMenuButton vertical/>
                <PlaybackRateMenuButton rates={[2, 1.5, 1.25, 1, 0.75, 0.5]} order={6.1}/>
            </ControlBar>
        </Player>
    )
}

export class LightVideoPlayer extends Component {
    componentDidMount() {
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
        this.player.muted=true;
        this.player.playbackRate = 2;
    }

    handleStateChange(state) {
        this.setState({
            player: state
        });
    }

    render() {
        return (
            <Player {...this.props} ref={player => {this.player = player;}} autoPlay>
                <ControlBar autoHide disableDefaultControls/>
            </Player>
        );
    }
}

export function VideoCard({video, className}) {
    const [mouseEntered, setMouseEntered] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        let timeout;
        if (mouseEntered) {
            timeout = setTimeout(() => setShowVideo(true), 1000);
        }
        return () => {
            if (mouseEntered) {
                clearTimeout(timeout);
                setShowVideo(false);
            }
        }
    }, [mouseEntered]);

    return (
        <Link href={`/${video.uid}`}>
            <Card className="w-100" onMouseEnter={() => setMouseEntered(true)}
                  onMouseOut={() => setMouseEntered(false)}>
                {showVideo ? <LightVideoPlayer src={`/api/videos/${video.uid}/stream`}/> :
                    <Card.Img variant="top" src={`/api/videos/${video.uid}/poster`}/>}
                <Badge css={css`width: 45px;
                  margin-top: -25px;
                  margin-left: 5px`} bg="light" text="dark">
                    {Math.floor(video.duration / 60)}:{video.duration % 60}
                </Badge>
                <Card.Body>
                    <Card.Title><Link href={`/${video.uid}`} passHref><a>{video.title}</a></Link></Card.Title>
                    <Card.Text>
                        {video.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
}