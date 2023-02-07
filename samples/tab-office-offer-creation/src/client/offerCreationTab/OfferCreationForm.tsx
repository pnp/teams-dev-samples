import * as React from "react";
import { Text, Button, Input, Datepicker, Dropdown, TextArea } from "@fluentui/react-northstar";
import { useState, useCallback } from "react";
import { IOfferCreationFormProps } from "./IOfferCreationFormProps";
import { IOffer } from "../../model/IOffer";

export const OfferCreationForm = (props: IOfferCreationFormProps) => {
  const [title, setTitle] = useState<string>();
  const [date, setDate] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [vat, setVAT] = useState<number>();
  const [description, setTDescription] = useState<string>();
  
  const vatItems = [
    {
      header: "19%",
      content: "full",
      key: "19"
    },
    {
      header: "7%",
      content: "reduced",
      key: "7"
    }
  ];

  const onOfferingDateChange = useCallback((e, data) => {
    var date = new Date(data.value);
    if (true)  {
      setDate(date.toISOString());
    }
  }, []);

  const onOfferingVATChange = useCallback((e, data) => {
    switch (data.value.key) {
      case "19":
        setVAT(0.19);
        break;
      case "7":
        setVAT(0.07);
        break;
    }
  }, []);

  const storeData = useCallback(() => {
    const newOffer: IOffer = {
      title: title ? title : '',
      description: description ? description : '',
      date: date ? date : '',
      price: price ? price : 0,
      vat: vat ? vat : 0
    };
    props.createOffer(newOffer);
  }, [title, description, date, price,vat]);

  return (
    <div className="form">
      <div>
        <Input label="Title" 
                value={title}
                type="text"
                fluid
                onChange={(e, data) => {
                  if (data) {
                      setTitle(data.value);
                  }
                }} />          
      </div>
      <div>
        <Text content="Offer Date" />
        <Datepicker onDateChange={onOfferingDateChange} />
      </div>
      <div>        
        <Input label="Price" 
                value={price}
                type="number"
                step=".01"
                onChange={(e, data) => {
                  if (data) {
                    const numPrice = parseFloat(data.value);
                    if (!isNaN(numPrice)) {
                      setPrice(numPrice);
                    }                    
                  }
                }} />          
      </div>
      <div>
        <Text content="VAT" />
        <Dropdown
          items={vatItems}
          placeholder="Select VAT"
          fluid
          onChange={onOfferingVATChange}
        />
      </div>
      <div>
        <Text content="Description" />
        <TextArea fluid 
                  resize="vertical"
                  value={description}
                  onChange={(e, data) => {
                    if (data) {
                        setTDescription(data.value);
                    }
                  }} />
      </div>
      <div className="formButton">
        <Button primary onClick={storeData}>Create Offer</Button>
      </div>
    </div>
  );
}