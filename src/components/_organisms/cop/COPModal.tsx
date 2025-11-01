import React, { useEffect, useState } from "react";
// import toastr from "";
import { createPayee, iCreatePayeeResponseBodyType, iCreatePayee, iScaChallengeSubmit, postScaChallenge, putScaChallenge, iPayeeSuggestion, RecordName, typedSCASuggestion, RecordDataType } from "../../../API/cop.api";
import Modal from "../../_molecules/modal/Modal";
import I18n from "../../../utilities/translations";
import Icon from "../../_atoms/icons/icon/Icon";
import SCAConfirm from "../sca_confirm/SCAConfirm";
import COPWarningModal from "./COPWarningModal";
import Loader from '../../inputs/_elements/loader'
import COPErrorModal from "./COPErrorModal";
import { COPSuggestion } from "./COPSuggestion";
import Button from "../../_atoms/button/Button";

type fieldType = {
  label: string,
  value: string
}

interface iCOPModal {
  fields: fieldType[];
  recordAttributes: unknown;
  actionName: string;
  submissionPath?: string;
  submissionMethod?: string;
  userId: number;
  callBackUrl?: string;
  recordName: RecordName;
  payeeName: string;
  sortCode: string;
  accountNumber: string;
  accountType: string;
}

const COPModal = ({ 
  recordAttributes,
  actionName,
  userId,
  callBackUrl,
  submissionMethod,
  submissionPath,
  recordName,
  payeeName,
  sortCode,
  accountNumber,
  accountType }: iCOPModal) => {
  const [show, setShow] = useState(false);
  const [showSCA, setShowSCA] = useState(false);
  const [severity, setSeverity] = useState<"warning" | "error">()
  const [showEdenredError, setShowEdenredError] = useState(false);
  const [title, setTitle] = useState<string>()
  const [centerText, setCenterText] = useState<boolean>(false);
  const [subheading1, setSubheading1] = useState<string>()
  const [subheading2, setSubheading2] = useState<string>()
  const [closeMatchReasons, setCloseMatchReasons] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [suggestion, setSuggestion] = useState<iPayeeSuggestion>()
  const [deviceName, setDeviceName] = useState<string>();
  const [challengeId, setChallengeId] = useState<string>();
  const [createResponseBody, setCreateResponseBody] = useState<iCreatePayeeResponseBodyType>();

  const invalidAccountNumberCode = "AC01"
  const SRDRequiredCode = "IVCR"
  const CopNotSupportedCode = "ACNS"
  const sortCodeDoesNotExist = "SCNF"
  const accountSwitchingCode = "CASS"

  const showWarning = () => severity == 'warning'
  const showError = () => severity == 'error'

  const payeeNameWarnings = [
    "MBAM",
    "BAMM",
    "PAMM",
    "ANNM",
    CopNotSupportedCode,
    "OPTO",
    accountSwitchingCode
  ]

  const edenredErrors = [
    "CWS0365",
    "CWS0360",
    "CWS0361",
    "CWS0362",
    "CWS0363",
    "CWS0366",
    "CWS0359",
    "CWS0279",
    "CWS0050",
  ]

  const payeeExistsErrors = [
    "CWS0308",
  ]

  const errorTitle = I18n.t("cop.error.title.base");
  const setCloseMatchSubheadings = ({name, account_type }: { name?: boolean, account_type?: "business" | "personal" }) => {
    const reasons: string[] = []
   if(name) reasons.push(I18n.t("cop.close_name_warning"))
   if(account_type) { 
      const reason = account_type == "business" ? I18n.t("cop.close_account_business_type_warning") : I18n.t("cop.close_account_personal_type_warning")
      reasons.push(reason)
    }
    setCloseMatchReasons(reasons)
    setSubheading1(I18n.t("cop.warning.subheading.close_match_1"))
  };

  const callScaChallenge = async (useSuggestion: boolean = false) => {
    const suggestion = createResponseBody?.payee_suggestion

    const scaChallengeBody: iScaChallengeSubmit = {
      context: actionName,
      data: {
        payee: { confirmation_required: true },
        confirm_payee: {
          create_request_external_ref: createResponseBody?.payee_external_ref,
          payee_suggestion: {
            payee_name: suggestion?.payee_name,
            account_type: suggestion?.account_type,
          },
          accept_suggestion: useSuggestion,
          payee_details: {
            payee_name: payeeName,
            sort_code: sortCode,
            account_number: accountNumber,
            name_verification_details: {
              account_type: accountType
            }
          },
        },
        challenge: {
          callback_url: callBackUrl,
        }
      }
    }

    if(useSuggestion) {
      scaChallengeBody.data[recordName] = typedSCASuggestion(recordAttributes, recordName, suggestion)
    } else {
      scaChallengeBody.data[recordName] = recordAttributes as RecordDataType
    }

    try {
      const res = submissionMethod === "post" ? await postScaChallenge(submissionPath, scaChallengeBody) : await putScaChallenge(submissionPath, scaChallengeBody)
      setDeviceName(res.data?.device_registration.name);
      setChallengeId(res.data?.mobile_based_verification.external_challenge_identifier);
      setShow(false)
      setLoading(false)
      setShowSCA(true);
    }
    catch (error) {
      displayGeneralError()
    }

  }

  const handleInvalidAccountNumber = () => {
    setSeverity("error")
    setTitle(errorTitle)
    setCenterText(true)
    setSubheading1(I18n.t("cop.error.subheading.account_number_error_1"))
    setSubheading2(I18n.t("cop.error.subheading.account_number_error_2"))
  }

  const handleInvalidSortCode = () => {
    setSeverity("error")
    setTitle(errorTitle)
    setCenterText(true)
    setSubheading1(I18n.t("cop.error.subheading.sort_code_error_1"))
    setSubheading2(I18n.t("cop.error.subheading.sort_code_error_2"))
  }

  const handleSrd = () => {
    setSeverity("error")
    setTitle(errorTitle)
    setCenterText(true)
    setSubheading1(I18n.t("cop.error.subheading.srd_error_1"));
  }

  const handleAccountSwitching = () => {
    setSeverity("warning")
    setTitle(I18n.t('cop.warning.title.account_switching'))
    setSubheading1(I18n.t("cop.warning.subheading.switching_1"))
    setSubheading2(I18n.t("cop.warning.subheading.switching_2"))
  }

  const handleCloseMatch = (reasonCode: string) => {
    setSeverity("warning")
    setTitle(I18n.t("cop.warning.title.close_match"))
    const name = payeeNameWarnings.includes(reasonCode)
    let account_type
    if(["BAMM", "BANM"].includes(reasonCode)) account_type = "business"
    if(["PAMM", "PANM"].includes(reasonCode)) account_type = "personal"
    setCloseMatchSubheadings({name, account_type})
  }

  const handleNoMatch = () => {
    setSeverity("warning")
    setTitle(I18n.t("cop.warning.title.base"))
    setSubheading1(I18n.t("cop.warning.subheading.base_1"))
    setSubheading2(I18n.t("cop.warning.subheading.base_2"))
  }

  const populateModal = (response: iCreatePayeeResponseBodyType) => {
    const reasonCode = response.message?.name_verification_result.reason_code
    if (response.message?.name_verification_result.matched) {
      callScaChallenge()
    } else {
      if (reasonCode == invalidAccountNumberCode) { 
        handleInvalidAccountNumber()
      } else if (reasonCode == sortCodeDoesNotExist) { 
        handleInvalidSortCode()
      } else if (reasonCode == SRDRequiredCode) { 
        handleSrd()
      } else if(reasonCode == accountSwitchingCode) {
        handleAccountSwitching()
      } else if (response.payee_suggestion) {
        handleCloseMatch(reasonCode)
      } else {
        handleNoMatch()
      }
      setLoading(false)
      setShow(true);
    }
  }

  const displayGeneralError = () => {
    setSeverity("error")
    setShowEdenredError(true);
    setTitle(errorTitle)
    setCenterText(true)
    setSubheading1(I18n.t("cop.error.subheading.general_error_1"))
    setSubheading2(I18n.t("cop.error.subheading.general_error_2"))
    setLoading(false)
    setShow(true);
  }

  const createEdenredPayee = async () => {
    const payeeDetails: iCreatePayee = {
      user_id: userId,
      payee_name: payeeName,
      sort_code: sortCode,
      account_number: accountNumber,
      account_type: accountType,
      secondary_identification: null
    }

    try {
      const response: iCreatePayeeResponseBodyType = await createPayee(payeeDetails);
      setCreateResponseBody(response);
      setSuggestion(response.payee_suggestion)
    } catch (error) {
      displayGeneralError()
    }
  }

  useEffect(() => {
    setLoading(true)
    createEdenredPayee();
  }, []);

  useEffect(() => {
    if(createResponseBody) {
      try {
        const resultCode = createResponseBody.message?.metadata?.result_code;
        if(payeeExistsErrors.includes(resultCode)) {
          callScaChallenge()
        }
        if (edenredErrors.includes(resultCode)) {
          displayGeneralError()
        } else {
          populateModal(createResponseBody);
        }
      }
      catch (error) {
        displayGeneralError()
      }
    }
  }, [createResponseBody]);
  
  const handleContinueClick = async (useSuggestion: boolean = false ) => {
    callScaChallenge(useSuggestion);
  };

  const iconComponent = () => {
    if(showWarning()) return <span className="hui-sca__header-icon tw-bg-amber-100">
      <Icon type="ExclamationTriangleIcon" classes="!tw-text-amber-700 tw-w-6 tw-h-6" />
    </span>
    if(showError() || showEdenredError) return <span className="hui-sca__header-icon tw-bg-red-100">
      <Icon type="ExclamationCircleIcon" classes="!tw-text-red-700 tw-w-6 tw-h-6" />
    </span>
    if(!showError() && !showWarning()) return <></>
  };
    
  return (
    <>
         <Modal
        open={loading}
        setOpen={setLoading}
        title={I18n.t("cop.loading_title")}
        includesFooter={false}
        id="cop-loading"
        modalClasses="hui-sca"
      >
        <div className="tw-flex tw-justify-center tw-my-4">
          <Loader />
        </div>
    </Modal>
      <Modal
        open={show}
        setOpen={setShow}
        title={title}
        includesFooter={false}
        extraHeaderContent={iconComponent()}
        id="cop-modal"
        modalClasses={'hui-sca'}
      >
        {
           (showError() || showEdenredError) && <COPErrorModal subheading={subheading1} centerText={centerText} subheading2={subheading2} />
        }
        { 
          showWarning() && <COPWarningModal subheading={subheading1} reasons={closeMatchReasons} subheading2={subheading2} />
        }
        { !showError() && suggestion && <COPSuggestion name={suggestion.payee_name} accountType={suggestion.account_type} accountNumber={accountNumber} sortCode={sortCode} />}
        <div className="tw-flex tw-flex-col tw-gap-y-3">
          {showWarning() && !suggestion &&
            <>
            <Button
              onClick={() => handleContinueClick()}
              variant="primary"
            >
              {I18n.t("cop.continue_button")}
            </Button>
               <Button onClick={() => setShow(false)} variant="secondary">
            {I18n.t("cop.edit_button")}
          </Button>
            </>
          }
          {(showError() || showEdenredError) &&   
               <Button onClick={() => setShow(false)} variant="secondary">
            {I18n.t("cop.edit_button")}
            </Button>
            }
          {
            showWarning() && suggestion && (
              <>
                <Button
                onClick={() => handleContinueClick(true)}
                variant="primary"
              >
                {I18n.t("cop.use_suggestion")}
              </Button>
              <Button
              onClick={() => handleContinueClick()}
              variant="secondary"
              >
              {I18n.t("cop.continue_with_own_data")}
              </Button>
              </>
            )
          }
        </div>
      </Modal>
      {showSCA && (
        <SCAConfirm actionName={actionName} deviceName={deviceName} challengeId={challengeId} />
      )}
    </>
  );
}

export default COPModal;
