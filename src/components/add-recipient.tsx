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
import { APIError, APIResponse } from "@/models/network";
import { PaymentHashInfo, ValidateVPAResponse } from "@/models/payments";
import { NewRecipientSchema } from "@/models/zod";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import {
  UserCircleIcon,
  CurrencyRupeeIcon,
  AtSymbolIcon,
  PhoneIcon,
  NoSymbolIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import z from "zod";

const postNewRecipient = async (body: z.infer<typeof NewRecipientSchema>) => {
  const response = await fetch("/api/new-recipient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: APIResponse<unknown> = await response.json();
    const error = new APIError(
      errorData.message,
      response.status,
      errorData.data
    );
    throw error;
  }

  return response.json() as Promise<
    APIResponse<{ form: string; paymentHashInfo: PaymentHashInfo }>
  >;
};

const postVpaVerification = async (vpa: string) => {
  const response = await fetch("/api/payment/verify-vpa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vpa }),
  });

  if (!response.ok) {
    const errorData: APIResponse<ValidateVPAResponse> = await response.json();
    const error = new APIError(
      errorData.message,
      response.status,
      errorData.data
    );
    throw error;
  }

  return response.json() as Promise<APIResponse<ValidateVPAResponse>>;
};

function AddRecipient() {
  const [isOpen, setIsOpen] = useState(false);
  const date = new Date();
  date.setDate(new Date().getDate() - 1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    endDate: date.toISOString().split("T")[0], // Default to yesterday
  });
  const [errors, setErrors] = useState<ReturnType<
    typeof z.treeifyError<z.infer<typeof NewRecipientSchema>>
  > | null>(null);
  const [vpa, setVpa] = useState("");
  const [vpaVerified, setVpaVerified] = useState(false);
  const [vpaAccName, setVpaAccName] = useState<string | null>(null);
  const [vpaError, setVpaError] = useState<string | null>(null);
  const payUFormRef = useRef<HTMLDivElement>(null);

  const { mutate: postRecipient, isPending: isAddingRecipient } = useMutation({
    mutationKey: ["add-recipient"],
    mutationFn: postNewRecipient,
  });

  const { mutate: verifyVpa, isPending: isVerifyingVpa } = useMutation({
    mutationKey: ["verify-vpa"],
    mutationFn: postVpaVerification,
  });

  const close = () => {
    setIsOpen(false);
  };

  const verify = () => {
    if (!vpa) {
      setVpaError("VPA cannot be empty.");
      return;
    }

    setVpaError(null);
    verifyVpa(vpa, {
      onSuccess: (res, vpa) => {
        if (res.data.isVPAValid === 0) {
          setVpaVerified(false);
          setVpaError("Invalid VPA. Please check and try again.");
          return;
        }
        setVpaVerified(true);
        setVpaAccName(res.data.payerAccountName);
      },
    });
  };

  const addRecipient = () => {
    const { success, error, data } = NewRecipientSchema.safeParse({
      ...formData,
      amount: parseFloat(formData.amount).toFixed(2),
      endDate: new Date(formData.endDate),
    });

    if (!success) {
      setErrors(z.treeifyError(error));
      return;
    }

    setErrors(null);

    postRecipient(data, {
      onSuccess: async ({ data }) => {
        payUFormRef.current!.innerHTML = data.form;
        payUFormRef.current!.querySelector("form")?.submit();
      },
      onError: (err) => {
        console.error("Error adding recipient:", err);
        setErrors((err as any).data);
      },
    });
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
                  value={formData.firstName}
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
                value={formData.lastName}
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
                  type="email"
                  value={formData.email}
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
                  value={formData.phone}
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
            <Field>
              <Label>Amount</Label>
              <InputGroup>
                <CurrencyRupeeIcon />
                <Input
                  name="amount"
                  type="number"
                  placeholder="100"
                  value={formData.amount}
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
                <Input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </InputGroup>
              {errors?.properties?.endDate?.errors.length &&
                errors.properties.endDate.errors.length > 0 && (
                  <ErrorMessage className="text-red-500">
                    {errors.properties.endDate.errors[0]}
                  </ErrorMessage>
                )}
            </Field>
          </div>
          <Field>
            <Label>VPA (UPI ID)</Label>
            <div className="flex items-center gap-2 mt-3">
              <InputGroup className="flex flex-1">
                <AtSymbolIcon />
                <Input
                  name="vpa"
                  type="text"
                  placeholder="john.doe@upi"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="flex-1"
                />
              </InputGroup>
              <Button
                className="cursor-pointer"
                onClick={verify}
                disabled={isVerifyingVpa}
              >
                {isVerifyingVpa ? (
                  <ArrowPathIcon className="animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            {vpaVerified && (
              <div className="flex items-center gap-2 mt-2 text-green-500">
                <CheckCircleIcon className="h-4 w-4" />
                <p>VPA verified.</p>
              </div>
            )}
            {vpaAccName && (
              <p className="text-green-500">Recipient Name: {vpaAccName}</p>
            )}
            {vpaError && vpaError.length > 0 && (
              <div className="mt-2 text-red-500 flex items-center gap-2">
                <XCircleIcon className="h-4 w-4" />
                <ErrorMessage>{vpaError}</ErrorMessage>
              </div>
            )}
          </Field>
          <div ref={payUFormRef} id="payu-form"></div>
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
            //disabled={isAddingRecipient || !vpaVerified || vpaError != null}
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
