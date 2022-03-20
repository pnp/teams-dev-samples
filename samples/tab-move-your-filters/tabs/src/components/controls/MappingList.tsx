import { Checkbox, Divider, Header, List, Segment, Status, Text } from "@fluentui/react-northstar";
import { Fragment } from "react";
import { Filter } from "../lib/types";

interface MappingListProps {
  filters: Filter[];
  onFiltersChanged(filters: Filter[]): void;
}

export default function MappingList(props: MappingListProps) {
  function changeDisabled(f: Filter) {
    f.disabled = !f.disabled;
    props.onFiltersChanged(Array.from(props.filters));
  }

  function formatAsGmail(filter: Filter) {
    const size = filter.size &&
      (filter.sizeOperator === "s_ss" ? "<" : ">") + " " + filter.size + ((filter.sizeUnit === "s_sb") ? " bytes" : (filter.sizeUnit === "s_skb") ? "K" : "M");

    const criteria: any = {
      "From": filter.from,
      "To": filter.to,
      "Subject": filter.subject,
      "Includes the words": filter.hasTheWord,
      "Doesn't have": filter.doesNotHaveTheWord,
      "Size": size,
    };
    if (filter.hasAttachment) criteria["Has attachment"] = "";
    const criteriaList = Object.entries(criteria).filter(e => e[1] !== undefined).map((e, n) => ({
      key: n,
      media: <Status state="info" />,
      header: <Text>{e[0]} <strong>{e[1] as string}</strong></Text>,
      style: { "minHeight": "0rem", "paddingTop": "0.1em", "paddingBottom": "0.1em" }
    }));

    const actions = {
      "Skip the Inbox (Archive it)": filter.shouldArchive,
      "Mark as read": filter.shouldMarkAsRead,
      "Star it": filter.shouldStar,
      "Apply the label": filter.label,
      "Forward it to": filter.forwardTo,
      "Delete it": filter.shouldTrash,
      "Never send it to spam": filter.shouldNeverSpam,
      "Always mark it as important": filter.shouldAlwaysMarkAsImportant,
      "Never mark it as important": filter.shouldNeverMarkAsImportant,
      "Categorise as": filter.smartLabelToApply,
    };
    const actionList = Object.entries(actions).filter(e => e[1] !== undefined && e[1] !== "false").map((e, n) => ({
      key: n,
      media: <Status state="success" />,
      header: <Text>{e[0]} {e[1] === "true" ? "" : <strong>{e[1]}</strong>}</Text>,
      style: { "minHeight": "0rem", "paddingTop": "0.1em", "paddingBottom": "0.1em" }
    }));

    return (
      <>
        <List items={criteriaList} />
        <Divider size={-1} />
        <List items={actionList} />
      </>
    );
  }

  function formatAsOutlook(filter: Filter) {
    const size = filter.size &&
      (filter.sizeOperator === "s_ss" ? "<" : ">") + " " + filter.size + ((filter.sizeUnit === "s_sb") ? " bytes" : (filter.sizeUnit === "s_skb") ? "K" : "M");

    const criteria: any = {
      "Sender address includes": filter.from,
      "Recipient address includes": filter.to,
      "Subject includes": filter.subject,
      "Subject or body includes": filter.hasTheWord,
      "Message size": size,
    };
    if (filter.hasAttachment) criteria["Has attachment"] = "";
    const criteriaList = Object.entries(criteria).filter(e => e[1] !== undefined).map((e, n) => ({
      key: n,
      media: <Status state="info" />,
      header: <Text>{e[0]} <strong>{e[1] as string}</strong></Text>,
      style: { "minHeight": "0rem", "paddingTop": "0.1em", "paddingBottom": "0.1em" }
    }));

    const actions = {
      "Archive": filter.shouldArchive,
      "Mark as read": filter.shouldMarkAsRead,
      "Flag": filter.shouldStar,
      "Move to": filter.label,
      "Forward to": filter.forwardTo,
      "Delete": filter.shouldTrash,
      "Mark as high importance": filter.shouldAlwaysMarkAsImportant,
    };
    const actionList = Object.entries(actions).filter(e => e[1] !== undefined && e[1] !== "false").map((e, n) => ({
      key: n,
      media: <Status state="success" />,
      header: <Text>{e[0]} {e[1] === "true" ? "" : <strong>{e[1]}</strong>}</Text>,
      style: { "minHeight": "0rem", "paddingTop": "0.1em", "paddingBottom": "0.1em" }
    }));

    return (
      <>
        <List items={criteriaList} />
        <Divider size={-1} />
        <List items={actionList} />
      </>
    );
  }

  return (
    <>
      {props.filters.map((f, n) =>
        <Fragment key={n}>
          <Segment color="black" disabled={f.disabled}>
            <div style={{ "textAlign": "right" }}>
              <Checkbox toggle checked={!f.disabled} onChange={() => changeDisabled(f)} />
            </div>
            <div style={{ "display": "flex", "flexWrap": "wrap" }}>
              <div style={{ "minWidth": "50%" }}>
                <Header as="h3" content="Gmail" />
                {formatAsGmail(f)}
              </div>
              <div style={{ "minWidth": "50%" }}>
                <Header as="h3" content="To Outlook" />
                {formatAsOutlook(f)}
              </div>
            </div>
          </Segment>
          <Divider />
        </Fragment>
      )}
    </>
  );
}