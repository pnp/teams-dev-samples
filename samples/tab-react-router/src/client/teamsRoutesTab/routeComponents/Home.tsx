import * as React from "react";
import { Input,Button, Table } from '@fluentui/react-northstar';
import { createHashHistory } from 'history';
import { useState } from "react";

export const Home = () => {

    const [inputParam, setinputParam] = useState<string | undefined>();
const header = {
    items: ['id', 'Name', 'Picture', 'Age'],
  }
  const rows = [
    {
      key: 1,
      items: ['1', 'Roman van von der Longername', 'None', '30 years'],
    },
    {
      key: 2,
      items: ['2', 'Alex', 'None', '1 year'],
    },
    {
      key: 3,
      items: ['3', 'Ali', 'None', '30000000000000 years'],
    },
  ]
    const history = createHashHistory();
    return (
        <div>
            <div>This is Home Page</div>
            <Input onChange={(e,data) => setinputParam(data?.value)}  placeholder="Enter anything to pass to another page..." />
            <br/>
            <Button onClick={() =>   window.location.hash = "/PageWithURLParameter/" + inputParam}>Go to page with parameter</Button>

              <Table header={header} rows={rows} aria-label="Static table" />
        </div>
    )
}