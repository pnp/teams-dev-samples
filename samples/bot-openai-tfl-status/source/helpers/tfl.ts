import axios from 'axios';
import { ILine, ILineStatus } from '../interfaces';

const callTfL = async (endpoint: string) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;

    } catch (error) {
        console.error('Error:', error);
    }
}

// function to extract relevant information from TfL API response
const extractRelevantInformation = (tflAPIResponse: ILine[]) => {
    let relevantInformation: ILine[] = [];
    tflAPIResponse.forEach((line: ILine) => {
        let relevantLine: ILine = {
            id: line.id,
            name: line.name,
            modeName: line.modeName,
            created: line.created,
            modified: line.modified,
            lineStatuses: line.lineStatuses && line.lineStatuses.map((lineStatus) => {
                return {
                    lineId: lineStatus.lineId,
                    statusSeverity: lineStatus.statusSeverity,
                    statusSeverityDescription: lineStatus.statusSeverityDescription,
                    reason: lineStatus.reason,
                    created: lineStatus.created,
                    disruption: {
                        category: lineStatus.disruption && lineStatus.disruption.category,
                        categoryDescription: lineStatus.disruption && lineStatus.disruption.categoryDescription,
                        description: lineStatus.disruption && lineStatus.disruption.description,
                        closureText: lineStatus.disruption && lineStatus.disruption.closureText
                    }
                }
            })
        };
        relevantInformation.push(relevantLine);
    });
    return relevantInformation[0];
}

const getLineStatus = async (lineId: string): Promise<ILine> => {
    const lineStatus = await callTfL(`https://api.tfl.gov.uk/Line/${lineId}/Status`) as ILine[];
    return extractRelevantInformation(lineStatus);
};

const getLineColour = (lineId: string): string => {
    switch (lineId) {
        case 'bakerloo':
            return '%23996633';
        case 'central':
            return '%23CC3333';
        case 'circle':
            return '%23FFCC00';
        case 'district':
            return '%23006633';
        case 'dlr':
            return '%23009999';
        case 'hammersmith-city':
            return '%23CC9999';
        case 'jubilee':
            return '%23868F98';
        case 'london-overground':
            return '%23FF6600';
        case 'metropolitan':
            return '%23660066';
        case 'northern':
            return '%23000000';
        case 'piccadilly':
            return '%23000099';
        case 'tfl-rail':
            return '%230019A8';
        case 'tram':
            return '%2366cc00';
        case 'elizabeth':
            return '%235e4890';
        case 'victoria':
            return '%230099CC';
        case 'waterloo-city':
            return '%2366CCCC';
        default:
            return '%23000000';
    }
}

const displayLineStatus = (
    lineId: string,
    line: string,
    lineColour: string,
    status: string,
    statusColour: string,
    details: string
): ILineStatus => {
    return {
        line,
        lineColour: lineColour ? lineColour?.replace('#', '%23') : getLineColour(lineId),
        status,
        statusColour,
        details
    }
}

export { getLineStatus, displayLineStatus };