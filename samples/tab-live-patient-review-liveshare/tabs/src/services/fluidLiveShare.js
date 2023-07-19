import { LiveShareClient, LivePresence } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { SharedMap } from "fluid-framework";
import { LiveCanvas } from "@microsoft/live-share-canvas";
import { unionBy } from "lodash";

// interface IFluidService {
//     connect: () => void;                             // Connect to the Fluid service
//     addPerson: (name: string) => Promise<void>;      // Add a person to the list
//     removePerson: (name: string) => Promise<void>;   // Remove a person from the list
//     nextPerson: () => Promise<void>;                 // Go to next person
//     shuffle: () => Promise<void>;                    // Shuffle the list of speakers
//     getPersonList: () => Promise<string[]>;          // Get the current person list
//     // Event handler called when new person list is available
//     onNewData: (handler: (personList: string[]) => void) => void;
// }

class FluidService {

  // Constants
  #PERSON_VALUE_KEY = "person-value-key"; // Key for use in shared map
  #IMAGE_VALUE_KEY = "image-value-key"; // Key for use in shared map

  // Service state
  #container;                     // Fluid container
  #peopleMap = { currentImage: '', people: [] };                   // Local array of people who will speak
  //#liveImage = [];                // Local image to display
  //#registeredImageEventHandlers = [];  // Array of event handlers to call when contents change
  #registeredEventHandlers = [];  // Array of event handlers to call when contents change
  #connectPromise;                // Singleton promise so we only connect once

  // Public function returns a singleton promise that resolves when we're
  // connected to the Fluid Relay service
  connect = () => {
    if (!this.#connectPromise) {
      this.#connectPromise = this.#connect();
    }

    return this.#connectPromise
  }

  // Private function connects to the Fluid Relay service
  #connect = async () => {
    try {
      const liveShareHost = LiveShareHost.create();

      const liveShareClient = new LiveShareClient(liveShareHost);
      const { container } = await liveShareClient.joinContainer(
        // Container schema
        {
          initialObjects: { personMap: SharedMap, presence: LivePresence, liveCanvas: LiveCanvas }
        });
      this.#container = container;
      // let initialList = require("../models/DiscussionList.json");

      const json = this.#container.initialObjects.personMap.get(this.#PERSON_VALUE_KEY) || `{"currentImage": "", "people": []}`;
      this.#peopleMap = JSON.parse(json);
      console.log(this.#peopleMap);

      // const jsonImage = this.#container.initialObjects.personMap.get(this.#IMAGE_VALUE_KEY) || "[]";
      // this.#liveImage = JSON.parse(jsonImage);

      // Register a function to update the app when data in the Fluid Relay changes
      this.#container.initialObjects.personMap.on("valueChanged", async () => {
        const json = this.#container.initialObjects.personMap.get(this.#PERSON_VALUE_KEY);
        this.#peopleMap = JSON.parse(json);
        for (let handler of this.#registeredEventHandlers) {
          await handler(this.#peopleMap);
        }
      });

      // this.#container.initialObjects.liveImage.on("valueChanged", async () => {
      //   const image = this.#container.initialObjects.liveImage.get(this.#IMAGE_VALUE_KEY);
      //   this.#liveImage = JSON.parse(image);
      //   for (let handler of this.#registeredImageEventHandlers) {
      //     await handler(this.#liveImage);
      //   }
      // });

    }
    catch (error) {
      console.log(`Error in fluid service: ${error.message}`);
      throw (error);
    }
  }

  // Private function to update the Fluid relay from the local array of people
  #updateFluid = async () => {
    const json = JSON.stringify(this.#peopleMap);
    this.#container.initialObjects.personMap.set(this.#PERSON_VALUE_KEY, json);
  }

  // #updateFluidImage = async () => {
  //   const json = JSON.stringify(this.#liveImage);
  //   this.#container.initialObjects.liveImage.set(this.#IMAGE_VALUE_KEY, json);
  // }

  // reorderPeople = async (people) => {
  //   this.#peopleMap.people = people;
  //   await this.#updateFluid();
  // }

  reorderPeople = async (people, oldPos, newPos) => {
    people.splice(newPos, 0, people.splice(oldPos, 1)[0]);
    this.#peopleMap.people = people;
    console.log(this.#peopleMap);
    await this.#updateFluid();
  }


  // Public functions used by the UI
  addPerson = async (name) => {
    if (!name) {
      throw new Error(`Please enter a name to add to the list`);
    }
    if (!this.#peopleMap.people) {
      this.#peopleMap.people = [];
    }
    let patient = this.#peopleMap.people.filter(item => item.name === name);
    if (patient && patient.length > 0) {
      throw new Error(`${name} is already on the list`);
    }
    this.#peopleMap.people.push({ name: name, feedback: [], image: [] });
    console.log(this.#peopleMap);
    await this.#updateFluid();
  }

  removePerson = async (name) => {
    //if (this.#people.includes(name)) {
    this.#peopleMap.people = this.#peopleMap.people.filter(item => item.name !== name);
    //}
    await this.#updateFluid();
  }

  nextPerson = async () => {
    const firstPerson = this.#peopleMap.people[0];
    this.#peopleMap.people.shift();
    this.#peopleMap.people.push(firstPerson);
    await this.#updateFluid();
  }

  addFeedback = async (name, feedback, specialist) => {
    let patient = this.#peopleMap.people.filter(item => item.name === name);
    if (patient && patient.length > 0) {
      //always get the first patient
      patient[0].feedback.push({
        name: specialist,
        text: feedback,
        date: new Date().toLocaleString()
      });

      this.#peopleMap.people = unionBy(this.#peopleMap.people, patient, "name");
      console.log(this.#peopleMap);
      await this.#updateFluid();

    }
    else {
      throw new Error(`${name} not found, feedback could not be saved`);
    }
  }

  addImage = async (image) => {
    this.#peopleMap.currentImage = image;

    await this.#updateFluid();
  }

  saveImage = async (name, image, specialist) => {
    console.log(this.#peopleMap);
    let patient = this.#peopleMap.people.filter(item => item.name === name);
    console.log(patient);
    if (patient && patient.length > 0) {
      //always get the first patient
      patient[0].image.push({
        name: specialist,
        img: image,
        date: new Date().toLocaleString()
      });

      this.#peopleMap.people = unionBy(this.#peopleMap.people, patient, "name");
      //this.#peopleMap = unionBy(this.#peopleMap, patient, "name");
      this.#peopleMap.currentImage = '';
      console.log(this.#peopleMap);
      await this.#updateFluid();

    }
    else {
      throw new Error(`${name} not found, image could not be saved`);
    }
  }



  shuffle = async () => {
    // Use the Fischer-Yates algorithm
    for (let i = this.#peopleMap.people.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      [this.#peopleMap.people[i], this.#peopleMap.people[j]] = [this.#peopleMap.people[j], this.#peopleMap.people[i]];
    }
    await this.#updateFluid();
  }

  getPersonList = async () => {
    console.log(this.#peopleMap);
    return this.#peopleMap;
  }

  getCanvas = async () => {
    return this.#container.initialObjects.liveCanvas;
  }

  getLiveImage = async (name) => {
    // let patient = this.#peopleMap.filter(item => item.name === name);
    // if (patient && patient.length > 0) {
    //   if (patient[0].image && patient[0].image.length > 0) {
    //     return patient[0].image[0].img;
    //   }
    // }

    // return null;
    return this.#peopleMap.currentImage;
  }

  // setLiveImage = async (image) => {
  //   this.#liveImage = [{ img: image }];
  //   await this.#updateFluidImage();
  // }

  getPresence = async () => {
    return this.#container.initialObjects.presence;
  }

  onNewData = (e) => {
    this.#registeredEventHandlers.push(e);
  }

  // onNewImageData = (e) => {
  //   this.#registeredImageEventHandlers.push(e);
  // }

}

export default new FluidService();