import * as React from "react";
import { Provider, Flex, Text, Button, Header, mergeThemes } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";

import { IVoteMovieFluidVotingProps } from "./IVoteMovieFluidVotingProps";

/**
 * Implementation of the Vote Movie voting part
 */
export const VoteMovieFluidVoting: React.FC<IVoteMovieFluidVotingProps> = (props) => {
  const [votes1, setVotes1] = React.useState<number>(props.votingMap.get("votes1")!);
  const [votes2, setVotes2] = React.useState<number>(props.votingMap.get("votes2")!);
  const [votes3, setVotes3] = React.useState<number>(props.votingMap.get("votes3")!);

  const video1Ref = React.useRef<HTMLVideoElement>(null);
  const video2Ref = React.useRef<HTMLVideoElement>(null);
  const video3Ref = React.useRef<HTMLVideoElement>(null);
      
  const [votable, setVotable] = useState<boolean>(true);
  const evalVotable = () => {
    const votedUsers: string = props.votingMap.get("votedUsers") as string;
    setVotable(votedUsers.indexOf(props.userID) < 0);
  };
  
  const vote = async () => {    
    let votedUsers = props.votingMap.get("votedUsers");
    votedUsers += `;${props.userID}`;
    props.votingMap.set("votedUsers", votedUsers);
  };
  useEffect(() => {
    evalVotable();
  }, []);

  React.useEffect(() => {
    const updateVotes = () => {
      setVotes1(props.votingMap.get("votes1")!);
      setVotes2(props.votingMap.get("votes2")!);
      setVotes3(props.votingMap.get("votes3")!);
      evalVotable();
    };

    props.votingMap.on("valueChanged", updateVotes);

    return () => {
      props.votingMap.off("valueChanged", updateVotes);
    };
  });
 
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
                  <source src={props.movie1Url} type="video/mp4"></source>
                </video>
              </div>
              {votable &&
              <div>
                <Button className="voteBtn" onClick={() => { props.votingMap.set("votes1", votes1! + 1); vote(); }}>Vote Movie 1</Button>
              </div>}
              <div className="videoFrame">
                <video ref={video2Ref} controls width={260}>
                  <source src={props.movie2Url}></source>
                </video>
              </div>
              {votable &&
              <div>
                <Button className="voteBtn" onClick={() => { props.votingMap.set("votes2", votes2! + 1); vote(); }}>Vote Movie 2</Button>
              </div>}
              <div className="videoFrame">
                <video ref={video3Ref} controls width={260}>
                  <source src={props.movie3Url}></source>
                </video>
              </div>
              {votable &&
              <div>
                <Button className="voteBtn" onClick={() => { props.votingMap.set("votes3", votes3! + 1); vote(); }}>Vote Movie 3</Button>
              </div>}                        
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
