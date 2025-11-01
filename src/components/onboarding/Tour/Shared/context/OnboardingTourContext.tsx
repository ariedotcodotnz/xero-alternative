import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

export interface OnboardingTourFormRef {
  submitForm: () => void;
  submitSecondaryAction?: () => void;
}

interface FormProps {
  canSubmitForm: boolean;
  setCanSubmitForm: Dispatch<SetStateAction<boolean | null>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean | null>>;
}

interface FormButtonProps {
  primaryBtnName: string | null;
  setPrimaryBtnName: Dispatch<SetStateAction<string | null>>;
  secondaryBtnName: string | null;
  setSecondaryBtnName: Dispatch<SetStateAction<string | null>>;
  primaryBtnTestId: string;
  setPrimaryBtnTestId: Dispatch<SetStateAction<string | null>>;
  secondaryActionEvent: TrackClick;
  setSecondaryActionEvent: Dispatch<SetStateAction<TrackClick | null>>;
  menuActionEvent: TrackClick;
  setMenuActionEvent: Dispatch<SetStateAction<TrackClick | null>>;
}

interface OnboardingTourContextProps extends FormProps, FormButtonProps {
  deviceType: userPlatform;
  childContainerHeight: number | null;
  setChildContainerHeight: Dispatch<SetStateAction<number | null>>;
  setIsHeaderShown: Dispatch<SetStateAction<boolean>>;
}

const OnboardingTourContext = createContext<OnboardingTourContextProps>({
  deviceType: null,
  canSubmitForm: false,
  setCanSubmitForm: (updatedSubmitAbility: SetStateAction<boolean | null>) => {
    // No operation, but acknowledges the expected input
    if (typeof updatedSubmitAbility === "function") {
      // If it's a function update, call it with the current value (which is null)
      updatedSubmitAbility(null);
    }
  },
  isSubmitting: false,
  setIsSubmitting: (updateIsSubmitting: SetStateAction<boolean | null>) => {
    // No operation, but acknowledges the expected input
    if (typeof updateIsSubmitting === "function") {
      // If it's a function update, call it with the current value (which is null)
      updateIsSubmitting(null);
    }
  },
  primaryBtnTestId: null,
  setPrimaryBtnTestId: (
    updateSubmitBtnTestId: SetStateAction<string | null>,
  ) => {
    // No operation, but acknowledges the expected input
    if (typeof updateSubmitBtnTestId === "function") {
      // If it's a function update, call it with the current value (which is null)
      updateSubmitBtnTestId(null);
    }
  },
  primaryBtnName: null,
  setPrimaryBtnName: (updateSubmitBtnName: SetStateAction<string | null>) => {
    // No operation, but acknowledges the expected input
    if (typeof updateSubmitBtnName === "function") {
      // If it's a function update, call it with the current value (which is null)
      updateSubmitBtnName(null);
    }
  },
  secondaryBtnName: null,
  setSecondaryBtnName: (
    updateHomeNavBtnName: SetStateAction<string | null>,
  ) => {
    // No operation, but acknowledges the expected input
    if (typeof updateHomeNavBtnName === "function") {
      // If it's a function update, call it with the current value (which is null)
      updateHomeNavBtnName(null);
    }
  },
  secondaryActionEvent: null,
  setSecondaryActionEvent: (
    updateTourEvent: SetStateAction<TrackClick | null>,
  ) => {
    // No operation, but acknowledges the expected input
    if (typeof updateTourEvent === "function") {
      // If it's a function update, call it with the current value (which is null)
      updateTourEvent(null);
    }
  },
  menuActionEvent: null,
  setMenuActionEvent: (
    updateMenuActionEvent: SetStateAction<TrackClick | null>,
  ) => {
    if (typeof updateMenuActionEvent === "function") {
      updateMenuActionEvent(null);
    }
  },
  childContainerHeight: null,
  setChildContainerHeight: (
    updateChildContainerHeightActionEvent: SetStateAction<number | null>,
  ) => {
    if (typeof updateChildContainerHeightActionEvent === "function") {
      updateChildContainerHeightActionEvent(null);
    }
  },
  isHeaderShown: false,
  setIsHeaderShown: (
    updateSetIsHeaderShown: SetStateAction<boolean | null>,
  ) => {
    if (typeof updateSetIsHeaderShown === "function") {
      updateSetIsHeaderShown(null);
    }
  },
});

export const useOnboardingTour = () => useContext(OnboardingTourContext);

interface OnboardingTourProviderProps {
  children: React.ReactNode;
}

type userPlatform =
  | "web_other"
  | "web_ios"
  | "web_android"
  | "native_ios"
  | "native_android";

export const OnboardingTourProvider: React.FC<OnboardingTourProviderProps> = ({
  children,
}) => {
  const [canSubmitForm, setCanSubmitForm] = useState<boolean | null>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean | null>(false);
  const [primaryBtnTestId, setPrimaryBtnTestId] = useState<string | null>(null);
  const [primaryBtnName, setPrimaryBtnName] = useState<string | null>("Next");
  const [secondaryBtnName, setSecondaryBtnName] = useState<string | null>(null);
  const [secondaryActionEvent, setSecondaryActionEvent] =
    useState<TrackClick | null>(null);
  const [menuActionEvent, setMenuActionEvent] = useState<TrackClick | null>(
    null,
  );
  const [childContainerHeight, setChildContainerHeight] = useState<
    number | null
  >(null);
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  const deviceType = document.userPlatform;

  return (
    <OnboardingTourContext.Provider
      value={{
        deviceType,
        canSubmitForm,
        setCanSubmitForm,
        isSubmitting,
        setIsSubmitting,
        primaryBtnTestId,
        setPrimaryBtnTestId,
        primaryBtnName,
        setPrimaryBtnName,
        secondaryBtnName,
        setSecondaryBtnName,
        secondaryActionEvent,
        setSecondaryActionEvent,
        menuActionEvent,
        setMenuActionEvent,
        childContainerHeight,
        setChildContainerHeight,
        isHeaderShown,
        setIsHeaderShown,
      }}
    >
      {children}
    </OnboardingTourContext.Provider>
  );
};
