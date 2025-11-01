import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import ModuleItem, { type ModuleItemProps } from "./ModuleItem";
import SortableItem from "./SortableItem";
import Button from "../_atoms/button/Button";
import {
  updateDashboardSettings,
  getDashboardSettings,
  GetDashboardSettingsSuccessResponse,
  DashboardModule,
  LegacyDashboardSettingsSuccessResponse,
} from "../../API/dashboard.api";
import Loader from "../inputs/_elements/loader";
import I18n from "../../utilities/translations";

const Content = () => {
  const [items, setItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null); // The module that has been dragged
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [moduleData, setModuleData] = useState<ModuleItemProps["moduleData"]>(
    {},
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // TODO: Remove the temporary translate function below once these
  // components have been updated to consume the updated API response

  const tempTranslateApiResponse = (
    response: GetDashboardSettingsSuccessResponse,
  ): LegacyDashboardSettingsSuccessResponse => {
    const { code } = response;
    const ordered = response.data.map((item) => item.key);
    const data = response.data.reduce(
      (accumulator, current) => {
        accumulator[current.key] = {
          alt: current.alt,
          description: current.description,
          enabled: current.enabled,
          title: current.title,
        };

        return accumulator;
      },
      {} as Record<string, Omit<DashboardModule, "key">>,
    );

    return { code, data, ordered };
  };

  // Fetch the current module orders
  useEffect(() => {
    const fetchData = async () => {
      const response = await getDashboardSettings();
      if (!("data" in response)) {
        throw new Error("Failed to fetch dashboard settings");
      }
      const { data, ordered } = tempTranslateApiResponse(response);
      setModuleData(data);
      setItems(ordered);
    };

    fetchData().catch((err: string) => {
      // eslint-disable-next-line no-console
      console.warn("Unable to retrieve data for dashboard settings", {
        err,
      });
    });
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over?.id) {
      setItems((itms) => {
        const oldIndex = itms.indexOf(active.id.toString());
        const newIndex = itms.indexOf(over.id.toString());

        return arrayMove(itms, oldIndex, newIndex);
      });
      setDisabledSubmit(false);
      window.unsaved_changes = true;
      window.analytics.track("dashboard_settings_module_dragged");
    }
    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const resetSubmit = () => {
    setDisabledSubmit(false);
    setSubmitting(false);
  };

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    setDisabledSubmit(true);
    setSubmitting(true);
    window.unsaved_changes = false;
    window.analytics?.track("dashboard_settings_save_btn_clicked");

    const tempTranslateItemsToNewResponse = (localItems: string[]) => {
      const tempItems = localItems.map((key: string) => ({
        key,
        enabled: true,
      }));
      return { items: tempItems };
    };

    updateDashboardSettings(tempTranslateItemsToNewResponse(items))
      .then((response) => {
        const { message, code } = response;
        if (code === "ok") {
          // escape() which is not longer support
          // eslint-disable-next-line xss/no-location-href-assign, no-undef, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
          window.location.href = encodeURI(Routes.root_path());
        } else {
          toastr.error(message);
          resetSubmit();
        }
      })
      .catch((error: string) => {
        // eslint-disable-next-line no-console
        console.warn("User unable to save dashboard settings", {
          error,
        });
        toastr.error(I18n.t("dashboard_settings.catch_error_message"));
        resetSubmit();
      });
  };

  return (
    <>
      {items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {/* The static module list */}
            <ol className="dashboard-modules-container">
              {items.map((id) => (
                <li key={`sortable-item-${id}`}>
                  <SortableItem
                    moduleData={moduleData}
                    key={`sortable-item-${id}`}
                    id={id}
                    dashedBorder={activeId === id}
                  />
                </li>
              ))}
            </ol>
          </SortableContext>

          {/* The overlay when a module is dragging */}
          <DragOverlay adjustScale>
            {activeId ? (
              <ol>
                <li>
                  <ModuleItem id={activeId} moduleData={moduleData} />
                </li>
              </ol>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="tw-my-32 tw-flex tw-min-h-[20rem] tw-flex-col tw-items-center tw-justify-between sm:tw-my-80">
          <Loader />
        </div>
      )}

      {/* Footer */}
      <div className="tw-mt-8 tw-flex tw-flex-col tw-justify-between tw-gap-4 sm:tw-flex-row-reverse">
        <Button
          disabled={disabledSubmit}
          onClick={handleSubmit}
          loading={submitting}
        >
          Save dashboard layout
        </Button>
        <a
          className="hnry-button hnry-button--secondary !tw-hidden md:!tw-block"
          // eslint-disable-next-line no-undef, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          href={Routes.root_path()}
          data-track-click={JSON.stringify({
            eventName: "dashboard_settings_cancel_btn_clicked",
            data: { ordered: items },
          })}
        >
          Cancel
        </a>
      </div>
    </>
  );
};

export default Content;
