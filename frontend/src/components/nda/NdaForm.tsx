"use client";

import type { NdaFormData } from "@/types/nda";
import { FormField } from "@/components/ui/FormField";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Props {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const radioClass = "mr-2";

type PartyPrefix = "party1" | "party2";

function PartyFieldGroup({
  prefix,
  data,
  set,
}: {
  prefix: PartyPrefix;
  data: NdaFormData;
  set: <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) => void;
}) {
  return (
    <>
      <FormField label="Name">
        <input
          type="text"
          className={inputClass}
          placeholder="Full name"
          value={data[`${prefix}Name`]}
          onChange={(e) => set(`${prefix}Name`, e.target.value)}
        />
      </FormField>
      <FormField label="Title">
        <input
          type="text"
          className={inputClass}
          placeholder="Job title"
          value={data[`${prefix}Title`]}
          onChange={(e) => set(`${prefix}Title`, e.target.value)}
        />
      </FormField>
      <FormField label="Company">
        <input
          type="text"
          className={inputClass}
          placeholder="Company name"
          value={data[`${prefix}Company`]}
          onChange={(e) => set(`${prefix}Company`, e.target.value)}
        />
      </FormField>
      <FormField label="Notice Address" hint="Email or postal address">
        <input
          type="text"
          className={inputClass}
          placeholder="Email or postal address"
          value={data[`${prefix}NoticeAddress`]}
          onChange={(e) => set(`${prefix}NoticeAddress`, e.target.value)}
        />
      </FormField>
    </>
  );
}

function parseYear(value: string): number | null {
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 1) return null;
  return Math.min(n, 10);
}

export default function NdaForm({ data, onChange }: Props) {
  const set = <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <form className="space-y-1" onSubmit={(e) => e.preventDefault()}>
      <SectionHeader title="Purpose" />
      <FormField label="Purpose" hint="How Confidential Information may be used">
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          value={data.purpose}
          onChange={(e) => set("purpose", e.target.value)}
        />
      </FormField>

      <SectionHeader title="Dates &amp; Term" />
      <FormField label="Effective Date">
        <input
          type="date"
          className={inputClass}
          value={data.effectiveDate}
          onChange={(e) => set("effectiveDate", e.target.value)}
        />
      </FormField>

      <FormField label="MNDA Term" hint="The length of this MNDA">
        <div className="space-y-2">
          <label className="flex items-center text-sm">
            <input
              type="radio"
              className={radioClass}
              checked={data.mndaTermType === "expires"}
              onChange={() => set("mndaTermType", "expires")}
            />
            Expires after
            <input
              type="number"
              min={1}
              max={10}
              className="mx-2 w-16 border border-gray-300 rounded px-2 py-1 text-sm"
              value={data.mndaTermYears}
              onChange={(e) => {
                const v = parseYear(e.target.value);
                if (v !== null) set("mndaTermYears", v);
              }}
            />
            year(s) from Effective Date
          </label>
          <label className="flex items-center text-sm">
            <input
              type="radio"
              className={radioClass}
              checked={data.mndaTermType === "continuous"}
              onChange={() => set("mndaTermType", "continuous")}
            />
            Continues until terminated
          </label>
        </div>
      </FormField>

      <FormField label="Term of Confidentiality" hint="How long Confidential Information is protected">
        <div className="space-y-2">
          <label className="flex items-center text-sm">
            <input
              type="radio"
              className={radioClass}
              checked={data.confidentialityTermType === "fixed"}
              onChange={() => set("confidentialityTermType", "fixed")}
            />
            <input
              type="number"
              min={1}
              max={10}
              className="mx-2 w-16 border border-gray-300 rounded px-2 py-1 text-sm"
              value={data.confidentialityTermYears}
              onChange={(e) => {
                const v = parseYear(e.target.value);
                if (v !== null) set("confidentialityTermYears", v);
              }}
            />
            year(s) from Effective Date
          </label>
          <label className="flex items-center text-sm">
            <input
              type="radio"
              className={radioClass}
              checked={data.confidentialityTermType === "perpetual"}
              onChange={() => set("confidentialityTermType", "perpetual")}
            />
            In perpetuity
          </label>
        </div>
      </FormField>

      <SectionHeader title="Governing Law &amp; Jurisdiction" />
      <FormField label="Governing Law" hint="State">
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. Delaware"
          value={data.governingLaw}
          onChange={(e) => set("governingLaw", e.target.value)}
        />
      </FormField>
      <FormField label="Jurisdiction" hint="City or county and state">
        <input
          type="text"
          className={inputClass}
          placeholder='e.g. "courts located in New Castle, DE"'
          value={data.jurisdiction}
          onChange={(e) => set("jurisdiction", e.target.value)}
        />
      </FormField>

      <SectionHeader title="Party 1" />
      <PartyFieldGroup prefix="party1" data={data} set={set} />

      <SectionHeader title="Party 2" />
      <PartyFieldGroup prefix="party2" data={data} set={set} />
    </form>
  );
}
