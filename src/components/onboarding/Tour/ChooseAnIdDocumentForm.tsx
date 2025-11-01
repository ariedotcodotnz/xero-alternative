import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import RadioCardGroupVertical from "@hui/_molecules/radio_card_group/RadioCardGroupVertical";
import { CardOptionData } from "@hui/_molecules/radio_card_group/types";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import Input from "@hui/_atoms/input/Input";
import Datepicker from "@hui/inputs/datepicker/datepicker";
import postFile from "../../../API/onboarding/postFile";
import {
  postChooseAnIdDocument,
  chooseAnIdDocumentDto,
} from "../../../API/onboarding/choose_an_id_document.api";
import handleError, { handleHashedError } from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import {
  iChooseAnIdDocumentForm,
  chooseAnIdDocumentForm,
} from "./Shared/types/onboardingTypes";
import I18n from "../../../utilities/translations";
import { FileUpload } from "../../inputs/file_upload/file_upload";
import Combobox from "../../_molecules/combobox/Combobox";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import getCountries from "./utils/helpers";
import onDateChange from "../../../utilities/onDateChange";

import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.choose_an_id_document" };

const ChooseAnIdDocumentForm = forwardRef<
  OnboardingTourFormRef,
  iChooseAnIdDocumentForm
>(({ stateUpdate, intercomLink }, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    control,
    watch,
    trigger,
  } = useForm<chooseAnIdDocumentForm>({
    mode: "all",
    defaultValues: {
      countryOfIssue: null,
      documentType: null,
      hasUploadedFile: false,
      licenceNumber: null,
      expiresOn: null,
      inputExpiresOn: null,
      passportNumber: null,
    },
  });
  const documentType = watch("documentType");
  const countryList = getCountries();

  const { setCanSubmitForm, setIsSubmitting } = useOnboardingTour();

  const constructAndUploadFile = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await postFile(
        formData,
        Routes.upload_document_api_onboarding_choose_an_id_document_path(),
      );
      if (res.status === "ok") {
        return true;
      }
      handleError(res);
      return false;
    } catch (err) {
      setIsSubmitting(false);
      toastr.error(
        "Something went wrong when submitting the form, please try again",
      );
      throw err;
    }
  };

  const onSubmit = async (body: chooseAnIdDocumentForm) => {
    setIsSubmitting(true);
    try {
      let fileResp = true;
      if (selectedFile) {
        fileResp = await constructAndUploadFile(selectedFile);
      }
      if (fileResp) {
        await submitForm(body);
      }
    } catch (err) {
      toastr.error(
        "Something went wrong when submitting the form, please try again",
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setCanSubmitForm(isValid);
  }, [isValid, setCanSubmitForm]);

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
  }));

  const documentOptions: CardOptionData[] = [
    { name: "Passport", value: "passport" },
    { name: "UK Driving licence", value: "driving_licence" },
  ];

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("hasUploadedFile", true);
    }
    trigger("hasUploadedFile");
  };

  const onRemoveFile = () => {
    setSelectedFile(null);
    setValue("hasUploadedFile", false, { shouldValidate: true });
  };

  const submitForm = async (body: chooseAnIdDocumentForm) => {
    const bodyCopy = { ...body } as chooseAnIdDocumentForm;
    if (bodyCopy.documentType === "driving_licence") {
      bodyCopy.passportNumber = null;
      bodyCopy.countryOfIssue = null;
      bodyCopy.expiresOn = null;
      bodyCopy.inputExpiresOn = null;
    } else if (bodyCopy.documentType === "passport") {
      bodyCopy.licenceNumber = null;
    }
    const formattedRequest = convertCamelToSnakeCase(
      bodyCopy,
    ) as chooseAnIdDocumentDto;

    try {
      const res = await postChooseAnIdDocument(formattedRequest);
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleHashedError(res);
      }
    } catch (err) {
      toastr.error(
        "Something went wrong when submitting the form, please try again",
      );
      throw err;
    }
  };

  const onSuccess = () => {
    setSelectedFile(null);
    setValue("hasUploadedFile", true, { shouldValidate: true });
  };

  return (
    <>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormBody>
            <div className="tw-row-span-9 md:tw-row-span-full">
              <div>
                <Subheading>{I18n.t("heading", ctx)}</Subheading>
                <Paragraph>
                  <>
                    {I18n.t("paragraph", ctx)}{" "}
                    <a href={intercomLink}>get in touch</a>
                  </>
                </Paragraph>
              </div>
              <div className="align-items-center justify-content-center tw-mb-6">
                <Controller
                  control={control}
                  name="documentType"
                  rules={{ required: I18n.t("required.document_type", ctx) }}
                  render={({ field: { onChange, value } }) => (
                    <RadioCardGroupVertical
                      name={"documentType"}
                      cardOptions={documentOptions}
                      value={value}
                      setValue={onChange}
                      required={false}
                    />
                  )}
                />
              </div>
              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="hasUploadedFile"
                  rules={{
                    validate: (value) =>
                      value || I18n.t("required.has_uploaded_file", ctx),
                  }}
                  render={() => (
                    <FileUpload
                      targetObject={{ model: "upload" }}
                      url={Routes.upload_document_api_onboarding_choose_an_id_document_path()}
                      inputProps={{ id: "uploadDocument[file]" }}
                      requestMethod="POST"
                      onFileUpload={handleFileInputChange}
                      onRemoveFile={onRemoveFile}
                      onSuccess={onSuccess}
                      slimSize={true}
                    />
                  )}
                />
                {errors.hasUploadedFile && (
                  <span className="tw-text-sm tw-text-red-600">
                    {" "}
                    {errors.hasUploadedFile.message}{" "}
                  </span>
                )}
              </div>
              {documentType === "passport" ? (
                <>
                  <div className="align-items-center justify-content-center tw-mb-6">
                    <Controller
                      control={control}
                      name="countryOfIssue"
                      rules={{
                        required: I18n.t("required.country_of_issue", ctx),
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Combobox
                          name={"countryOfIssue"}
                          entries={countryList}
                          selectedValue={value}
                          setSelectedValue={onChange}
                          legacyStyles={false}
                          label={I18n.t("label.country_of_issue", ctx)}
                          id={"countryOfIssueCombobox"}
                          openMenuOnFocus={true}
                          placeholder={"Select"}
                          requiredIconOnly={true}
                        />
                      )}
                    />
                  </div>
                  <div className="align-items-center justify-content-center tw-mb-6">
                    <Controller
                      control={control}
                      name="passportNumber"
                      rules={{
                        required: I18n.t("required.passport_number", ctx),
                        maxLength: {
                          value: 9,
                          message: I18n.t("required.passport_number", ctx),
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <Input
                          label={I18n.t("label.passport_number", ctx)}
                          setValue={onChange}
                          onBlur={onBlur}
                          name={name}
                          value={value || ""}
                          invalid={
                            errors.passportNumber &&
                            errors.passportNumber.message
                          }
                          requiredIconOnly={true}
                          stylisedError={false}
                          testId="passportNumber"
                        />
                      )}
                    />
                  </div>
                </>
              ) : null}

              {documentType === "passport" ? (
                <>
                  <div className="tw-mb-6">
                    <Controller
                      control={control}
                      name="inputExpiresOn"
                      rules={{
                        required: I18n.t("expires_on.errors.required", ctx),
                        validate: {
                          expired: (value) =>
                            value > new Date() ||
                            I18n.t("expires_on.errors.expired", ctx),
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <Datepicker
                          label={I18n.t("label.expires_on", ctx)}
                          requiredLabel={true}
                          preset="timeless"
                          invalidText={
                            errors.inputExpiresOn &&
                            errors.inputExpiresOn.message
                          }
                          expandUpwards={true}
                          inputProps={{
                            name,
                            value,
                            onChange: (e) => {
                              onChange(e);
                              onDateChange(e, setValue, "expiresOn");
                              onBlur();
                            },
                          }}
                          legacyStyles={false}
                          locale={
                            window.Hnry?.User?.jurisdiction?.locale || "en-GB"
                          }
                        />
                      )}
                    />
                  </div>
                </>
              ) : null}

              {documentType === "driving_licence" ? (
                <>
                  <div className="tw-mb-6">
                    <Controller
                      control={control}
                      name="licenceNumber"
                      rules={{
                        required: I18n.t(
                          "required.drivers_licence_number",
                          ctx,
                        ),
                        minLength: {
                          value: 16,
                          message: I18n.t(
                            "required.drivers_licence_number_length",
                            ctx,
                          ),
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value, name },
                      }) => (
                        <Input
                          label={I18n.t("label.drivers_licence_number", ctx)}
                          setValue={onChange}
                          onBlur={onBlur}
                          name={name}
                          value={value || ""}
                          invalid={
                            errors.licenceNumber && errors.licenceNumber.message
                          }
                          requiredIconOnly={true}
                          stylisedError={false}
                          testId="licenceNumber"
                        />
                      )}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});

ChooseAnIdDocumentForm.displayName = "ChooseAnIdDocumentForm";
export default ChooseAnIdDocumentForm;
