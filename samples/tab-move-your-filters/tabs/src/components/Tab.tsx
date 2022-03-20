import { useState } from "react";
import { Button } from "@fluentui/react-northstar";
import { useGraph } from "./lib/useGraph";
import { Filter } from "./lib/types";
import ErrorMessage from "./controls/ErrorMessage";
import FilterUpload from "./controls/FilterUpload";
import GmailFetch from "./controls/GmailFetch";
import MappingList from "./controls/MappingList";
import "./Tab.css";

export default function Tab() {
  const [filters, setFilters] = useState(Array<Filter>());
  const [importing, setImporting] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [imported, setImported] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { loading: authenticating, error: authError, data: graph } = useGraph(
    async (graph) => graph,
    { scope: ["MailboxSettings.Read", "Mail.ReadWrite", "MailboxSettings.ReadWrite"] }
  );

  async function moveFilters() {
    if (importing || imported || graph === undefined || filters.length === 0) return;

    setImporting(true);

    try {
      const archiveFolder = await graph.api("/me/mailFolders/archive").get();
      const existingRules = await graph.api("/me/mailFolders/inbox/messageRules").get();

      const sequences = existingRules.value.map((r: any) => r.sequence);
      let nextSequence = Math.max(...sequences) + 1;

      let total = 0;

      for (const filter of filters.filter(f => !f.disabled)) {
        const rule = {
          "displayName": "Migrated rule from Gmail",
          "sequence": nextSequence++,
          "isEnabled": true,
          "conditions": {} as any,
          "actions": {} as any
        };

        if (filter.from) {
          rule.conditions.senderContains = [filter.from];
        }
        if (filter.to) {
          rule.conditions.recipientContains = [filter.to];
        }
        if (filter.subject) {
          rule.conditions.subjectContains = [filter.subject];
        }
        if (filter.hasTheWord) {
          rule.conditions.bodyOrSubjectContains = [filter.to];
        }
        if (filter.hasAttachment === "true") {
          rule.conditions.hasAttachments = true;
        }

        if (filter.shouldArchive === "true") {
          rule.actions.moveToFolder = archiveFolder.id;
        }
        if (filter.label) {
          //TODO: Nested folders
          const folderPresent = await graph.api(`/me/mailFolders?$filter=displayName eq '${filter.label}'`).get();
          if (folderPresent.value.length > 0) {
            rule.actions.moveToFolder = folderPresent.value[0].id;
          } else {
            const data = {
              "displayName": filter.label,
              "isHidden": false
            };
            const newFolderResponse = await graph.api("/me/mailFolders").post(data);
            rule.actions.moveToFolder = newFolderResponse.id;
          }
        }
        if (filter.shouldMarkAsRead === "true") {
          rule.actions.markAsRead = true;
        }
        if (filter.shouldTrash === "true") {
          rule.actions.delete = true;
        }
        if (filter.shouldAlwaysMarkAsImportant === "true") {
          rule.actions.markImportance = "high";
        }
        if (filter.forwardTo) {
          rule.actions.forwardTo = [{ "emailAddress": { "address": filter.forwardTo } }];
        }

        await graph.api("/me/mailFolders/inbox/messageRules").post(JSON.stringify(rule));
        total++;
      }
      setImported(true);
      setProcessed(total);
    } catch (err: any) {
      let msg = JSON.stringify(err, null, 2);
      try {
        msg = err.body && JSON.parse(err.body).message;
      } catch { }
      setErrorMessage(msg);
    }

    setImporting(false);
  }

  const active = authenticating || importing;

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        {!imported ? filters.length === 0 ? (
          <>
            <h2>Load your filters directly from Gmail</h2>
            <GmailFetch onFiltersLoaded={setFilters} />

            <h2>Or upload a Gmail filter export (XML)</h2>
            <FilterUpload onFiltersUploaded={setFilters} />
          </>
        ) : (
          <>
            <h2>Filters to move</h2>
            <MappingList filters={filters} onFiltersChanged={setFilters} />
            <Button content="Move them!" primary disabled={active} loading={active} onClick={moveFilters} />
            {authError && <ErrorMessage message={JSON.stringify(authError)} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}
          </>
        ) : (
          <>
            <h2>Migration complete!</h2>
            <p>
              {processed} filters were successfully imported into Outlook.
              <a href="https://outlook.office.com/mail/options/mail/rules" target="_blank">Take a look &raquo;</a>
              </p>
          </>
        )}
      </div>
    </div >
  );
}
