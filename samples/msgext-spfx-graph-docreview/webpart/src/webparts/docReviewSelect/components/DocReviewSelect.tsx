import * as React from 'react';
import { useState, useEffect } from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, IDetailsRowProps, IDetailsRowStyles, DetailsRow } from 'office-ui-fabric-react/lib/DetailsList';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import styles from './DocReviewSelect.module.scss';
import { IDocReviewSelectProps } from './IDocReviewSelectProps';
import { IDocument } from '../../../model/IDocument';
import GraphService from '../../../services/graphService';

const DocReviewSelect: React.FunctionComponent<IDocReviewSelectProps> = (props) => {
  const [documents, setDocuments] = useState([] as IDocument[]);
  const columns = [
    { key: 'columnPre', name: '', fieldName: 'urgent', minWidth: 12, maxWidth: 12, isResizable: false },
    { key: 'column1', name: 'Name', fieldName: 'name', minWidth: 60, maxWidth: 120, isResizable: true },
    { key: 'column2', name: 'Description', fieldName: 'description', minWidth: 150, maxWidth: 150, isResizable: true },
    { key: 'column3', name: 'Created by', fieldName: 'author', minWidth: 60, maxWidth: 120, isResizable: true },
    { key: 'column4', name: 'Next Review', fieldName: 'nextReview', minWidth: 50, maxWidth: 100, isResizable: true },
    { key: 'column5', name: 'Url', fieldName: 'url', minWidth: 100, maxWidth: 200, isResizable: true }
  ];

  const getDocsForReview = async () => {
    const graphService: GraphService = new GraphService();
    graphService.initialize(props.serviceScope, props.siteUrl)
      .then(() => {
        return graphService.getDocumentsForReview()
        .then((docs) => {
          setDocuments(docs);
        });     
      });
  };

  useEffect(() => {
    if (documents && documents.length < 1) {
      getDocsForReview();        
    }
  });

  const renderItemColumn = (item: IDocument, index: number, column: IColumn) => {
    const fieldContent = item[column.fieldName as keyof IDocument] as string;
    switch (column.key) {
      case 'columnPre':
        if (item.urgent) {
          return <span><Icon iconName="Important" /></span>;
        }
        else {
          return <span></span>;
        }
      case 'column4':
        return <span>{item.nextReview.toLocaleDateString()}</span>;
      default:
        return <span>{fieldContent}</span>;
    }
  };

  const renderRow = (props: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      const doc: IDocument = props.item;
      if (doc.urgent) {
        // 'Urgent' documents display in bold
        customStyles.root = { fontWeight: "bold" };
      }
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const docSelected = (item: any): void => {    
    if (props.isTeamsMessagingExtension) {
      props.teamsContext.teamsJs.tasks.submitTask(item);
    }
  };

  return (
    <div className={ styles.docReviewSelect }>
      <div className={ styles.container }>
        <div className={ styles.row }>
        <DetailsList compact={true}
            items={documents}
            columns={columns}
            onRenderItemColumn={renderItemColumn}
            onRenderRow={renderRow}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            onItemInvoked={docSelected} />
        </div>
      </div>
    </div>
  );
  
};

export default DocReviewSelect;
