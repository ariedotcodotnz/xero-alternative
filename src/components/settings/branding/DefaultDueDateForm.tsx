import React, { useEffect, useState } from "react";
import Input from "@hui/_atoms/input/Input";
import Alert from "@hui/_molecules/alert/Alert";
import I18n from "../../../utilities/translations";

interface iDefaultDueDateForm {
  defaultDueDateDays: string;
  hasOutstandingOrScheduledInvoices: boolean;
}

const ctx = { scope: "users.form" };

const DefaultDueDateForm = ({defaultDueDateDays, hasOutstandingOrScheduledInvoices}:iDefaultDueDateForm) => {
  const [initialDueDateDay, setInitialDueDateDay] = useState(String(defaultDueDateDays));
  const [days, setDays] = useState<string>(initialDueDateDay || "");
  const [showWarning, setShowWarning] = useState<boolean>(false)

  const handleDaysChange = (value: string) => {
    setDays(value);
    
    if(hasOutstandingOrScheduledInvoices) {
      setShowWarning(value !== initialDueDateDay);
    }
  }

  useEffect(() => {
    const handleFormUpdate = (event: Event) => {
      const updateEvent = event as CustomEvent;
      
      if (updateEvent.detail && updateEvent.detail.newValue !== undefined) {
        // reset the initial value to the previously saved value and remove warning
        setInitialDueDateDay(String(updateEvent.detail.newValue));
        setShowWarning(false);
      }
    };

    document.addEventListener("defaultDueDateSaved", handleFormUpdate);

    return () => {
      document.removeEventListener("defaultDueDateSaved", handleFormUpdate);
    };
  }, []); 

  return (
    <>
      <div className="tw-mb-4">
        <Input 
          type="number"
          inputMode="numeric"
          name="user[default_due_date]"
          id="user_default_due_date"
          label={I18n.t("users.form.default_due_date")}
          value={days}
          setValue={handleDaysChange}
          min="0"
          max="365"
          className="hnry-input no-bs"
        />
      </div>
      {showWarning && (
        <Alert variant="info">
          <p className="tw-mb-0" 
            dangerouslySetInnerHTML={{ __html: I18n.t("default_due_date_change_alert_html", ctx) }}
          />
        </Alert>
      )}
    </>
  )
}

export default DefaultDueDateForm;