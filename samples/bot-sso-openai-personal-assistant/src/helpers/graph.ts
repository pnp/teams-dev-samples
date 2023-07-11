import { ResponseType } from "@microsoft/microsoft-graph-client";

export class GraphHelper {
    static graphClient: any;

    static async setGraphClient(graphClient: any) {
        this.graphClient = graphClient;
    }

    static async getMyDetails(getNameOnly: boolean) {
        const me = await this.graphClient.api("/me").get();

        if (me) {
            if (getNameOnly) {
                return me.displayName;
            } else {
                return me;
            }
        } else {
            return null;
        }
    }

    static async getMyPhoto() {
        let photoBinary: ArrayBuffer;
        try {
          photoBinary = await this.graphClient
            .api("/me/photo/$value")
            .responseType(ResponseType.ARRAYBUFFER)
            .get();
        } catch {
          return;
        }

        const buffer = Buffer.from(photoBinary);

        return "data:image/png;base64," + buffer.toString("base64");
    }

    static async getMyEvents(futureEventsOnly: boolean) {
        const userEvents = await this.graphClient.api("/me/events").select(["subject", "start", "end", "attendees", "location"]).get();

        if (userEvents) {
            if (futureEventsOnly) {
                return userEvents.value.filter((event: any) => {
                    return new Date(event.end.dateTime) > new Date();
                });
            }
            return userEvents;
        } else {
            return null;
        }
    }

    static async getMyTasks(getIncompleteTasksOnly: boolean) {
        const userTasks = await this.graphClient.api("/me/planner/tasks").select(["title", "startDateTime", "dueDateTime", "percentComplete"]).get();
        if (userTasks) {
            if (getIncompleteTasksOnly) {
                return userTasks.value.filter((task: any) => task.percentComplete !== 100);
            }
            return userTasks;
        } else {
            return null;
        }
    }
}