"use client";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { ErrorMessage, Field, Label } from "@/components/fieldset";
import { Input, InputGroup } from "@/components/input";
import { NewRecipientSchema } from "@/models/zod";
import {
  UserCircleIcon,
  CurrencyRupeeIcon,
  AtSymbolIcon,
  PhoneIcon,
  NoSymbolIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import z from "zod";

const postNewRecipient = async (body: z.infer<typeof NewRecipientSchema>) => {
  return fetch("/api/new-recipient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

function AddRecipient() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    endDate: new Date().setDate(new Date().getDate() - 1),
  });
  const [errors, setErrors] = useState<ReturnType<
    typeof z.treeifyError<z.infer<typeof NewRecipientSchema>>
  > | null>(null);

  const { mutate: postRecipient, isPending: isAddingRecipient } = useMutation({
    mutationKey: ["add-recipient"],
    mutationFn: postNewRecipient,
    onSuccess: (data, body) => {},
  });

  const close = () => {
    setIsOpen(false);
  };

  const addRecipient = () => {
    const { success, error, data } = NewRecipientSchema.safeParse({
      ...formData,
      amount: parseFloat(formData.amount),
      endDate: new Date(formData.endDate),
    });

    if (!success) {
      setErrors(z.treeifyError(error));
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        Add Recipient
      </Button>
      <Dialog
        size="xl"
        open={isOpen}
        onClose={isAddingRecipient ? () => {} : close}
      >
        <DialogTitle>Add Recipient</DialogTitle>
        <DialogDescription>
          Please enter the details of the recipient.
        </DialogDescription>
        <DialogBody>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
            <Field>
              <Label>First Name</Label>
              <InputGroup>
                <UserCircleIcon />
                <Input
                  name="firstName"
                  placeholder="John"
                  onChange={handleChange}
                />
              </InputGroup>
              {errors?.properties?.firstName?.errors.length &&
                errors.properties.firstName.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.firstName.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
            <Field>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                placeholder="Doe"
                onChange={handleChange}
              />
              {errors?.properties?.lastName?.errors.length &&
                errors.properties.lastName.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.lastName.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
            <Field>
              <Label>Email</Label>
              <InputGroup>
                <AtSymbolIcon />
                <Input
                  name="email"
                  placeholder="john.doe@example.com"
                  onChange={handleChange}
                />
              </InputGroup>
              {errors?.properties?.email?.errors.length &&
                errors.properties.email.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.email.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
            <Field>
              <Label>Phone</Label>
              <InputGroup>
                <PhoneIcon />
                <Input
                  name="phone"
                  placeholder="1234567890"
                  onChange={handleChange}
                />
              </InputGroup>
              {errors?.properties?.phone?.errors.length &&
                errors.properties.phone.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.phone.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field>
              <Label>Amount</Label>
              <InputGroup>
                <CurrencyRupeeIcon />
                <Input
                  name="amount"
                  type="number"
                  placeholder="100"
                  onChange={handleChange}
                />
              </InputGroup>
              {errors?.properties?.amount?.errors.length &&
                errors.properties.amount.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.amount.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
            <Field>
              <Label>End Date</Label>
              <InputGroup>
                <NoSymbolIcon />
                <Input name="endDate" type="date" onChange={handleChange} />
              </InputGroup>
              {errors?.properties?.endDate?.errors.length &&
                errors.properties.endDate.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.endDate.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
          </div>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={close}
            className="cursor-pointer"
            disabled={isAddingRecipient}
          >
            Cancel
          </Button>
          <Button
            onClick={addRecipient}
            className="cursor-pointer"
            disabled={isAddingRecipient}
          >
            {isAddingRecipient ? (
              <ArrowPathIcon className="animate-spin" />
            ) : (
              "Setup AutoPay"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddRecipient;
