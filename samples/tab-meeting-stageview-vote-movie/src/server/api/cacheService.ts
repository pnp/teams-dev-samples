import express = require("express");
import * as NodeCache from 'node-cache';
import appConfigService from "./appConfigService";
import { IMovieConfig } from "../../model/IMovieConfig";
import { IResults } from "../../model/IResults";
import * as debug from "debug";
const log = debug("msteams");

export const cacheService = (options: any): express.Router => {
    const router = express.Router();
    const nodeCache = new NodeCache();

    router.post(
        "/votenc/:meetingID/:movie/:userID",
        
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const meetingID: any = req.params.meetingID;
            const movie: any = req.params.movie;
            const userID: any = req.params.userID;
            try {
                const movieVotes = nodeCache.get(`${meetingID}_${movie}`) as string;
                let newMovieVotes = parseInt(movieVotes);
                if (Number.isNaN(newMovieVotes)) {
                    newMovieVotes = 1;
                }
                else {
                    newMovieVotes++;
                }
                nodeCache.set(`${meetingID}_${movie}`, newMovieVotes);

                let votedUsers = nodeCache.get(`${meetingID}_votedUsers`) as string;
                votedUsers += `;${userID}`;
                nodeCache.set(`${meetingID}_votedUsers`, votedUsers);

                log(`Voted for Movie ${movie} in meeting ${meetingID}`);
                log(`New votes: ${newMovieVotes}`);

                res.end("OK");
            }
            catch (ex) {

            }
    });

    router.get(
        "/votesnc/:meetingID",
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const meetingID: any = req.params.meetingID;
            const voted1 = nodeCache.get(`${meetingID}_1`) as string;
            const voted2 = nodeCache.get(`${meetingID}_2`) as string;
            const voted3 = nodeCache.get(`${meetingID}_3`) as string;
            const results: IResults = {
                votes1: voted1?voted1:"0",
                votes2: voted2?voted2:"0",
                votes3: voted3?voted3:"0"
            };
            res.json(results);
    
    });

    router.get(
        "/votable/:meetingID/:userID",
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const meetingID: any = req.params.meetingID;
            const userID: any = req.params.userID;
            let votedUsers = nodeCache.get(`${meetingID}_votedUsers`) as string;
            if (votedUsers && votedUsers.indexOf(userID) > -1) {
                res.json(false);
            }
            else {
                res.json(true);
            }
    });

    router.get(
        "/config/:meetingID",
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const meetingID: any = req.params.meetingID;
            const config: IMovieConfig = await appConfigService.retrieveConfig(meetingID);
            res.json(config);
    });
    
    router.post(
        "/config/:meetingID",
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const meetingID: any = req.params.meetingID;
            const config: IMovieConfig = req.body.config;
            appConfigService.saveConfig(meetingID, config);
    });
    return router;
}