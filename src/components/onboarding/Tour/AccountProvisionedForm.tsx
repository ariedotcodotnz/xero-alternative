import React, {
  FormEventHandler,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import Confetti from "../../confetti";
import I18n from "../../../utilities/translations";
import {
  postAccountProvisioned,
  fetchBankAccountDetails,
} from "../../../API/onboarding/account_provisioned.api";
import handleError from "../../../API/utils/handleError";
import UkAccountDetailsModule from "../../dashboard/account_details/UkAccountDetailsModule";
import { iAccountProvisionedForm } from "./Shared/types/onboardingTypes";
import { UkUserAccountDetails } from "../../../types/user.type";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import Loader from "../../inputs/_elements/loader";

import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.account_provisioned" };

const NoAccountContent = ({ intercomLink }: { intercomLink: string }) => (
  <div className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden">
    <FormBody>
      <Paragraph>{I18n.t("fail.paragraph_1", ctx)}</Paragraph>
      <Paragraph>{I18n.t("fail.paragraph_2", ctx)}</Paragraph>
      <a
        href={intercomLink}
        className="hnry-button hnry-button--secondary tw-w-full"
      >
        Contact us
      </a>
    </FormBody>
  </div>
);

const AccountDetailsContent = ({
  onSubmit,
  accountDetails,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  accountDetails;
}) => (
  <>
    <div className="tw-flex tw-justify-center">
      <Confetti styles={{ position: "absolute" }} />
    </div>
    <form
      onSubmit={onSubmit}
      className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
    >
      <FormBody>
        <Paragraph>{I18n.t("success.paragraph_1", ctx)}</Paragraph>
        <div className="tw-rounded-lg tw-border tw-border-solid tw-border-gray-300 tw-p-4 tw-pb-6">
          <UkAccountDetailsModule
            currentUser={{ ...accountDetails }}
            eventContext="onboarding"
          />
        </div>
      </FormBody>
    </form>
  </>
);

const AccountProvisionedForm = forwardRef<
  OnboardingTourFormRef,
  iAccountProvisionedForm
>(({ stateUpdate, handleTitleUpdate, userId, intercomLink }, ref) => {
  const [accountDetails, setAccountDetails] =
    useState<UkUserAccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    setCanSubmitForm,
    setPrimaryBtnName,
    setSecondaryBtnName,
    setIsSubmitting,
  } = useOnboardingTour();

  useEffect(() => {
    setPrimaryBtnName("Continue");
    setSecondaryBtnName(null);
  }, [setPrimaryBtnName, setSecondaryBtnName]);

  useEffect(() => {
    setCanSubmitForm(!isLoading);
  }, [setCanSubmitForm, isLoading]);

  const routeToDashboard = () => {
    Turbolinks.visit(Routes.root_path());
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => setUserAction(!!accountDetails?.accountNumber), // Expose the submit function
  }));

  const setUserAction = (accountNumber: boolean) => {
    if (accountNumber) {
      onSubmit();
    } else {
      routeToDashboard();
    }
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await postAccountProvisioned();
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleError(res);
      }
    } catch (err) {
      toastr.error("Something went wrong, please try again");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchBankAccountDetails(userId);
        if (res.status === "ok") {
          const details = res.data.bank_account_details;
          const data: UkUserAccountDetails = {
            accountName: details.account_name,
            accountNumber: details.account_number,
            accountType: "Business",
            bsb: details.bsb,
            fullName: details.full_name,
            jurisdiction: details.jurisdiction,
            bankName: null,
          };
          if (data.accountNumber) {
            setAccountDetails(data);
            setPrimaryBtnName("Continue");
          } else {
            setAccountDetails({
              accountName: null,
              accountNumber: null,
              accountType: null,
              bsb: null,
              fullName: null,
              jurisdiction: null,
              bankName: null,
            });
            setPrimaryBtnName("Go to Dashboard");
          }
          setIsLoading(false);
        } else {
          handleError(res);
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err;
      }
    };

    if (isLoading) fetchData();
  }, [userId, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (accountDetails?.accountNumber) {
        handleTitleUpdate(I18n.t("title_success", ctx));
      } else {
        handleTitleUpdate(I18n.t("title_fail", ctx));
      }
    }
  }, [accountDetails?.accountNumber, handleTitleUpdate, isLoading]);

  if (isLoading) {
    return (
      <div className="tw-my-4 tw-flex tw-justify-center">
        <Loader />
      </div>
    ); // Or handle loading state
  }

  return (
    <FormWrapper>
      {accountDetails?.accountNumber ? (
        <AccountDetailsContent
          onSubmit={onSubmit}
          accountDetails={accountDetails}
        />
      ) : (
        <NoAccountContent intercomLink={intercomLink} />
      )}
    </FormWrapper>
  );
});

AccountProvisionedForm.displayName = "AccountProvisionedForm";
export default AccountProvisionedForm;
