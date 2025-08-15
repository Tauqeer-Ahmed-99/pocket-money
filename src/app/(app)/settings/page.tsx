"use client";

import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { ErrorMessage, Field } from "@/components/fieldset";
import { Heading, Subheading } from "@/components/heading";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import SetupProfileBanner from "@/components/setup-profile-banner";
import { Text } from "@/components/text";
import useProfile from "@/hooks/useProfile";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { APIError, APIStatus, ErrorCode } from "@/models/network";
import { ProfileSchema } from "@/models/zod";
import { useUser } from "@clerk/nextjs";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import z from "zod";
import { Address } from "./address";

export default function Settings() {
  const { user } = useUser();

  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "Select Region",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<ReturnType<
    typeof z.treeifyError<z.infer<typeof ProfileSchema>>
  > | null>(null);

  const { data: userProfile } = useProfile();

  const { mutate: saveProfile, isPending: isSavingProfile } =
    useUpdateProfile();

  const queryClient = useQueryClient();

  const initProfile = () => {
    setProfileData({
      firstname: userProfile?.data?.firstname || user?.firstName || "",
      lastname: userProfile?.data?.lastname || user?.lastName || "",
      phone:
        userProfile?.data?.phone || user?.phoneNumbers[0]?.phoneNumber || "",
      email:
        userProfile?.data?.email || user?.emailAddresses[0]?.emailAddress || "",
      addressLine1: userProfile?.data?.addressLine1 || "",
      addressLine2: userProfile?.data?.addressLine2 || "",
      city: userProfile?.data?.city || "",
      region: userProfile?.data?.region || "Select Region",
      postalCode: userProfile?.data?.postalCode || "",
      country: userProfile?.data?.country || "",
    });
  };

  useEffect(() => {
    initProfile();
  }, [user, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    initProfile();
    setErrors(null);
  };

  const handleSaveProfile = () => {
    const { success, error, data } = ProfileSchema.safeParse(profileData);

    if (!success) {
      setErrors(z.treeifyError(error));
      return;
    }

    setErrors(null);

    saveProfile(data, {
      onSuccess: (response) => {
        if (response.status === APIStatus.Success) {
          queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
        }
      },
      onError: (err) => {
        console.error("Error saving profile:", err);
        setErrors((err as APIError).data);
      },
    });
  };

  const changed =
    JSON.stringify(profileData) !==
    JSON.stringify({
      firstname: userProfile?.data?.firstname,
      lastname: userProfile?.data?.lastname,
      phone: userProfile?.data?.phone,
      email: userProfile?.data?.email,
      addressLine1: userProfile?.data?.addressLine1,
      addressLine2: userProfile?.data?.addressLine2,
      city: userProfile?.data?.city,
      region: userProfile?.data?.region,
      postalCode: userProfile?.data?.postalCode,
      country: userProfile?.data?.country,
    });

  const isProfileNotSetup = userProfile?.errorCode === ErrorCode.ProfileNotSet;

  return (
    <div className="mx-auto max-w-4xl">
      <Heading>Profile</Heading>

      <Text className="my-2">
        Save button will appear in the bottom once you start making changes.
      </Text>

      {isProfileNotSetup && <SetupProfileBanner onProfilePage />}

      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>First Name</Subheading>
          <Text>This will be used in your transaction details.</Text>
        </div>
        <div>
          <Field>
            <Input
              aria-label="First Name"
              name="firstname"
              placeholder="John"
              value={profileData.firstname}
              onChange={handleChange}
            />
            {errors?.properties?.firstname?.errors.length &&
              errors.properties.firstname.errors.length > 0 && (
                <ErrorMessage className="text-red-500">
                  {errors.properties.firstname.errors[0]}
                </ErrorMessage>
              )}
          </Field>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Last Name</Subheading>
          <Text>This will be used in your transaction details.</Text>
        </div>
        <div>
          <Field>
            <Input
              aria-label="Last Name"
              name="lastname"
              placeholder="Doe"
              value={profileData.lastname}
              onChange={handleChange}
            />
            {errors?.properties?.lastname?.errors.length &&
              errors.properties.lastname.errors.length > 0 && (
                <ErrorMessage className="text-red-500">
                  {errors.properties.lastname.errors[0]}
                </ErrorMessage>
              )}
          </Field>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Phone</Subheading>
          <Text>
            This will be used in your transaction details and for all the
            communications.
          </Text>
        </div>
        <div>
          <Field>
            <Input
              aria-label="Phone"
              name="phone"
              placeholder="1234567890"
              value={profileData.phone}
              onChange={handleChange}
            />
            {errors?.properties?.phone?.errors.length &&
              errors.properties.phone.errors.length > 0 && (
                <ErrorMessage className="text-red-500">
                  {errors.properties.phone.errors[0]}
                </ErrorMessage>
              )}
          </Field>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Email</Subheading>
          <Text>
            This will be used in your transaction details and for all the
            communications.
          </Text>
        </div>
        <div className="space-y-4">
          <Field>
            <Input
              type="email"
              aria-label="Email"
              name="email"
              placeholder="info@example.com"
              value={profileData.email}
              onChange={handleChange}
              disabled
            />
            {errors?.properties?.email?.errors.length &&
              errors.properties.email.errors.length > 0 && (
                <ErrorMessage className="text-red-500">
                  {errors.properties.email.errors[0]}
                </ErrorMessage>
              )}
          </Field>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Address</Subheading>
          <Text>This is where your primary communication takes place.</Text>
        </div>
        <Address
          address={{
            addressLine1: profileData.addressLine1,
            addressLine2: profileData.addressLine2,
            city: profileData.city,
            region: profileData.region,
            postalCode: profileData.postalCode,
            country: profileData.country,
          }}
          setProfileData={setProfileData}
          errors={errors}
        />
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Currency</Subheading>
          <Text>The default currency that you will be using.</Text>
        </div>
        <div>
          <Select
            aria-label="Currency"
            name="currency"
            defaultValue="inr"
            disabled
          >
            <option value="inr">INR - Indian Rupees</option>
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="usd">USD - United States Dollar</option>
          </Select>
        </div>
      </section>

      {changed && (
        <>
          <Divider className="my-10" soft />

          <div className="flex justify-end gap-4">
            <Button
              plain
              className="cursor-pointer"
              onClick={reset}
              disabled={isSavingProfile}
            >
              Reset
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? (
                <ArrowPathIcon className="animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
