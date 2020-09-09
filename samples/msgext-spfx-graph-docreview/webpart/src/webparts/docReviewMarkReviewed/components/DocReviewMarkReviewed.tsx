import * as React from 'react';
import { useState } from 'react';
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import styles from './DocReviewMarkReviewed.module.scss';
import GraphService from "../../../services/graphService";
import { IDocReviewMarkReviewedProps } from './IDocReviewMarkReviewedProps';

const DocReviewMarkReviewed:React.FunctionComponent<IDocReviewMarkReviewedProps> = (props) => {
  const [nextReview, setNextReview] = useState(new Date() as Date);

  const setReviewDate = (date: Date) => {
    setNextReview(date);
  };

  const execReview = async () => {
    if (!props.isTeamsMessagingExtension) {
      return;
    }    
    const fieldValueSet = {
      LastReviewed: new Date().toISOString(),
      NextReview: nextReview.toISOString()
    };
    const graphService: GraphService = new GraphService();
    graphService.initialize(props.serviceScope, props.siteUrl)
      .then(() => {
        graphService.setDocumentReviewed(props.itemID, fieldValueSet)
          .then((responseDoc) => {
            console.log(responseDoc);
            props.teamsContext.teamsJs.tasks.submitTask();
          });
      });    
  };

  return (
    <div className={ styles.docReviewMarkReviewed }>
      <div className={ styles.container }>
        <div className={ styles.row }>
          <div className={ styles.column }>
              <DatePicker
                className={styles.dateControl}
                firstDayOfWeek={DayOfWeek.Monday}
                label="Next Review"
                placeholder="Select a date for next review..."
                ariaLabel="Select a date"
                showWeekNumbers={true}
                onSelectDate={setReviewDate}
                value={nextReview}
              />
            </div>
            <div className={ styles.column }>
              <DefaultButton text="Reviewed"
                              onClick={execReview} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocReviewMarkReviewed;
