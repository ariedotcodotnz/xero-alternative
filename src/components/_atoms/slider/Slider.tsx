import React, { useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";



interface SliderProps {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  minStep?: number;
  ariaLabel?: string;
  id?: string;
  emitEventToWindow?: boolean;
  customEventName?: string;
}

const Slider = ( {
  value = [9],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  minStep,
  ariaLabel = "slider",
  id,
  emitEventToWindow = true,
  customEventName
}: SliderProps) => {
  const idWithFallback = id || crypto.randomUUID();
  const [displayValue, setDisplayValue] = useState(value[0])
  const [isSliding, setIsSliding] = useState<boolean>(false);

  // Send value to somewhere else
  const sendValue = (inputVal: number[]) => {
    if (emitEventToWindow) {
      const event = new CustomEvent(customEventName || "customSliderEvent", {detail: inputVal});
      document.dispatchEvent(event);
    }
  }

  const updateValues = (inpValue) => {
    setDisplayValue(inpValue)
    sendValue(inpValue)
    if (onValueChange) {
      onValueChange(inpValue)
    }
  }

  const handleSlideStart = () => {
    setIsSliding(true);
  };

  const handleSlideEnd = () => {
    setIsSliding(false);
  };

  return (
    <div className={idWithFallback}>
      <RadixSlider.Root
        className="tw-relative tw-flex tw-h-5 tw-w-full tw-touch-none tw-select-none tw-items-center"
        minStepsBetweenThumbs={minStep ?? step}
        defaultValue={value}
        onValueChange={updateValues}
        onPointerDown={handleSlideStart}
        onPointerUp={handleSlideEnd}
        onBlur={handleSlideEnd}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel}
      >
        <RadixSlider.Track className="tw-relative tw-h-3 tw-grow tw-rounded-full tw-bg-blue-200">
          <RadixSlider.Range className="tw-absolute tw-h-full tw-rounded-full tw-bg-blue" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="tw-block tw-size-5 tw-rounded-xl
          tw-bg-blue 
          hover:tw-bg-blue-700
          focus:tw-shadow-blue-900 focus:tw-outline-none"
          aria-label="Volume"
        > 
          {isSliding && (
            <>
              <div className="slider-tooltip hui-tooltip tw-absolute tw-top-[-30px] tw-translate-x-[-18%] tw-whitespace-nowrap	 " aria-hidden="true" >
                <ChatBubbleBottomCenterIcon className="!tw-text-blue tw-w-8 tw-h-8">  </ChatBubbleBottomCenterIcon>
              </div>
              <div className="tw-w-8 tw-h-8 tw-absolute tw-top-[-27px] tw-translate-x-[-18%] tw-whitespace-nowrap">
                <span className="tw-flex tw-justify-center tw-items-center tw-text-white tw-text-sm">{displayValue}</span> 
              </div>
            </>
          )} 
        </RadixSlider.Thumb>   
      </RadixSlider.Root>
    </div>
  )
}
;

export default Slider;