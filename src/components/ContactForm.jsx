import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeftIcon, SaveIcon } from "./Icons";

const emptyContact = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  company: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 transition " +
  "placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/20";

function pickFields(initial) {
  const values = { ...emptyContact };
  Object.keys(values).forEach((key) => {
    values[key] = initial?.[key] ?? "";
  });
  return values;
}

function Section({ title, subtitle, children, last }) {
  return (
    <section
      className={last ? "pt-8" : "border-b border-slate-200 py-8 first:pt-6"}
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mb-5 text-sm text-slate-500">{subtitle}</p>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ id, label, required, error, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-2 block font-medium text-slate-900">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({
  initialValues,
  submitLabel,
  isSubmitting,
  serverError,
  onSubmit,
}) {
  const [form, setForm] = useState(() => pickFields(initialValues));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "กรุณากรอกชื่อจริง";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const inputProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: inputClass,
  });

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white px-5 py-8 sm:px-8"
    >
      <p className="text-sm text-slate-500">ช่องที่มี * จำเป็นต้องกรอก</p>

      <Section title="ข้อมูลบุคคล" subtitle="เริ่มจากชื่อที่ใช้เรียกบุคคลนี้">
        <Field
          id="firstName"
          label="firstName (ชื่อจริง)"
          required
          error={errors.firstName}
        >
          <input {...inputProps("firstName")} autoComplete="given-name" />
        </Field>
        <Field id="lastName" label="lastName (นามสกุล)">
          <input {...inputProps("lastName")} autoComplete="family-name" />
        </Field>
      </Section>

      <Section title="ช่องทางติดต่อ" subtitle="ใส่ช่องทางที่ใช้ติดต่อ">
        <Field id="email" label="email (อีเมล)" error={errors.email}>
          <input {...inputProps("email")} type="email" autoComplete="email" />
        </Field>
        <Field id="phone" label="phone (เบอร์โทร)">
          <input {...inputProps("phone")} type="tel" autoComplete="tel" />
        </Field>
        <Field id="address" label="address (ที่อยู่)" full>
          <textarea
            {...inputProps("address")}
            rows={6}
            className={`${inputClass} resize-y`}
          />
        </Field>
      </Section>

      <Section title="การทำงาน" subtitle="ใส่บริษัทหากต้องการ" last>
        <Field id="company" label="company (บริษัท)">
          <input {...inputProps("company")} autoComplete="organization" />
        </Field>
      </Section>

      {serverError && (
        <p
          role="alert"
          className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700"
        >
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 font-medium text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ArrowLeftIcon />
          กลับไปรายการ
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SaveIcon />
          {isSubmitting ? "กำลังบันทึก..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
