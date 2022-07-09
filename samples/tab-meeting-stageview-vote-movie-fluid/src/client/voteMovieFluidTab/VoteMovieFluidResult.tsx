import * as React from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { IVoteMovieFluidResultsProps } from "./IVoteMovieFluidResultsProps";

/**
 * Implementation of the Vote Movie voting part
 */
export const VoteMovieFluidResult: React.FC<IVoteMovieFluidResultsProps> = (props) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [votedMovie, setVotedMovie] = useState<string>("");
  const [votes1, setVotes1] = React.useState<number>(props.votingMap.get("votes1")!);
  const [votes2, setVotes2] = React.useState<number>(props.votingMap.get("votes2")!);
  const [votes3, setVotes3] = React.useState<number>(props.votingMap.get("votes3")!);

  // Still want to see updates on Votings? Uncomment this
  // React.useEffect(() => {
  //   const updateVotes = () => {
  //     setVotes1(props.votingMap.get("votes1")!);
  //     setVotes2(props.votingMap.get("votes2")!);
  //     setVotes3(props.votingMap.get("votes3")!);
  //   };

  //   props.votingMap.on("valueChanged", updateVotes);

  //   return () => {
  //     props.votingMap.off("valueChanged", updateVotes);
  //   };
  // });

  const getHighestVote = () => {
    if (votes1 >= votes2 && votes1 >= votes3) { // If voted equal, show movie 1 per default
        setVotedMovie(props.movie1Url);
    }
    if (votes2 > votes1 && votes2 >= votes3) {
        setVotedMovie(props.movie2Url);
    }
    if (votes3 > votes2 && votes3 > votes1) {
        setVotedMovie(props.movie3Url);
    }
  };

  useEffect(() => {
    videoRef.current?.load();
  }, [votedMovie]);

  useEffect(() => {
    getHighestVote();   
  }, [votes3]);

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
            <span className="votesResult"><Text size="smaller" content={`Votes Movie 1: ${votes1}`} /></span>
            <span className="votesResult"><Text size="smaller" content={`Votes Movie 2: ${votes2}`} /></span>
            <span className="votesResult"><Text size="smaller" content={`Votes Movie 3: ${votes3}`} /></span>
          </div>
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
