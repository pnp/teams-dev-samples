import * as React from "react";
import { MgtTemplateProps } from "mgt-react";
import {
    DocumentCard,
    DocumentCardActivity,  
    DocumentCardPreview,  
    DocumentCardTitle,    
    DocumentCardType,    
    IDocumentCardPreviewProps,
    ImageFit    
  } from 'office-ui-fabric-react';

import styles from './File.module.scss';
import * as strings from 'PlanningWebPartStrings';
import { BrandIcons } from "./BrandIcons";
     /**
   * Returns the relative date for the document activity Starter Kit code from RecentlyUseed Document component
   */
  const _relativeDate=(crntDate: string): string=> {
    const date = new Date((crntDate || "").replace(/-/g,"/").replace(/[TZ]/g," "));
    const diff = (((new Date()).getTime() - date.getTime()) / 1000);
    const day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0) {
      return;
    }

    return day_diff === 0 && (
           diff < 60 && strings.DateJustNow ||
           diff < 120 && strings.DateMinute ||
           diff < 3600 && `${Math.floor( diff / 60 )} ${strings.DateMinutesAgo}` ||
           diff < 7200 && strings.DateHour ||
           diff < 86400 && `${Math.floor( diff / 3600 )} ${strings.DateHoursAgo}`) ||
           day_diff == 1 && strings.DateDay ||
           day_diff <= 30 && `${day_diff} ${strings.DateDaysAgo}` ||
           day_diff > 30 && `${Math.ceil(day_diff / 7)} ${strings.DateWeeksAgo}`;
  };


  export interface IFileMgtTemplateProps extends MgtTemplateProps {
   userLoginName:string;
   userDisplayName:string;
  }

const Files = (props: IFileMgtTemplateProps) => {
    const { value } = props.dataContext;  
    return (<div><ul>
      {value.map(f => {
       
          const previewProps: IDocumentCardPreviewProps = {
            previewImages: [
              {
                name: f.resourceVisualization.title,
                url: f.resourceReference.webUrl,
                previewImageSrc: f.resourceVisualization.previewImageUrl,
                iconSrc: BrandIcons[f.resourceVisualization.type],
                imageFit: ImageFit.cover,
                width: 150,
                height: 110}
            ],
          };
        return (<div className={styles.recentlyUsedDocuments}>
              
            <div className={styles.document}>
              <DocumentCard onClickHref={f.resourceReference.webUrl} type={DocumentCardType.compact}>
                    <div className={styles.documentPreview}>
                        <DocumentCardPreview  {...previewProps} />
                    </div>
                    <div className={styles.documentDetails}>
                        <DocumentCardTitle title={f.resourceVisualization.title}
                            shouldTruncate={true} />
                            {f.lastUsed&&
                            <DocumentCardActivity activity={`Last accessed ${_relativeDate(f.lastUsed.lastAccessedDateTime)}`}
                            people={[{
                                name: props.userDisplayName,
                                profileImageSrc: `/_layouts/15/userphoto.aspx?size=S&username=${props.userLoginName}`
                            }]} />
                            }
                        
                    </div>
                </DocumentCard>
            </div> </div>);
      })
      }
    </ul>
    </div>);
  };
export default Files;




  