"use client";

import { ErrorMessage, Field } from "@/components/fieldset";
import { Input } from "@/components/input";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/listbox";
import { getCountries } from "@/data";
import { ProfileSchema } from "@/models/zod";
import { Dispatch, SetStateAction, useState } from "react";
import z from "zod";

export function Address({
  address,
  setProfileData,
  errors,
}: {
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  setProfileData: Dispatch<
    SetStateAction<{
      firstname: string;
      lastname: string;
      phone: string;
      email: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    }>
  >;
  errors: ReturnType<
    typeof z.treeifyError<z.infer<typeof ProfileSchema>>
  > | null;
}) {
  const countries = getCountries();
  const [country, setCountry] = useState(
    countries.find((c) => c.code === address.country) || countries[0]
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      <Field className="col-span-2">
        <Input
          aria-label="Address Line 1"
          name="addressLine1"
          placeholder="Address Line 1"
          value={address.addressLine1}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              addressLine1: e.target.value,
            }))
          }
        />
        {errors?.properties?.addressLine1?.errors.length &&
          errors.properties.addressLine1.errors.length > 0 && (
            <ErrorMessage className="text-red-500">
              {errors.properties.addressLine1.errors[0]}
            </ErrorMessage>
          )}
      </Field>
      <Field className="col-span-2">
        <Input
          aria-label="Address Line 2"
          name="addressLine2"
          placeholder="Address Line 2"
          value={address.addressLine2}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              addressLine2: e.target.value,
            }))
          }
        />{" "}
        {errors?.properties?.addressLine2?.errors.length &&
          errors.properties.addressLine2.errors.length > 0 && (
            <ErrorMessage className="text-red-500">
              {errors.properties.addressLine2.errors[0]}
            </ErrorMessage>
          )}
      </Field>
      <Field className="col-span-2">
        <Input
          aria-label="City"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              city: e.target.value,
            }))
          }
        />
        {errors?.properties?.city?.errors.length &&
          errors.properties.city.errors.length > 0 && (
            <ErrorMessage className="text-red-500">
              {errors.properties.city.errors[0]}
            </ErrorMessage>
          )}
      </Field>
      <Field>
        <Listbox
          aria-label="Region"
          name="region"
          placeholder="Region"
          value={address.region}
          onChange={(value) => {
            setProfileData((prev) => ({
              ...prev,
              region: value,
            }));
          }}
        >
          {country.regions.map((region) => (
            <ListboxOption key={region} value={region}>
              <ListboxLabel>{region}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
        {errors?.properties?.region?.errors.length &&
          errors.properties.region.errors.length > 0 && (
            <ErrorMessage className="text-red-500">
              {errors.properties.region.errors[0]}
            </ErrorMessage>
          )}
      </Field>
      <Field>
        <Input
          aria-label="Postal code"
          name="postal_code"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              postalCode: e.target.value,
            }))
          }
        />
        {errors?.properties?.postalCode?.errors.length &&
          errors.properties.postalCode.errors.length > 0 && (
            <ErrorMessage className="text-red-500">
              {errors.properties.postalCode.errors[0]}
            </ErrorMessage>
          )}
      </Field>
      <Field className="col-span-2">
        <Listbox
          aria-label="Country"
          name="country"
          placeholder="Country"
          by="code"
          value={country}
          onChange={(country) => {
            setCountry(country);
            setProfileData((prev) => ({
              ...prev,
              country: country.code,
            }));
          }}
        >
          {countries.map((country) => (
            <ListboxOption key={country.code} value={country}>
              <img className="w-5 sm:w-4" src={country.flagUrl} alt="" />
              <ListboxLabel>{country.name}</ListboxLabel>
            </ListboxOption>
          ))}
        </Listbox>
        {errors?.properties?.country?.errors.length &&
          errors.properties.country.errors.length > 0 && (
            <ErrorMessage className="text-red-500">
              {errors.properties.country.errors[0]}
            </ErrorMessage>
          )}
      </Field>
    </div>
  );
}
