export interface Question {
    question: string;
    options: string[];
    optionSet: OptionSet[];
    answer: string;
    referenceLink: string;
    currentIndex:number;
    totalQuestionsCount:number;
    selectedTopic:any;
}

export interface OptionSet {
    title: string;
    value: string;
}