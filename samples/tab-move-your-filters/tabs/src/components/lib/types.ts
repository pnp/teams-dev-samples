export interface Filter {
    disabled?: boolean;
  
    doesNotHaveTheWord?: string;
    excludeChats?: string;
    from?: string;
    hasAttachment?: string;
    hasTheWord?: string;
    size?: string;
    sizeOperator?: string;
    sizeUnit?: string;
    subject?: string;
    to?: string;
  
    forwardTo?: string;
    label?: string;
    shouldAlwaysMarkAsImportant?: string;
    shouldArchive?: string;
    shouldMarkAsRead?: string;
    shouldNeverMarkAsImportant?: string;
    shouldNeverSpam?: string;
    shouldStar?: string;
    shouldTrash?: string;
    smartLabelToApply?: string;
  }
