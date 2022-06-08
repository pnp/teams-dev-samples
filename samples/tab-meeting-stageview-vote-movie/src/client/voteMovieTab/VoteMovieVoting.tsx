import * as React from "react";
import { Provider, Flex, Text, Button, Header, mergeThemes } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import Axios from "axios";
import { IResults } from "../../model/IResults";
import { IVoteMovieVotingProps } from "./IVoteMovieVotingProps";

/**
 * Implementation of the Vote Movie voting part
 */
export const VoteMovieVoting: React.FC<IVoteMovieVotingProps> = (props) => {
    const video1Ref = React.useRef<HTMLVideoElement>(null);
    const video2Ref = React.useRef<HTMLVideoElement>(null);
    const video3Ref = React.useRef<HTMLVideoElement>(null);
    const [movie1, setMovie1] = useState<string>();
    const [movie2, setMovie2] = useState<string>();
    const [movie3, setMovie3] = useState<string>();
    const [votes, setVotes] = useState<IResults>();
    const [votable, setVotable] = useState<boolean>(true);

    const vote = async (movie: number) => {        
        const response = await Axios.post(`https://${process.env.PUBLIC_HOSTNAME}/api/votenc/${props.meetingID}/${movie}/${props.userID}`);
        evalVotable();
    };

    const loadVotes = async () => {
        Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/votesnc/${props.meetingID}`).then((response) => {
            setVotes(response.data);
            setTimeout(() => loadVotes(), 5000);
        });
    };
    
    const evalVotable = async () => {
        const userID = props.userID;
        Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/votable/${props.meetingID}/${userID}`).then((response) => {
            const config = response.data;
            setVotable(response.data);
        });
    };

    useEffect(() => {
        Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${props.meetingID}`).then((response) => {
            const config = response.data;
            setMovie1(config.movie1url);
            setMovie2(config.movie2url);
            setMovie3(config.movie3url);
        });
        loadVotes();
        evalVotable();
    }, []);

    useEffect(() => {
        video1Ref!.current!.load();
    }, [movie1]);
    useEffect(() => {
        video2Ref!.current!.load();
    }, [movie2]);
    useEffect(() => {
        video3Ref!.current!.load();
    }, [movie3]);
    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={props.theme}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <Header content="Vote for your movie" />
                </Flex.Item>
                <Flex.Item>
                    <div className="panelSize">
                        <div className="videoFrame">
                            <video ref={video1Ref} controls width={260}>
                                <source src={movie1} type="video/mp4"></source>
                            </video>
                        </div>
                        {votable &&
                        <div>
                            <Button className="voteBtn" onClick={() => vote(1)}>Vote Movie 1</Button>
                        </div>}
                        <div className="videoFrame">
                            <video ref={video2Ref} controls width={260}>
                                <source src={movie2}></source>
                            </video>
                        </div>
                        {votable &&
                        <div>
                            <Button className="voteBtn" onClick={() => vote(2)}>Vote Movie 2</Button>
                        </div>}
                        <div className="videoFrame">
                            <video ref={video3Ref} controls width={260}>
                                <source src={movie3}></source>
                            </video>
                        </div>
                        {votable &&
                        <div>
                            <Button className="voteBtn" onClick={() => vote(3)}>Vote Movie 3</Button>
                        </div>}                        
                    </div>
                </Flex.Item>
                <Flex.Item styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <div>
                        <span className="votesResult"><Text size="smaller" content={`Votes Movie 1: ${votes?.votes1}`} /></span>
                        <span className="votesResult"><Text size="smaller" content={`Votes Movie 2: ${votes?.votes2}`} /></span>
                        <span className="votesResult"><Text size="smaller" content={`Votes Movie 3: ${votes?.votes3}`} /></span>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
