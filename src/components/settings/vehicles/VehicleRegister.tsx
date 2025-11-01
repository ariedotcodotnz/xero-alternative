import React, { useCallback, useEffect, useState } from "react"
import _ from "lodash"
import I18n from "../../../utilities/translations"
import { getAllVehicles } from "../../../API/vehicles.api"
import Icon from "../../icon/Icon"
import { removeButtonPopOver } from "../../utils/base_helper"
import VehicleRegisterForm from "./VehicleRegisterForm"

type VehicleType = {
  id: number
  registration: string
  make_and_model: string
  fuel_type: string
}

interface SaveButtonSettings {
  text: string
  type: "submit"
  className: string
}

interface iActionButton {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  label: string
  type: string
}

interface VehicleRegisterProps {
  saveButtonSettings: SaveButtonSettings
  fuelTypes: string[]
  editableVehicles: number[]
}

const IconButton = ({ onClick, disabled, label, type }: iActionButton) => (
  <Icon
    label={label}
    type={type}
    asButton
    onClick={onClick}
    className="tw-w-9 tw-h-9 tw-p-2"
    popover={{ placement: "top", content: label }}
    disabledIconButton={disabled}
  />
)

const ctx = { scope: "users.vehicles" }

const VehicleRegister = ({
  saveButtonSettings,
  fuelTypes,
  editableVehicles
}: VehicleRegisterProps) => {
  const [vehicles, setVehicles] = useState<VehicleType[]>([])
  const [addingVehicle, setAddingVehicle] = useState(false)
  const [editingVehicleId, setEditingVehicleId] = useState<number>(null)
  const [newlyCreatedVehicleIds, setNewlyCreatedVehicleIds] = useState<number[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const fetchVehicles = async () => {
      try {
        const data = await getAllVehicles()
        setVehicles(data)
        setAddingVehicle(data.length === 0)
      } catch (error) {
        toastr.error(I18n.t("fetch.failure", ctx))
      }
    }

    fetchVehicles()

    return () => controller.abort()
  }, [])

  const handleVehicleUpdate = useCallback((updatedVehicles: VehicleType[]) => {
    const previousIds = vehicles.map(v => v.id)
    const newVehicles = updatedVehicles.filter(v => !previousIds.includes(v.id))
    const newVehicleIds = newVehicles.map(v => v.id)

    if (newVehicleIds.length > 0) {
      setNewlyCreatedVehicleIds(prev => [...prev, ...newVehicleIds])
    }

    setVehicles(updatedVehicles)
    setAddingVehicle(false)
    setEditingVehicleId(null)
    removeButtonPopOver()
    window.unsaved_changes = false
  }, [vehicles])

  const handleEditClick = useCallback((vehicleId: number) => {
    setEditingVehicleId(vehicleId)
    removeButtonPopOver()
  }, [])

  const handleAddVehicleClick = useCallback(() => {
    setAddingVehicle(prev => !prev)
    removeButtonPopOver()
  }, [])

  return (
    <div className="tw-mb-8">
      <table className="hui-table">
        <thead className="thead">
          <tr>
            <th className="th">{I18n.t("categories.registration", ctx)}</th>
            <th className="th">{I18n.t("categories.make_and_model", ctx)}</th>
            <th className="th">{I18n.t("categories.fuel_type", ctx)}</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => {
            const isEditing = editingVehicleId === vehicle.id
            const isEditable =
              newlyCreatedVehicleIds.includes(vehicle.id) ||
              editableVehicles.includes(vehicle.id)
            const key = vehicles.indexOf(vehicle)

            if (isEditing) {
              return (
                <VehicleRegisterForm
                  key={`vehicle-${key}`}
                  editing={true}
                  vehicle={vehicle}
                  onSuccess={handleVehicleUpdate}
                  saveButtonSettings={saveButtonSettings}
                  ctx={ctx}
                  fuelTypes={fuelTypes}
                />
              )
            }

            return (
              <tr key={`vehicle-${key}`}>
                <td className="td tw-w-4/12">{vehicle.registration}</td>
                <td className="td tw-w-4/12">{vehicle.make_and_model}</td>
                <td className="td tw-w-6/12">
                  <div className="tw-flex tw-justify-between tw-items-center">
                    <span>
                      {vehicle.fuel_type ? _.capitalize(vehicle.fuel_type) : ""}
                    </span>
                    {isEditable ? (
                      <IconButton
                        disabled={false}
                        label={I18n.t("hovers.edit_button", ctx)}
                        type="actions/edit"
                        onClick={() => handleEditClick(vehicle.id)}
                      />
                    ) : (
                      <Icon
                        className="tw-w-9 tw-h-9 tw-p-2 tw-invisible"
                        disabled={true}
                        label={I18n.t("update.edit_disabled", ctx)}
                        popover={{ placement: "top", content: I18n.t("update.edit_disabled", ctx) }}
                        type={"actions/edit"}
                      />
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
          {addingVehicle && (
            <VehicleRegisterForm
              editing={false}
              onSuccess={handleVehicleUpdate}
              saveButtonSettings={saveButtonSettings}
              ctx={ctx}
              fuelTypes={fuelTypes}
            />
          )}
        </tbody>
      </table>
      <div className="tw-flex tw-gap-4 tw-flex-col sm:tw-flex-row-reverse tw-justify-between">
        <IconButton
          label={addingVehicle ? "Cancel" : "Add Vehicle"}
          type={addingVehicle ? "cross-circle" : "actions/add"}
          onClick={handleAddVehicleClick}
        />
      </div>
    </div>
  )
}

export default VehicleRegister
