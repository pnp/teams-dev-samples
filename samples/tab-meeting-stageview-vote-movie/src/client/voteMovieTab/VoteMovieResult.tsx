import * as React from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import Axios from "axios";
import { IResults } from "../../model/IResults";
import { IVoteMovieResultsProps } from "./IVoteMovieResultsProps";

/**
 * Implementation of the Vote Movie voting part
 */
export const VoteMovieResults: React.FC<IVoteMovieResultsProps> = (props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [movie1, setMovie1] = useState<string>();
    const [movie2, setMovie2] = useState<string>();
    const [movie3, setMovie3] = useState<string>();
    const [votedMovie, setVotedMovie] = useState<string>("");
    const [votes, setVotes] = useState<IResults>();    

    const loadVotes = async () => {
        Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/votesnc/${props.meetingID}`).then((response) => {
            setVotes(response.data);
            getHighestVote(response.data);
        });
    };
    
    const getHighestVote = (votes: IResults) => {
        const votes1: number = parseInt(votes?.votes1!);
        const votes2: number = parseInt(votes?.votes2!);
        const votes3: number = parseInt(votes?.votes3!);
        if (votes1 >= votes2 && votes1 >= votes3) { // If voted equal, show movie 1 per default
            setVotedMovie(movie1!);
        }
        if (votes2 > votes1 && votes2 >= votes3) {
            setVotedMovie(movie2!);
        }
        if (votes3 > votes2 && votes3 > votes1) {
            setVotedMovie(movie3!);
        }
    };

    useEffect(() => {
        videoRef.current?.load();
    }, [votedMovie]);

    useEffect(() => {
        loadVotes();
    }, [movie1]);
    useEffect(() => {
        Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${props.meetingID}`).then((response) => {
            const config = response.data;
            setMovie1(config.movie1url);
            setMovie2(config.movie2url);
            setMovie3(config.movie3url);
        });
    }, []);

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={props.theme}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <Header content="Watch most voted video" />
                </Flex.Item>
                <Flex.Item>
                    <div>
                        <div>
                            <video ref={videoRef} width={640} autoPlay>
                                <source src={votedMovie} type="video/mp4"></source>
                            </video>
                        </div>                    
                    </div>
                </Flex.Item>
                <Flex.Item styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <div>
                        <Text size="smaller" content={`Votes Movie 1: ${votes?.votes1}`} />
                        <Text size="smaller" content={`Votes Movie 2: ${votes?.votes2}`} />
                        <Text size="smaller" content={`Votes Movie 3: ${votes?.votes3}`} />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
